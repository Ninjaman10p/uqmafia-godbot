/*
If you're seeing this, cograts, you've successfully hacked this
 *open source project* and leaked the source code.
*/

// vanilla js because I'm evil
// we use http because it will be sitting *behind* a https nginx relay
import * as http from "http";
import * as fs from "fs/promises";

import { GameCode, randomGameCode, Game } from "./game.mjs";
import * as api from "../shared/api.mjs";
import { Uuid, ApiFailure } from "../shared/api.mjs";

const readFile = async (filepath: string): Promise<Buffer | null> => {
    let handle;
    try {
        handle = await fs.open(filepath);
        return await handle.readFile();
    } catch {
        return null;
    } finally {
        handle?.close();
    }
};

const sendFile = async (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    filepath: string,
) => {
    console.log(`Delivering ${filepath} to ${req.socket.remoteAddress}`);
    const page = await readFile(filepath);
    if (page == null) return error404(req, res);
    res.writeHead(200);
    res.end(page);
};

/*
 * Responds with an error 404
 */
const error404 = (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(404);
    res.end("error 404");
};

/* Converts a handler into a POST API.
 *
 * Takes the message body from req, runs it as JSON
 * through handler, then responds to res with the result
 */
const POSTApi = async <T, R extends object>(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    handler: (message: T) => Promise<R>,
) => {
    let rawBody = "";
    for await (const chunk of req) {
        rawBody += chunk;
    }
    const jsonBody = JSON.parse(rawBody);
    try {
        const jsonResponse = await handler(jsonBody);
        const failure = api.filterFailure(jsonResponse);
        if (failure) {
            res.writeHead(failure.failureCode);
            return res.end(JSON.stringify(failure));
        }
        res.writeHead(200);
        return res.end(JSON.stringify(jsonResponse));
    } catch (e) {
        console.error(e);
        res.writeHead(500);
        return res.end("Internal Server Error or malformed query");
    }
};

export class Server {
    games: Map<GameCode, Game>;

    constructor() {
        this.games = new Map<GameCode, Game>();
    }

    echo = async (body: object): Promise<object> => {
        return body;
    };

    newGame = async (
        request: api.NewGameRequest,
    ): Promise<api.NewGameResponse> => {
        const gameid = randomGameCode();
        const userid = crypto.randomUUID();
        const game = new Game(userid);
        this.games.set(gameid, game);
        console.log(`Starting game ${gameid}`);
        return {
            gameid: gameid,
            userid: userid,
        };
    };

    joinGame = async (
        request: api.JoinGameRequest,
    ): Promise<api.JoinGameResponse> => {
        const game = this.games.get(request.gameid);
        if (game == null)
            return {
                failureCode: 404,
                message: `Game ${request.gameid} not found`,
            };
        const userid = crypto.randomUUID();
        game.addUser(userid, request.name);
        return { userid: userid };
    };

    requestListener = async (
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ) => {
        let url = req.url;
        if (url == undefined) return error404(req, res);
        switch (req.url) {
            case "/":
                url = "/index";
            // because there's no break here, it'll keep going
            case "/admin":
            case "/player":
                return sendFile(req, res, `static${url}.html`);
            case "/api/echo":
                return POSTApi(req, res, this.echo);
            case "/api/joingame":
                return POSTApi(req, res, this.joinGame);
            case "/api/newgame":
                return POSTApi(req, res, this.newGame);
            default:
                // deliver static files
                const staticFilepath = url.match(/(?<=^\/static\/).*/);
                if (staticFilepath != null)
                    return sendFile(req, res, `static/${staticFilepath[0]}`);

                // deliver code files
                const codeFilepath = url.match(/(?<=^\/script\/).*/);
                if (codeFilepath != null) {
                    res.setHeader("Content-Type", "text/javascript");
                    return sendFile(req, res, `out/${codeFilepath[0]}`);
                }
                return error404(req, res);
        }
    };
}

const main = (port: number) => {
    console.log(`Starting server on port ${port}`);
    const server = new Server();
    http.createServer(server.requestListener).listen(port);
};

main(8080);

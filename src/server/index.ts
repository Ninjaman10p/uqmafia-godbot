/*
If you're seeing this, cograts, you've successfully hacked this
 *open source project* and leaked the source code.
*/

// vanilla js because I'm evil
// we use http because it will be sitting *behind* a https nginx relay
import * as http from "http";
import * as fs from "fs/promises";

import { test } from "./test-import";

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
    handler: (message: T) => R,
) => {
    let rawBody = "";
    for await (const chunk of req) {
        rawBody += chunk;
    }
    const jsonBody = JSON.parse(rawBody);
    try {
        const jsonResponse = handler(jsonBody);
        res.writeHead(200);
        res.end(JSON.stringify(jsonResponse));
    } catch {
        res.writeHead(400);
        res.end("Request probably doesn't match interface");
    }
};

class Server {
    Server() {}

    echo = (body: object) => {
        return body;
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
            default:
                // deliver static files
                const staticFilepath = url.match(/(?<=^\/static\/).*/);
                if (staticFilepath != null)
                    return sendFile(req, res, `static/${staticFilepath[0]}`);

                // deliver code files
                const codeFilepath = url.match(/(?<=^\/script\/).*/);
                if (codeFilepath != null)
                    return sendFile(req, res, `out/${codeFilepath[0]}`);
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

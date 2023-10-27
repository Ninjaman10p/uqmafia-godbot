/*
If you're seeing this, cograts, you've successfully hacked this
 *open source project* and leaked the source code.
*/

// vanilla js because I'm evil
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
    if (page == null) return error404(res);
    res.writeHead(200);
    res.end(page);
};

const error404 = (res: http.ServerResponse) => {
    res.writeHead(404);
    res.end("error 404");
};

class Server {
    Server() {
    }

    requestListener = async (
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ) => {
        let url = req.url;
        if (url == undefined) return error404(res);
        switch (req.url) {
            case "/":
                url = "/index";
            // because there's no break here, it'll keep going
            case "/admin":
            case "/player":
                return sendFile(req, res, `static${url}.html`);
            default:
                // TODO apis

                // deliver static files
                const staticFilepath = url.match(/(?<=^\/static\/).*/);
                if (staticFilepath != null)
                    return sendFile(req, res, `static/${staticFilepath[0]}`);

                // deliver code files
                const codeFilepath = url.match(/(?<=^\/script\/).*/);
                if (codeFilepath != null)
                    return sendFile(req, res, `out/${codeFilepath[0]}`);
                return error404(res);
        }
    };
}

const main = (port: number) => {
    console.log(`Starting server on port ${port}`);
    const server = new Server();
    http.createServer(server.requestListener).listen(port);
};

main(8080);
// vanilla js because I'm evil
import * as http from "http";
import * as fs from "fs/promises";

const requestListener = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => {

}

const main = (port: number) => {
    console.log(`Starting server on port ${port}`);
    http.createServer(requestListener).listen(port);
}

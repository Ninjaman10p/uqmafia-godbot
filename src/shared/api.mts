import { PlayerMessage } from "../server/role.mjs";
import { GameCode } from "../server/game.mjs";

export type Uuid = `${string}-${string}-${string}-${string}-${string}`;

// add the APIs here
// try to find some way to condense this to one thing
export function getAPI(
    url: "/api/newgame",
    data: NewGameRequest,
): Promise<NewGameResponse>;
export function getAPI(
    url: "/api/joingame",
    data: JoinGameRequest,
): Promise<JoinGameResponse>;
export function getAPI(url: "/api/echo", data: object): Promise<object>;
export async function getAPI(url: unknown, data: unknown): Promise<unknown> {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    return await response.json();
}

export function filterFailure(message: object): ApiFailure | null {
    if ("failureCode" in message && "message" in message)
        return message as ApiFailure;
    return null;
}

export interface ApiFailure {
    failureCode: number;
    message: string;
}

// split this up over message types
export interface PlayerClientMessage {
    userid: Uuid; // should be stored in a cookie
}

export interface PlayerServerResponse {
    gameid: GameCode;
    messages: PlayerMessage[];
}

export interface JoinGameRequest {
    gameid: GameCode;
    name: string;
    // handin tokens
}

export type JoinGameResponse = JoinGameSuccess | ApiFailure;

interface JoinGameSuccess {
    userid: Uuid;
}

export interface NewGameRequest {}

export interface NewGameResponse {
    gameid: GameCode;
    userid: Uuid;
}

// split this one up too
export interface AdminClientMessage {
    userid: Uuid;
}

export interface AdminServerResponse {
    gameid: Uuid;
}

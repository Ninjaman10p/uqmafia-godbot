import { PlayerMessage } from "../server/role";

// split this up over message types
export interface PlayerClientMessage {
    userid: string; // should be stored in a cookie
}

export interface PlayerServerResponse {
    gameid: string;
    messages: PlayerMessage[];
}

export interface JoinGameRequest {
    gameid: string;
    name: string;
    // handin tokens
}

export interface JoinGameResponse {
    new_userid: string;
}

// split this one up too
export interface AdminClientMessage {
    userid: string;
}

export interface AdminServerResponse {
    gameid: string;
}

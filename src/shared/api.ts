import { PlayerMessage } from "../server/role";

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

export interface AdminClientMessage {
    userid: string;
}

export interface AdminServerResponse {
    gameid: string;
}

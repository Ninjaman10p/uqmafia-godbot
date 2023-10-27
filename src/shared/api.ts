import { PlayerMessage } from "../server/role";

export interface PlayerClientMessage {
    userid: string; // should be stored in a cookie
}

export interface PlayerServerResponse {
    gameid: string;
    messages: PlayerMessage[];
}

export interface AdminClientMessage {
    userid: string;
}

export interface AdminServerResponse {
    gameid: string;
}

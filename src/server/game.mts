import { Player } from "./role.mjs";
import { Uuid } from "../shared/api.mjs";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type GameCode = `${Digit}${Digit}${Digit}`;

export function randomGameCode(): GameCode {
    const digits: Digit[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const a = digits[Math.floor(Math.random() * 10)];
    const b = digits[Math.floor(Math.random() * 10)];
    const c = digits[Math.floor(Math.random() * 10)];
    return `${a}${b}${c}`;
}

export class Game {
    admin: string;
    players: Map<Uuid, Player>;

    constructor(admin: string) {
        this.admin = admin;
        this.players = new Map();
    }

    addUser(userid: Uuid, name: string) {
        console.log(`adding user ${userid}`);
    }
}

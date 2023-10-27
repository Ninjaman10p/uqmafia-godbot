type Event = "Nightfall" | "Morning" | "Lynched";

export interface PlayerMessage {
    inputMethod: "None" | "SelectPlayer";
    message: string;
    icon: string;
}

// eventually just turn this into a class
export interface Player {
    contact: (message: PlayerMessage) => Promise<string | null>;
}

export interface Role {
    interaction: (event: Event, player: any, game: any) => Promise<void>;
}

// sample
class Mafioso implements Role {
    Mafioso() {}

    async interaction(event: Event, player: Player, game: any): Promise<void> {
        switch (event) {
            case "Nightfall":
                // this is essentially pseudocode at this point
                // game.allow_mafia_chat(player) // make this look all secret-y
                const target = await player.contact({
                    inputMethod: "SelectPlayer",
                    message:
                        "Who do you want to kill? Check with your fellow mafia first",
                    icon: "killstuff.jpeg",
                });
                game.addMafiaVote(target);
        }
    }
}

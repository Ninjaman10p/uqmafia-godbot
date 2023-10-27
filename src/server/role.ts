type Event = "Nightfall" | "Morning" | "Lynched";

export interface PlayerMessage {
    inputMethod: "None" | "SelectPlayer";
    theme?: "Murder";
    message: string;
    icon: string;
}

// eventually just turn this into a class
export interface Player {
    contact: (message: PlayerMessage) => Promise<string | null>;
    getMessages: () => PlayerMessage[];
    resolveMessage: (response: string | null, index: number) => void;

    // also store the role here
}

export interface Role {
    interaction: (event: Event, player: any, game: any) => Promise<void>;
    description: () => String;
    name: () => String;
}

// sample
export class Mafioso implements Role {
    Mafioso() {}

    async interaction(event: Event, player: Player, game: any): Promise<void> {
        switch (event) {
            case "Nightfall":
                // this is essentially pseudocode at this point
                // game.allow_mafia_chat(player) // make this look all secret-y
                const target = await player.contact({
                    inputMethod: "SelectPlayer",
                    theme: "Murder",
                    message:
                        "Who do you want to kill? Check with your fellow mafia first",
                    icon: "killstuff.jpeg",
                });
                game.addMafiaVote(target);
        }
    }

    description = () => "Kill people";
    name = () => "Mafioso";
}

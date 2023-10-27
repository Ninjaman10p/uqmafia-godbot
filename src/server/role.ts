type Event = "Nightfall" | "Morning" | "Lynched"

export interface Role {
    interaction: (event: Event, player: any, game: any) => void;
}

class Mafioso implements Role {
    Mafia() {

    }

    interaction(event: Event, player: any, game: any): void {

    }
}

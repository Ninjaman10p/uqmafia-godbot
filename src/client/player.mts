import { getAPI, JoinGameRequest } from "../shared/api.mjs";
import { GameCode } from "../server/game.mjs";

async function joinGame(_event: MouseEvent) {
    const name = (document.getElementById("name-input") as HTMLInputElement)
        .value;
    const gamecode = (
        document.getElementById("gamecode-input") as HTMLInputElement
    ).value as GameCode;
    // check that the gamecode is actually a gamecode
    if(name == "") {
        alert("Please fill in your name.");
        return;
    }
    if (!gamecode.match(/\d\d\d/)) {
        alert("Game code should be a 3 digit number");
        return;
    }
    const response = await getAPI("/api/joingame", {
        gameid: gamecode,
        name: name,
    });
    console.log(response);
}

document
    .getElementById("join-game-button")
    ?.addEventListener("click", joinGame);

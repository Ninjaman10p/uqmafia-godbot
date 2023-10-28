import { getAPI } from "../shared/api.mjs";

const newGame = async () => {
    const response = await getAPI("/api/newgame", {});
    document.cookie = `userid=${response.userid}`;
    document.querySelector("li:has(> #make-game-button)")?.remove();

    document.body.innerText = `Game code: ${response.gameid}`;
    console.log(response);
};

document.getElementById("make-game-button")?.addEventListener("click", newGame);

/**
 * @file Contains the main function that drives the program.
 * @author Marcus Bartlett
 */

import { Game } from "./game.mjs";

/** The pixel width of each tile. */
const TW = 16;

/** The pixel height of each tile. */
const TH = 16;

/** The path to the spritesheet/tilesheet. */
const IMAGE_SOURCE = "./img/sheet_16.png";

/** Drives the program by creating a Game object and starting it. */
function main() {
    // Load tileset.
    let img = new Image();
    img.src = IMAGE_SOURCE;
    img.addEventListener("load", () => {
        let arr = new Array();
        for (let i = 0; i * TH < img.naturalHeight; i++) {
            for (let j = 0; j * TW < img.naturalWidth; j++) {
                arr.push(createImageBitmap(img, j * TW, i * TH, TW, TH));
            }
        }
        Promise.all(arr).then((sprites) => {
            let game = new Game(sprites);
            game.start();
        }).catch((error) => {
            console.log(error);
        });
    });
}

main();
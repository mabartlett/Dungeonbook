/**
 * @file Contains the main function that drives the program and sets up the
 * webpage.
 * @author Marcus Bartlett
 */

import { Game, SCREEN_HEIGHT, SCREEN_WIDTH } from "./game.mjs";
import { test as testGame } from "./module-tests/testGame.mjs";

/** The pixel width of each tile. */
const TW = 16;

/** The pixel height of each tile. */
const TH = 16;

/** The path to the spritesheet/tilesheet. */
const IMAGE_SOURCE = "./img/sheet_16.png";

/** The CSS selector for the Canvas element onto which the game is drawn. */
const SCREEN_SELECTOR = "#ScreenCanvas";

/** Whether the application is in development and module tests should be run. */
const TESTING = true;

/** 
 * Drives the program by setting up the webpage then creating a Game object and 
 * starting it. 
 * */
function main() {
    // Set up screen canvas.
    const canvas = document.querySelector(SCREEN_SELECTOR) as HTMLCanvasElement;
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    canvas.style.height = `${SCREEN_HEIGHT}px`;
    canvas.style.width = `${SCREEN_WIDTH}px`;
    // Load sprite sheet.
    let img = new Image();
    img.src = IMAGE_SOURCE;
    img.addEventListener("load", () => {
        let arr = new Array<Promise<ImageBitmap>>();
        for (let i = 0; i * TH < img.naturalHeight; i++) {
            for (let j = 0; j * TW < img.naturalWidth; j++) {
                arr.push(createImageBitmap(img, j * TW, i * TH, TW, TH));
            }
        }
        Promise.all(arr).then(async (sprites) => {
            const ctx = canvas.getContext("2d");
            if (ctx instanceof CanvasRenderingContext2D) {
                let game = new Game(sprites, ctx);
                game.start();
            } else {
                throw new Error("Could not get canvas rendering context.");
            }
        }).catch((error) => {
            console.log(error);
        });
    });
    if (TESTING) {
        tests();
    }
}

/** Performs the tests that Playwright just can't do. */
function tests() {
    testGame();
}

main();
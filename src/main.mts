/**
 * @file Contains the main function that drives the program and sets up the
 * webpage.
 * @author Marcus Bartlett
 */

import { Game, SCREEN_HEIGHT, SCREEN_WIDTH } from "./game.mjs";
import { test as testGame } from "./module-tests/testGame.mjs";

/** The CSS selector for the Canvas element onto which the game is drawn. */
const SCREEN_SELECTOR = "#ScreenCanvas";

/** Whether the application is in development and module tests should be run. */
const TESTING = false;

/** 
 * Drives the program by setting up the webpage then creating a Game object and 
 * starting it. 
 * */
function main() {
    const canvas = document.querySelector(SCREEN_SELECTOR) as HTMLCanvasElement;
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    canvas.style.height = `${SCREEN_HEIGHT}px`;
    canvas.style.width = `${SCREEN_WIDTH}px`;
    startGame(canvas);
    window.addEventListener("resize", (theEvent: Event) => {
        const width = (theEvent.target as Window).innerWidth;
        const height = (theEvent.target as Window).innerHeight;
        resizeCanvas(canvas, width, height);
    });
    resizeCanvas(canvas, window.innerWidth, window.innerHeight);
    if (TESTING) {
        tests();
    }
}

/**
 * Constructs a new Game instance and calls its start method.
 * @param theCanvas - The web page's main canvas element onto which all screen 
 * graphics are drawn.
 */
async function startGame(theCanvas: HTMLCanvasElement) {
    const ctx = theCanvas.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D) {
        const game = new Game(ctx);
        await game.start();
    } else {
        console.error("Could not get canvas rendering context.");
        alert("Could not start game. Try refreshing.");
    }
}

/**
 * Resizes the main canvas's CSS dimensions.
 * @param theCanvas - The canvas to resize.
 * @param theWidth - The window's inner pixel width.
 * @param theHeight - The window's inner pixel height.
 */
function resizeCanvas(theCanvas: HTMLCanvasElement, theWidth: number, 
        theHeight: number) {
    let widerThanAspRat = theHeight / theWidth < SCREEN_HEIGHT / SCREEN_WIDTH;
    let ratio: number;
    if (widerThanAspRat) {
        ratio = theHeight / SCREEN_HEIGHT;
        theCanvas.style.width = `${theCanvas.width * ratio}px`;
        theCanvas.style.height = `${theHeight}px`;
    } else {
        ratio = theWidth / SCREEN_WIDTH;
        theCanvas.style.height = `${theCanvas.height * ratio}px`;
        theCanvas.style.width = `${theWidth}px`;
    }
}

/** Performs the tests that Playwright just can't do. */
function tests() {
    testGame();
}

main();
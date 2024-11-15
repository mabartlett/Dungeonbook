var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game, SCREEN_HEIGHT, SCREEN_WIDTH } from "./game.mjs";
import { test as testGame } from "./module-tests/testGame.mjs";
const SCREEN_SELECTOR = "#ScreenCanvas";
const TESTING = false;
function main() {
    const canvas = document.querySelector(SCREEN_SELECTOR);
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    canvas.style.height = `${SCREEN_HEIGHT}px`;
    canvas.style.width = `${SCREEN_WIDTH}px`;
    startGame(canvas);
    window.addEventListener("resize", (theEvent) => {
        const width = theEvent.target.innerWidth;
        const height = theEvent.target.innerHeight;
        resizeCanvas(canvas, width, height);
    });
    resizeCanvas(canvas, window.innerWidth, window.innerHeight);
    if (TESTING) {
        tests();
    }
}
function startGame(theCanvas) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = theCanvas.getContext("2d");
        if (ctx instanceof CanvasRenderingContext2D) {
            const game = new Game(ctx);
            yield game.start();
        }
        else {
            console.error("Could not get canvas rendering context.");
            alert("Could not start game. Try refreshing.");
        }
    });
}
function resizeCanvas(theCanvas, theWidth, theHeight) {
    let widerThanAspRat = theHeight / theWidth < SCREEN_HEIGHT / SCREEN_WIDTH;
    let ratio;
    if (widerThanAspRat) {
        ratio = theHeight / SCREEN_HEIGHT;
        theCanvas.style.width = `${theCanvas.width * ratio}px`;
        theCanvas.style.height = `${theHeight}px`;
    }
    else {
        ratio = theWidth / SCREEN_WIDTH;
        theCanvas.style.height = `${theCanvas.height * ratio}px`;
        theCanvas.style.width = `${theWidth}px`;
    }
}
function tests() {
    testGame();
}
main();

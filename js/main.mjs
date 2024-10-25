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
const TW = 16;
const TH = 16;
const IMAGE_SOURCE = "./img/sheet_16.png";
const SCREEN_SELECTOR = "#ScreenCanvas";
const TESTING = true;
function main() {
    const canvas = document.querySelector(SCREEN_SELECTOR);
    canvas.height = SCREEN_HEIGHT;
    canvas.width = SCREEN_WIDTH;
    canvas.style.height = `${SCREEN_HEIGHT}px`;
    canvas.style.width = `${SCREEN_WIDTH}px`;
    let img = new Image();
    img.src = IMAGE_SOURCE;
    img.addEventListener("load", () => {
        let arr = new Array();
        for (let i = 0; i * TH < img.naturalHeight; i++) {
            for (let j = 0; j * TW < img.naturalWidth; j++) {
                arr.push(createImageBitmap(img, j * TW, i * TH, TW, TH));
            }
        }
        Promise.all(arr).then((sprites) => __awaiter(this, void 0, void 0, function* () {
            const ctx = canvas.getContext("2d");
            if (ctx instanceof CanvasRenderingContext2D) {
                let game = new Game(sprites, ctx);
                game.start();
            }
            else {
                throw new Error("Could not get canvas rendering context.");
            }
        })).catch((error) => {
            console.log(error);
        });
    });
    if (TESTING) {
        tests();
    }
}
function tests() {
    testGame();
}
main();

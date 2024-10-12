import { Game, SCREEN_HEIGHT, SCREEN_WIDTH } from "./game.mjs";
const TW = 16;
const TH = 16;
const IMAGE_SOURCE = "./img/sheet_16.png";
const SCREEN_SELECTOR = "#ScreenCanvas";
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
        Promise.all(arr).then((sprites) => {
            const ctx = canvas.getContext("2d");
            if (ctx instanceof CanvasRenderingContext2D) {
                let game = new Game(sprites, ctx);
                game.start();
            }
            else {
                throw new Error("Could not get canvas rendering context.");
            }
        }).catch((error) => {
            console.log(error);
        });
    });
}
main();

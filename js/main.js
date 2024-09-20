"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_js_1 = require("./game.js");
const TW = 16;
const TH = 16;
const IMAGE_SOURCE = "./img/sheet_16.png";
function main() {
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
            let game = new game_js_1.Game(sprites);
            game.start();
        }).catch((error) => {
            console.log(error);
        });
    });
}
main();

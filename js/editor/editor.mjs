var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { App, TH, TW } from "./app.mjs";
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
        Promise.all(arr).then((theTileset) => __awaiter(this, void 0, void 0, function* () {
            let app = new App(theTileset);
            yield app.initializeTileTypes();
            app.start();
        })).catch((theError) => {
            console.log("Failed to load tiles.");
            console.log(theError);
        });
    });
}
main();

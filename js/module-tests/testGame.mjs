var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game } from "../game.mjs";
const IMAGE_SOURCE = "./img/title.png";
export function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const img = new Image();
        img.src = IMAGE_SOURCE;
        const ibm = yield new Promise((resolve, reject) => {
            img.addEventListener("load", (theEvent) => {
                if (theEvent.target instanceof Image) {
                    createImageBitmap(theEvent.target)
                        .then((theBitmap) => { resolve(theBitmap); })
                        .catch((theError) => { reject(theError); });
                }
                else {
                    reject(new Error("This literally cannot happen."));
                }
            });
        });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx === null) {
            throw new Error("Could not create CanvasRenderingContext2D.");
        }
        const mockGame = new Game([ibm], ctx);
        if ((yield mockGame.loadImageBitmap(IMAGE_SOURCE)) instanceof ImageBitmap) {
            console.log("loadImapgeBitmap produces ImageBitmap.");
        }
        else {
            console.error("loadImageBitmap does not produce ImageBitmap.");
        }
        const ibm2 = yield mockGame.loadImageBitmap("FAKEPATH.png")
            .catch((theError) => {
            console.log(`Caught ${theError}`);
        });
    });
}

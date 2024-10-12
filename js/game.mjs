var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const SCREEN_HEIGHT = 288;
export const SCREEN_WIDTH = 512;
export class Game {
    constructor(theSprites, theCtx) {
        this._sprites = theSprites;
        this._ctx = theCtx;
    }
    start() {
    }
    loadImageBitmap(thePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const img = new Image();
            img.src = thePath;
            const prom = new Promise((resolveFunc, rejectFunc) => {
                img.addEventListener("load", () => {
                    createImageBitmap(img)
                        .then((theImgBit) => { resolveFunc(theImgBit); })
                        .catch((theError) => { rejectFunc(theError); });
                });
                img.addEventListener("error", () => {
                    rejectFunc(new Error("Could not load image!"));
                });
            });
            return prom;
        });
    }
    draw() {
    }
}

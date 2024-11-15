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
const BORDER_PATH = "./img/border.png";
const TITLE_PATH = "./img/title.png";
const SHEET_PATH = "./img/sheet_16.png";
const TW = 16;
const TH = 16;
const PT_PANEL_MAIN = { x: 240, y: 16 };
export class Game {
    constructor(theCtx) {
        this._ctx = theCtx;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._ctx.imageSmoothingEnabled = false;
            const images = [
                this.loadImageBitmap(BORDER_PATH),
                this.loadImageBitmap(TITLE_PATH),
                this.loadImageBitmapSheet(SHEET_PATH, TW, TH),
            ];
            Promise.all(images).then((theValues) => {
                this._img_border = theValues[0];
                this._img_title = theValues[1];
                this._sprites = theValues[2];
                this.draw();
            });
        });
    }
    loadImageBitmap(thePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const img = new Image();
            img.src = thePath;
            return new Promise((resolve, reject) => {
                img.addEventListener("load", () => {
                    createImageBitmap(img)
                        .then((theIB) => { resolve(theIB); })
                        .catch((theError) => { reject(theError); });
                });
                img.addEventListener("error", () => {
                    reject(new Error(`Could not load image from ${thePath}.`));
                });
            });
        });
    }
    loadImageBitmapSheet(thePath, theWidth, theHeight) {
        return __awaiter(this, void 0, void 0, function* () {
            const img = new Image();
            img.src = thePath;
            return new Promise((resolve, reject) => {
                img.addEventListener("load", () => {
                    const arr = new Array();
                    for (let i = 0; i * theHeight < img.naturalHeight; i++) {
                        for (let j = 0; j * theWidth < img.naturalWidth; j++) {
                            arr.push(createImageBitmap(img, j * theWidth, i * theHeight, theWidth, theHeight));
                        }
                    }
                    Promise.all(arr)
                        .then((theSprites) => {
                        resolve(theSprites);
                    }).catch((theError) => {
                        reject(theError);
                    });
                });
            });
        });
    }
    draw() {
        this._ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.fillStyle = "#000000";
        this._ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.drawImage(this._img_border, 0, 0);
        this._ctx.drawImage(this._img_title, PT_PANEL_MAIN.x, PT_PANEL_MAIN.y);
    }
}

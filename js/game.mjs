var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TextBox, CW, CH } from "./textbox.mjs";
import { Observer } from "./observer.mjs";
export const SCREEN_HEIGHT = 288;
export const SCREEN_WIDTH = 512;
export var SIGNALS;
(function (SIGNALS) {
    SIGNALS[SIGNALS["GAME_START"] = 0] = "GAME_START";
})(SIGNALS || (SIGNALS = {}));
const BORDER_PATH = "./img/border.png";
const TITLE_PATH = "./img/title.png";
const SHEET_PATH = "./img/sheet_16.png";
const FONT_PATH = "./img/font_6x8.png";
const TW = 16;
const TH = 16;
const SIDE_PANEL_WIDTH = 208;
const PT_PANEL_MAIN = { x: 240, y: 16 };
const BUTTONS_NUM = 6;
const PT_PANEL_BTNS = { x: 16, y: 160 };
const BTNS_MARGIN_RIGHT = -1;
const BTNS_MARGIN_TOP = 0;
const BTNS_WIDTH = 70;
const BTNS_HEIGHT = 24;
const TEXTBOX_INFO = {
    point: { x: 18, y: 228 },
    width: 204,
    height: 40
};
const TITLE_SCREEN_INFO_TEXT = "Press one of the context-sensitive keys to start.";
export class Game extends Observer {
    constructor(theCtx) {
        super();
        this._ctx = theCtx;
    }
    receiveSignal(theSender, theSignal) {
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._ctx.imageSmoothingEnabled = false;
            const images = [
                this.loadImageBitmap(BORDER_PATH),
                this.loadImageBitmap(TITLE_PATH),
                this.loadImageBitmapSheet(SHEET_PATH, TW, TH),
                this.loadImageBitmapSheet(FONT_PATH, CW, CH),
            ];
            Promise.all(images).then((theValues) => {
                this._img_border = theValues[0];
                this._img_title = theValues[1];
                this._sprites = theValues[2];
                this._info_textBox = new TextBox(TEXTBOX_INFO, theValues[3]);
                this.draw();
                this.emitSignal(SIGNALS.GAME_START);
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
        this.draw_background();
        this.draw_title_screen();
    }
    draw_background() {
        this._ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.fillStyle = "#000000";
        this._ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.drawImage(this._img_border, 0, 0);
        this._ctx.strokeStyle = "#ffffff";
        let rows = 1;
        let cols = BUTTONS_NUM;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((BTNS_WIDTH + BTNS_MARGIN_RIGHT) * (j + 1) > SIDE_PANEL_WIDTH) {
                    cols = j;
                    if (cols * (rows + 1) <= BUTTONS_NUM) {
                        rows++;
                    }
                }
                else {
                    let X_COMP = (BTNS_WIDTH + BTNS_MARGIN_RIGHT) * j;
                    let Y_COMP = (BTNS_HEIGHT + BTNS_MARGIN_TOP) * i;
                    this._ctx.strokeRect(PT_PANEL_BTNS.x + 0.5 + X_COMP, PT_PANEL_BTNS.y + 0.5 + Y_COMP, BTNS_WIDTH - 1, BTNS_HEIGHT - 1);
                }
            }
            cols = BUTTONS_NUM;
        }
    }
    draw_title_screen() {
        this._ctx.drawImage(this._img_title, PT_PANEL_MAIN.x, PT_PANEL_MAIN.y);
        this._info_textBox.write(TITLE_SCREEN_INFO_TEXT);
        this._ctx.drawImage(this._info_textBox.canvas, TEXTBOX_INFO.point.x, TEXTBOX_INFO.point.y);
    }
}

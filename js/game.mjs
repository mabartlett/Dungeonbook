var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { InputHandler } from "./inputhandler.mjs";
import { Observer } from "./observer.mjs";
import { TextBox, CW, CH } from "./textbox.mjs";
import { TileMap } from "./editor/tilemap.mjs";
export const SCREEN_HEIGHT = 288;
export const SCREEN_WIDTH = 512;
export var SIGNALS;
(function (SIGNALS) {
    SIGNALS[SIGNALS["GAME_START"] = 0] = "GAME_START";
    SIGNALS[SIGNALS["NEW_GAME"] = 1] = "NEW_GAME";
})(SIGNALS || (SIGNALS = {}));
export var STATES;
(function (STATES) {
    STATES[STATES["MAIN_MENU"] = 0] = "MAIN_MENU";
})(STATES || (STATES = {}));
const BORDER_PATH = "./img/border.png";
const TITLE_PATH = "./img/title.png";
const SHEET_PATH = "./img/sheet_16.png";
const FONT_PATH = "./img/font_6x8.png";
const DUNGEON_DIR = "./dungeons/";
const PLAYGROUND_NAME = "playground.json";
const TW = 16;
const TH = 16;
const MAIN_PANEL_WIDTH = 256;
const MAIN_PANEL_HEIGHT = 256;
const SIDE_PANEL_WIDTH = 208;
const PT_PANEL_MAIN = { x: 240, y: 16 };
const BUTTONS_NUM = 6;
const PT_PANEL_BTNS = { x: 16, y: 160 };
const BTNS_MARGIN_RIGHT = -1;
const BTNS_MARGIN_TOP = 0;
const BTNS_WIDTH = 70;
const BTNS_HEIGHT = 24;
const BTNS_PADDING_LEFT = 2;
const BTNS_PADDING_TOP = 4;
const TEXTBOX_INFO = {
    point: { x: 18, y: 228 },
    width: 204,
    height: 40
};
const TITLE_SCREEN_INFO_TEXT = "Press one of the context-sensitive keys to " +
    "start. (On a standard QWERTY keyboard, the keys Q, W, E, A, S, and D.)";
const INPUT = InputHandler.getInstance();
export class Game extends Observer {
    constructor(theCtx) {
        super();
        this._ctx = theCtx;
        this._butt_boxes = new Array();
        this._state = 0;
        this._world = new TileMap();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            INPUT.addListeners();
            this.subscribe(INPUT);
            INPUT.subscribe(this);
            this._ctx.imageSmoothingEnabled = false;
            const images = [
                this.loadImageBitmap(BORDER_PATH),
                this.loadImageBitmap(TITLE_PATH),
                this.loadImageBitmapSheet(SHEET_PATH, TW, TH),
                this.loadImageBitmapSheet(FONT_PATH, CW, CH),
                this.loadImageBitmapSheet(SHEET_PATH, TW, TH),
            ];
            Promise.all(images).then((theValues) => {
                this._img_border = theValues[0];
                this._img_title = theValues[1];
                this._sprites = theValues[2];
                this._main_font = theValues[3];
                this._info_textBox = new TextBox(TEXTBOX_INFO, this._main_font, this._ctx);
                this._sprites = theValues[4];
                this.draw();
                this.emitSignal(SIGNALS.GAME_START);
                this._state = STATES.MAIN_MENU;
                this.draw_buttons();
            });
        });
    }
    receiveSignal(theSender, theSignal) {
        if (INPUT.signal_is_keydown(theSignal)) {
            if (this._state === STATES.MAIN_MENU) {
                if (theSignal === "KeyQ") {
                    this.new_game();
                }
            }
        }
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
    loadDungeon(theName) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = DUNGEON_DIR + theName;
            const response = yield fetch(path);
            if (!response.ok) {
                throw new Error(`Could not load ${path}: status ${response.status}.`);
            }
            const json = yield response.json();
            return new TileMap(json);
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
    }
    draw_title_screen() {
        this._ctx.drawImage(this._img_title, PT_PANEL_MAIN.x, PT_PANEL_MAIN.y);
        this._info_textBox.write(TITLE_SCREEN_INFO_TEXT);
    }
    draw_buttons() {
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
                    let x_comp = (BTNS_WIDTH + BTNS_MARGIN_RIGHT) * j;
                    let y_comp = (BTNS_HEIGHT + BTNS_MARGIN_TOP) * i;
                    this._ctx.clearRect(PT_PANEL_BTNS.x + x_comp, PT_PANEL_BTNS.y + y_comp, BTNS_WIDTH, BTNS_HEIGHT);
                    let idx = (i * cols) + j;
                    if (this._butt_boxes.length < BUTTONS_NUM) {
                        let params = {
                            point: {
                                x: PT_PANEL_BTNS.x + BTNS_PADDING_LEFT + x_comp,
                                y: PT_PANEL_BTNS.y + BTNS_PADDING_TOP + y_comp
                            },
                            width: BTNS_WIDTH - 2,
                            height: BTNS_HEIGHT - 2
                        };
                        let tb = new TextBox(params, this._main_font, this._ctx);
                        tb.write(INPUT.contexts[idx]);
                        this._butt_boxes.push(tb);
                    }
                    else {
                        this._butt_boxes[i].write(INPUT.contexts[idx]);
                    }
                    this._ctx.strokeRect(PT_PANEL_BTNS.x + 0.5 + x_comp, PT_PANEL_BTNS.y + 0.5 + y_comp, BTNS_WIDTH - 1, BTNS_HEIGHT - 1);
                }
            }
        }
    }
    draw_world() {
        this._ctx.clearRect(PT_PANEL_MAIN.x, PT_PANEL_MAIN.y, MAIN_PANEL_WIDTH, MAIN_PANEL_HEIGHT);
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let terr = this._world.terrain[0][i][j];
                let thing = this._world.things[0][i][j];
                if (terr !== null) {
                    this._ctx.drawImage(this._sprites[terr], (j * TW) + 240, (i * TH) + 16);
                }
                if (thing !== null) {
                    this._ctx.drawImage(this._sprites[thing], (j * TW) + 240, (i * TH) + 16);
                }
            }
        }
    }
    new_game() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emitSignal(SIGNALS.NEW_GAME);
            this.draw_buttons();
            this._world = yield this.loadDungeon(PLAYGROUND_NAME);
            this.draw_world();
        });
    }
}

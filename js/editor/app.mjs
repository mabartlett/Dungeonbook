var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TERRAIN_TYPE, TileMap } from "./tilemap.mjs";
export const TW = 16;
export const TH = 16;
const SCALING = 2;
const GRID_COLOR = "#e0e0e0";
const FLAG_COLOR = "#0000ff";
const DEFAULT_WIDTH = 16;
const DEFAULT_HEIGHT = 16;
const DEFAULT_DEPTH = 1;
const SIDEBAR_SELECTOR = "#Sidebar";
const RADIO_NAME = "tiles";
const TILE_LABEL_CLASS = "tile-label";
const CANVAS_SELECTOR = "#MainCanvas";
const DRAW_CLICK = 1;
const OUTPUT_SELECTOR = "#Output";
const WIDTH_SELECTOR = "#WidthInput";
const HEIGHT_SELECTOR = "#HeightInput";
const TOT_DEPTH_SELECTOR = "#TotDepthInput";
const CURR_DEPTH_SELECTOR = "#CurrDepthInput";
const DIM_SELECTOR = "#DimensionInputs";
const MENU_SELECTOR = "#MenuBar";
const FILENAME_SELECTOR = "#FileName";
const LOAD_SELECTOR = "#LoadInput";
const SAVE_AS_SELECTOR = "#SaveAsInput";
const ID_JSON_PATH = "./../../id.json";
const START_CHAR = "⚑";
export class App {
    constructor(theTileset) {
        if (theTileset.length == 0) {
            throw new Error("App constructor passed empty tileset array.");
        }
        else {
            this._tileset = theTileset;
            this._selected = 0;
            this._tileMap = new TileMap(DEFAULT_WIDTH, DEFAULT_HEIGHT);
            this._currDepth = 0;
            fetch(ID_JSON_PATH)
                .then((theResponse) => __awaiter(this, void 0, void 0, function* () {
                return yield theResponse.json();
            }))
                .then((theData) => {
                if (theData === undefined) {
                    throw new Error("App could not load id.json correctly");
                }
                else {
                    this._tileTypes = new Array(theTileset.length);
                    for (let key in theData) {
                        if (theData[key] < theTileset.length) {
                            this._tileTypes[theData[key]] = key;
                        }
                        else {
                            console.warn("Tile ID given to a tile with a " +
                                "number greater than possible.");
                        }
                    }
                    for (let i = 1; i < this._tileTypes.length; i++) {
                        if (this._tileTypes[i] === undefined) {
                            this._tileTypes[i] = this._tileTypes[i - 1];
                        }
                    }
                    if (this._tileTypes.indexOf(TERRAIN_TYPE) < 0) {
                        console.warn("Custom tileset is missing '" +
                            TERRAIN_TYPE + "' type:");
                        console.log(this._tileTypes);
                    }
                }
            })
                .catch((theError) => {
                console.error(theError);
            });
        }
    }
    start() {
        let html = document.querySelector("html");
        html.style.fontSize = `${TH * SCALING}px`;
        this.createTileCanvases();
        this.setCanvasDimensions(DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_DEPTH);
        let output = document.querySelector(OUTPUT_SELECTOR);
        output.value = this._tileMap.toString();
        let canvas = document.querySelector(CANVAS_SELECTOR);
        let width = document.querySelector(WIDTH_SELECTOR);
        let height = document.querySelector(HEIGHT_SELECTOR);
        let tDepth = document.querySelector(TOT_DEPTH_SELECTOR);
        let cDepth = document.querySelector(CURR_DEPTH_SELECTOR);
        canvas.addEventListener("mousemove", (theEvent) => {
            this.mouseHandler(theEvent);
        });
        canvas.addEventListener("mousedown", (theEvent) => {
            this.mouseHandler(theEvent);
        });
        width.value = String(DEFAULT_WIDTH);
        width.addEventListener("input", (theEvent) => {
            this.dimensionHandler(theEvent);
        });
        height.value = String(DEFAULT_HEIGHT);
        height.addEventListener("input", (theEvent) => {
            this.dimensionHandler(theEvent);
        });
        tDepth.value = String(DEFAULT_DEPTH);
        tDepth.addEventListener("input", (theEvent) => {
            this.dimensionHandler(theEvent);
        });
        cDepth.value = String(DEFAULT_DEPTH);
        cDepth.max = String(DEFAULT_DEPTH);
        cDepth.addEventListener("input", (theEvent) => {
            this.depthHandler(theEvent);
        });
        this.setSidebarHeight();
        this.draw();
    }
    createTileCanvases() {
        for (let i = 0; i < this._tileset.length; i++) {
            let label = document.createElement("label");
            label.setAttribute("class", TILE_LABEL_CLASS);
            let radButt = document.createElement("input");
            radButt.setAttribute("type", "radio");
            radButt.setAttribute("value", `${i}`);
            radButt.setAttribute("name", RADIO_NAME);
            if (i === 0) {
                radButt.setAttribute("checked", "checked");
            }
            radButt.addEventListener("input", (theEvent) => {
                this.radioHandler(theEvent);
            });
            label.append(radButt);
            let canvas = document.createElement("canvas");
            canvas.className = "tile";
            canvas.height = TH * SCALING;
            canvas.width = TW * SCALING;
            label.append(canvas);
            let sidebar = document.querySelector(SIDEBAR_SELECTOR);
            sidebar.append(label);
            let ctx = canvas.getContext("2d");
            if (ctx === null) {
                console.log(`Failed to draw tile ${this._tileset[i]}.`);
            }
            else {
                ctx.imageSmoothingEnabled = false;
                ctx.scale(SCALING, SCALING);
                ctx.drawImage(this._tileset[i], 0, 0);
            }
        }
    }
    radioHandler(theEvent) {
        if (theEvent.target !== null && theEvent.target instanceof HTMLInputElement) {
            this._selected = Number(theEvent.target.value);
        }
    }
    setCanvasDimensions(theWidth, theHeight, theDepth) {
        let canvas = document.querySelector(CANVAS_SELECTOR);
        this._tileMap.resize(theWidth, theHeight, theDepth);
        canvas.width = TW * theWidth * SCALING;
        canvas.style.width = String(TW * theWidth * SCALING);
        canvas.height = TH * theHeight * SCALING;
        canvas.style.height = String(TH * theHeight * SCALING);
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.warn("Failed to set canvas dimensions.");
        }
        else {
            ctx.scale(SCALING, SCALING);
            ctx.imageSmoothingEnabled = false;
        }
    }
    mouseHandler(theEvent) {
        if (theEvent.buttons === DRAW_CLICK && this._tileTypes !== undefined) {
            let x = Math.min(Math.floor(theEvent.offsetX / (TW * SCALING)), this._tileMap.terrain[0][0].length - 1);
            let y = Math.min(Math.floor(theEvent.offsetY / (TH * SCALING)), this._tileMap.terrain[0].length - 1);
            let t = this._tileTypes[this._selected];
            if (theEvent.shiftKey) {
                this._tileMap.assignValue(null, x, y, this._currDepth, t);
            }
            else if (theEvent.ctrlKey && this._currDepth === 0) {
                this._tileMap.assignStart(x, y);
            }
            else if (!theEvent.ctrlKey) {
                this._tileMap.assignValue(this._selected, x, y, this._currDepth, t);
            }
            this.draw();
            let output = document.querySelector(OUTPUT_SELECTOR);
            output.value = this._tileMap.toString();
        }
    }
    dimensionHandler(theEvent) {
        let widthEl = document.querySelector(WIDTH_SELECTOR);
        let heightEl = document.querySelector(HEIGHT_SELECTOR);
        let depthEl = document.querySelector(TOT_DEPTH_SELECTOR);
        let cdepthEl = document.querySelector(CURR_DEPTH_SELECTOR);
        let width = Number.parseInt(widthEl.value);
        let height = Number.parseInt(heightEl.value);
        let depth = Number.parseInt(depthEl.value);
        if (!Number.isNaN(width) && !Number.isNaN(height) && !Number.isNaN(depth) &&
            width >= parseInt(widthEl.min) && height >= parseInt(heightEl.min) &&
            depth >= parseInt(depthEl.min)) {
            if (this._currDepth >= depth) {
                this._currDepth = depth - 1;
                cdepthEl.value = String(depth);
            }
            cdepthEl.max = String(depth);
            this._tileMap.resize(width, height, depth);
            this.setCanvasDimensions(width, height, depth);
            this.draw();
            let output = document.querySelector(OUTPUT_SELECTOR);
            output.value = this._tileMap.toString();
        }
    }
    depthHandler(theEvent) {
        let inputEl = document.querySelector(CURR_DEPTH_SELECTOR);
        let depth = Number.parseInt(inputEl.value);
        if (!Number.isNaN(depth) && depth <= this._tileMap.terrain.length) {
            this._currDepth = depth - 1;
            this.draw();
        }
    }
    draw() {
        let canvas = document.querySelector(CANVAS_SELECTOR);
        let ctx = canvas.getContext("2d");
        let w = this._tileMap.terrain[0][0].length * TW;
        let h = this._tileMap.terrain[0].length * TH;
        if (ctx === null) {
            console.warn("Drawing on main canvas failed.");
        }
        else {
            ctx.clearRect(0, 0, w, h);
            this.drawGrid();
            for (let i = 0; i < this._tileMap.terrain[this._currDepth].length; i++) {
                for (let j = 0; j < this._tileMap.terrain[this._currDepth][i].length; j++) {
                    let n = this._tileMap.terrain[this._currDepth][i][j];
                    if (typeof n === "number") {
                        let img = this._tileset[n];
                        ctx.drawImage(img, j * TW, i * TH);
                    }
                    n = this._tileMap.things[this._currDepth][i][j];
                    if (typeof n === "number") {
                        let img = this._tileset[n];
                        ctx.drawImage(img, j * TW, i * TH);
                    }
                }
            }
            if (this._currDepth === 0) {
                ctx.font = `${TH}px sans-serif`;
                ctx.textBaseline = "top";
                ctx.fillStyle = FLAG_COLOR;
                ctx.strokeStyle = GRID_COLOR;
                ctx.fillText(START_CHAR, this._tileMap.startX * TW, this._tileMap.startY * TH);
                ctx.strokeText(START_CHAR, this._tileMap.startX * TW, this._tileMap.startY * TH);
            }
        }
    }
    drawGrid() {
        let canvas = document.querySelector(CANVAS_SELECTOR);
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.warn("Drawing grid onto main canvas failed.");
        }
        else {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            for (let i = 0; i < this._tileMap.terrain[0][0].length; i++) {
                ctx.moveTo((i * TW) - 0.5, 0);
                ctx.lineTo((i * TW) - 0.5, this._tileMap.terrain[0].length * TH);
            }
            for (let i = 0; i < this._tileMap.terrain[0].length; i++) {
                ctx.moveTo(0, (i * TH) - 0.5);
                ctx.lineTo(this._tileMap.terrain[0][0].length * TW, (i * TH) - 0.5);
            }
            ctx.stroke();
        }
    }
    setSidebarHeight() {
        let row1 = document.querySelector(MENU_SELECTOR);
        let row2 = document.querySelector(DIM_SELECTOR);
        let row3 = document.querySelector(OUTPUT_SELECTOR);
        let h = row1.offsetHeight + row2.offsetHeight + row3.offsetHeight;
        let sidebar = document.querySelector(SIDEBAR_SELECTOR);
        sidebar.style.height = `calc(100vh - ${h}px)`;
    }
    writeFileName() {
    }
}

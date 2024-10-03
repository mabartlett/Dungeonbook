var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, TERRAIN_TYPE, TileMap } from "./tilemap.mjs";
export const TW = 16;
export const TH = 16;
const SCALING = 2;
const GRID_COLOR = "#e0e0e0";
const FLAG_COLOR = "#0000ff";
const SIDEBAR_SELECTOR = "#Sidebar";
const RADIO_NAME = "tiles";
const TILE_LABEL_CLASS = "tile-label";
const CANVAS_SELECTOR = "#MainCanvas";
const DRAW_CLICK = 1;
const WIDTH_SELECTOR = "#WidthInput";
const HEIGHT_SELECTOR = "#HeightInput";
const TOT_DEPTH_SELECTOR = "#TotDepthInput";
const CURR_DEPTH_SELECTOR = "#CurrDepthInput";
const DIM_SELECTOR = "#DimensionInputs";
const MENU_SELECTOR = "#MenuBar";
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
            this._tileMap = new TileMap();
            this._currDepth = 0;
            this._tileTypes = new Array(this._tileset.length);
        }
    }
    initializeTileTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(ID_JSON_PATH)
                .then((theResponse) => __awaiter(this, void 0, void 0, function* () {
                return yield theResponse.json();
            }))
                .then((theData) => {
                if (theData === undefined) {
                    throw new Error("App could not load id.json correctly");
                }
                else {
                    for (let key in theData) {
                        if (theData[key] < this._tileset.length) {
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
        });
    }
    start() {
        let html = document.querySelector("html");
        html.style.fontSize = `${TH * SCALING}px`;
        this.createTileCanvases();
        this.setCanvasDimensions(DEFAULT_WIDTH, DEFAULT_HEIGHT, 1);
        let canvas = document.querySelector(CANVAS_SELECTOR);
        canvas.addEventListener("mousemove", (theEvent) => {
            this.mouseHandler(theEvent);
        });
        canvas.addEventListener("mousedown", (theEvent) => {
            this.mouseHandler(theEvent);
        });
        let width = document.querySelector(WIDTH_SELECTOR);
        width.value = String(DEFAULT_WIDTH);
        width.addEventListener("input", (theEvent) => {
            this.dimensionHandler(theEvent);
        });
        let height = document.querySelector(HEIGHT_SELECTOR);
        height.value = String(DEFAULT_HEIGHT);
        height.addEventListener("input", (theEvent) => {
            this.dimensionHandler(theEvent);
        });
        let tDepth = document.querySelector(TOT_DEPTH_SELECTOR);
        tDepth.value = String(1);
        tDepth.addEventListener("input", (theEvent) => {
            this.dimensionHandler(theEvent);
        });
        let cDepth = document.querySelector(CURR_DEPTH_SELECTOR);
        cDepth.value = String(1);
        cDepth.max = String(1);
        cDepth.addEventListener("input", (theEvent) => {
            this.depthHandler(theEvent);
        });
        let saveAs = document.querySelector(SAVE_AS_SELECTOR);
        saveAs.addEventListener("click", (theEvent) => {
            this.saveAsHandler(theEvent);
        });
        let load = document.querySelector(LOAD_SELECTOR);
        load.addEventListener("input", (theEvent) => {
            this.loadHandler(theEvent);
        });
        this.setSidebarHeight();
        this.draw();
    }
    createTileCanvases() {
        let flag = true;
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
            if (flag && this._tileTypes[i] !== TERRAIN_TYPE) {
                flag = false;
                let heading = document.createElement("h1");
                heading.setAttribute("class", "sidebar-heading");
                heading.textContent = "Things";
                sidebar.append(heading);
            }
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
        }
    }
    saveAsHandler(theEvent) {
        if (theEvent.target instanceof HTMLAnchorElement) {
            let blob = new Blob([this._tileMap.toString()], { type: "text/json" });
            let url = URL.createObjectURL(blob);
            theEvent.target.href = url;
        }
    }
    loadHandler(theEvent) {
        if (theEvent.target instanceof HTMLInputElement &&
            theEvent.target.files !== null) {
            let file = theEvent.target.files[0];
            file.text()
                .then((theText) => {
                let ob = JSON.parse(theText);
                let tm = new TileMap(ob);
                this._tileMap = tm;
                this._currDepth = 0;
                let d = tm.terrain.length;
                document.querySelector(CURR_DEPTH_SELECTOR)
                    .value = String(d - 1);
                document.querySelector(CURR_DEPTH_SELECTOR)
                    .max = String(d - 1);
                document.querySelector(TOT_DEPTH_SELECTOR)
                    .value = String(d);
                let h = tm.terrain[0].length;
                document.querySelector(HEIGHT_SELECTOR)
                    .value = String(h);
                let w = tm.terrain[0][0].length;
                document.querySelector(WIDTH_SELECTOR)
                    .value = String(w);
                this.setCanvasDimensions(w, h, d);
                this.draw();
            })
                .catch((theError) => {
                console.error(theError);
                alert("An error occurred when reading the file.");
            });
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
        let h = row1.offsetHeight + row2.offsetHeight;
        let sidebar = document.querySelector(SIDEBAR_SELECTOR);
        sidebar.style.height = `calc(100vh - ${h}px)`;
    }
}

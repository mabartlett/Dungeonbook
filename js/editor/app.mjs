/**
 * @file Contains the App class for the level editor.
 * @author Marcus Bartlett
 */
import TileMap from "./tilemap.mjs";
/** The pixel width of each tile. */
export const TW = 16;
/** The pixel height of each tile. */
export const TH = 16;
/** The degree of scaling when scaling is enabled. */
const SCALING = 2;
/** The color of the grid lines. */
const GRID_COLOR = "#e0e0e0";
/** The default width (in tiles) of the main canvas. */
const DEFAULT_WIDTH = 16;
/** The default height (in tiles) of the main canvas. */
const DEFAULT_HEIGHT = 16;
/** The CSS selector for the app's sidebar. */
const SIDEBAR_SELECTOR = "#Sidebar";
/** The name of the radio button group in the sidebar. */
const RADIO_NAME = "tiles";
/** The CSS class for the labels for the tile canvas elements in the sidebar. */
const TILE_LABEL_CLASS = "tile-label";
/** The CSS selector for the main canvas. */
const CANVAS_SELECTOR = "#MainCanvas";
/** The number code corresponding to the mouse button for drawing. */
const DRAW_CLICK = 1;
/** The CSS selector for the output box. */
const OUTPUT_SELECTOR = "#Output";
/** The CSS selector for the width input field. */
const WIDTH_SELECTOR = "#WidthInput";
/** The CSS selector for the height input field. */
const HEIGHT_SELECTOR = "#HeightInput";
/** The "model" portion of the program with some domain violations tossed in. */
export class App {
    /**
     * Constructs an App object.
     * @param {Array<ImageBitmap>} theTileset - An array representing all tiles.
     */
    constructor(theTileset) {
        if (theTileset.length == 0) {
            throw new Error("App constructor passed empty tileset array.");
        }
        else {
            this._tileset = theTileset;
            this._selected = 0;
            this._tile_map = new TileMap(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        }
    }
    /**
     * Starts the app by initializing the view and adding event handlers.
     */
    start() {
        let html = document.querySelector("html");
        html.style.fontSize = `${TH * SCALING}px`;
        this.createTileCanvases();
        this.setCanvasDimensions(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        let output = document.querySelector(OUTPUT_SELECTOR);
        output.value = this._tile_map.toString();
        let canvas = document.querySelector(CANVAS_SELECTOR);
        let width = document.querySelector(WIDTH_SELECTOR);
        let height = document.querySelector(HEIGHT_SELECTOR);
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
        this.drawGrid();
    }
    /**
     * Creates the tile canvas checkbox group in the sidebar and adds
     * appropriate event handlers.
     */
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
    /**
     * Handles the clicks on the tiles in the sidebar.
     * @param {Event} theEvent - The event that triggered the calling of this
     * function.
     */
    radioHandler(theEvent) {
        if (theEvent.target !== null && theEvent.target instanceof HTMLInputElement) {
            this._selected = Number(theEvent.target.value);
        }
    }
    /**
     * Sets up the main canvas dimensions.
     * @param {number} theWidth - The width of the canvas (in tiles).
     * @param {number} theHeight - The height of the canvas (in tiles).
     */
    setCanvasDimensions(theWidth, theHeight) {
        let canvas = document.querySelector(CANVAS_SELECTOR);
        this._tile_map.resize(theWidth, theHeight);
        canvas.width = TW * theWidth * SCALING;
        canvas.style.width = String(TW * theWidth * SCALING);
        canvas.height = TH * theHeight * SCALING;
        canvas.style.height = String(TH * theHeight * SCALING);
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.log("Failed to set canvas dimensions.");
        }
        else {
            ctx.scale(SCALING, SCALING);
            ctx.imageSmoothingEnabled = false;
        }
    }
    /**
     * Handles mouse clicks, movements, etc. across the main canvas.
     * @param {MouseEvent} theEvent - The event that triggered the function call.
     */
    mouseHandler(theEvent) {
        let x = Math.floor(theEvent.offsetX / (TW * SCALING));
        let y = Math.floor(theEvent.offsetY / (TH * SCALING));
        if (theEvent.buttons === DRAW_CLICK) {
            if (theEvent.shiftKey) {
                this._tile_map.assignValue(null, x, y);
            }
            else {
                this._tile_map.assignValue(this._selected, x, y);
            }
            this.draw();
            let output = document.querySelector(OUTPUT_SELECTOR);
            output.value = this._tile_map.toString();
        }
    }
    /**
     * Handles input on the dimension fields.
     * @param {InputEvent} theEvent - The event that triggered the function call.
     */
    dimensionHandler(theEvent) {
        let widthEl = document.querySelector(WIDTH_SELECTOR);
        let heightEl = document.querySelector(HEIGHT_SELECTOR);
        let width = Number.parseInt(widthEl.value);
        let height = Number.parseInt(heightEl.value);
        if (!Number.isNaN(width) && !Number.isNaN(height)) {
            this._tile_map.resize(width, height);
            this.setCanvasDimensions(width, height);
            this.draw();
            let output = document.querySelector(OUTPUT_SELECTOR);
            output.value = this._tile_map.toString();
        }
    }
    /**
     * Draws the tilemap onto the canvas.
     */
    draw() {
        let canvas = document.querySelector(CANVAS_SELECTOR);
        let ctx = canvas.getContext("2d");
        let w = this._tile_map.tiles[0].length * TW;
        let h = this._tile_map.tiles.length * TH;
        if (ctx === null) {
            console.log("Drawing on main canvas failed.");
        }
        else {
            ctx.clearRect(0, 0, w, h);
            this.drawGrid();
            for (let i = 0; i < this._tile_map.tiles.length; i++) {
                for (let j = 0; j < this._tile_map.tiles[i].length; j++) {
                    let n = this._tile_map.tiles[i][j];
                    if (typeof n === "number") {
                        let img = this._tileset[n];
                        ctx.drawImage(img, j * TW, i * TH);
                    }
                }
            }
        }
    }
    /** Draws a grid beneath the tiles. */
    drawGrid() {
        let canvas = document.querySelector(CANVAS_SELECTOR);
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.log("Drawing grid onto main canvas failed.");
        }
        else {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            for (let i = 0; i < this._tile_map.tiles[0].length; i++) {
                ctx.moveTo((i * TW) - 0.5, 0);
                ctx.lineTo((i * TW) - 0.5, this._tile_map.tiles.length * TH);
            }
            for (let i = 0; i < this._tile_map.tiles.length; i++) {
                ctx.moveTo(0, (i * TH) - 0.5);
                ctx.lineTo(this._tile_map.tiles[0].length * TW, (i * TH) - 0.5);
            }
            ctx.stroke();
        }
    }
}

/**
 * @file Contains the App class for the level editor.
 * @author Marcus Bartlett
 */

import { TERRAIN_TYPE, TileMap } from "./tilemap.mjs";

/** The pixel width of each tile. */
export const TW = 16;

/** The pixel height of each tile. */
export const TH = 16;

/** The degree of scaling when scaling is enabled. */
const SCALING = 2;

/** The color of the grid lines. */
const GRID_COLOR = "#e0e0e0";

/** The fill color of the flag representing the PC's start position. */
const FLAG_COLOR = "#0000ff";

/** The default width (in tiles) of the main canvas. */
const DEFAULT_WIDTH = 16;

/** The default height (in tiles) of the main canvas. */
const DEFAULT_HEIGHT = 16;

/** The CSS selector for the app's sidebar. */
const SIDEBAR_SELECTOR = "#Sidebar";

/** The name of the radio button group in the sidebar. */
const RADIO_NAME = "tiles"

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

/** The CSS selector for the row of width and height input fields. */
const DIM_SELECTOR = "#DimensionInputs";

/** The CSS selector for the menu bar. */
const MENU_SELECTOR = "#MenuBar";

/** The CSS selector for the element displaying the current file name. */
const FILENAME_SELECTOR = "#FileName";

/** The CSS selector for the load input. */
const LOAD_SELECTOR = "#LoadInput";

/** The CSS selector for the save as input. */
const SAVE_AS_SELECTOR = "#SaveAsInput";

/** The relative path to the id.json file. */
const ID_JSON_PATH = "./../../id.json";

/** The "model" portion of the program with some domain violations tossed in. */
export class App {
    /** The array representing the individual tiles. */
    private _tileset: Array<ImageBitmap>;

    /** The index of the tile currently "selected," i.e., the one that is to be
     * painted onto the main canvas. */
    private _selected: number;

    /** The TileMap object itself. */
    private _tileMap: TileMap;

    /** Identifies a tile's type based on its order. Inferred from id.json. */
    private _tileTypes: Array<string>

    /**
     * Constructs an App object. 
     * @param {Array<ImageBitmap>} theTileset - An array representing all tiles.
     */ 
    constructor(theTileset: Array<ImageBitmap>) {
        if (theTileset.length == 0) {
            throw new Error("App constructor passed empty tileset array.");
        } else {
            this._tileset = theTileset;
            this._selected = 0;
            this._tileMap = new TileMap(DEFAULT_WIDTH, DEFAULT_HEIGHT);
            // Initialize _tileTypes.
            fetch(ID_JSON_PATH)
                .then((theResponse: Response) => {
                    return theResponse.json()
                })
                .then((theData: Object | undefined) => {
                    if (theData === undefined) {
                        throw new Error("App could not load id.json correctly");
                    } else {
                        this._tileTypes = new Array<string>(theTileset.length);
                        for (let key in theData) {
                            if (theData[key] < theTileset.length) {
                                this._tileTypes[theData[key]] = key;
                            } else {
                                console.warn("Tile ID given to a tile with a " +
                                    "number greater than possible."
                                );
                            }
                        }
                        for (let i = 1; i < this._tileTypes.length; i++) {
                            if (this._tileTypes[i] === undefined) {
                                this._tileTypes[i] = this._tileTypes[i - 1];
                            }
                        }
                        if (this._tileTypes.indexOf(TERRAIN_TYPE) < 0) {
                            console.warn("Custom tileset is missing '" +
                                TERRAIN_TYPE + "' type:"
                            );
                            console.log(this._tileTypes);
                        }
                    }
                })
                .catch((theError: any) => {
                    console.error(theError);
                })
        }
    }
    
    /** 
     * Starts the app by initializing the view and adding event handlers.
     */
    start() {
        let html = document.querySelector("html") as HTMLElement;
        html.style.fontSize = `${TH * SCALING}px`;
        this.createTileCanvases();
        this.setCanvasDimensions(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        let output = document.querySelector(OUTPUT_SELECTOR) as HTMLTextAreaElement;
        output.value = this._tileMap.toString();
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        let width = document.querySelector(WIDTH_SELECTOR) as HTMLInputElement;
        let height = document.querySelector(HEIGHT_SELECTOR) as HTMLInputElement;
        canvas.addEventListener("mousemove", (theEvent: MouseEvent) => {
            this.mouseHandler(theEvent);
        });
        canvas.addEventListener("mousedown", (theEvent: MouseEvent) => {
            this.mouseHandler(theEvent);
        });
        width.value = String(DEFAULT_WIDTH);
        width.addEventListener("input", (theEvent: InputEvent) => {
            this.dimensionHandler(theEvent);
        });
        height.value = String(DEFAULT_HEIGHT);
        height.addEventListener("input", (theEvent: InputEvent) => {
            this.dimensionHandler(theEvent);
        });
        this.setSidebarHeight();
        this.draw();
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
            radButt.addEventListener("input", (theEvent: InputEvent) => {
                this.radioHandler(theEvent);
            });
            label.append(radButt);
            let canvas = document.createElement("canvas");
            canvas.className = "tile";
            canvas.height = TH * SCALING;
            canvas.width = TW * SCALING;
            label.append(canvas);
            let sidebar = document.querySelector(SIDEBAR_SELECTOR) as HTMLDivElement;
            sidebar.append(label);
            let ctx = canvas.getContext("2d");
            if (ctx === null) {
                console.log(`Failed to draw tile ${this._tileset[i]}.`);
            } else {
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
    radioHandler(theEvent: Event) {
        if (theEvent.target !== null && theEvent.target instanceof HTMLInputElement) {
            this._selected = Number(theEvent.target.value);
        }
    }
    
    /**
     * Sets up the main canvas dimensions.
     * @param {number} theWidth - The width of the canvas (in tiles).
     * @param {number} theHeight - The height of the canvas (in tiles).
     */ 
    setCanvasDimensions(theWidth: number, theHeight: number) {
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        this._tileMap.resize(theWidth, theHeight);
        canvas.width = TW * theWidth * SCALING;
        canvas.style.width = String(TW * theWidth * SCALING);
        canvas.height = TH * theHeight * SCALING;
        canvas.style.height = String(TH * theHeight * SCALING);
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.log("Failed to set canvas dimensions.");
        } else {
            ctx.scale(SCALING, SCALING);
            ctx.imageSmoothingEnabled = false;
        }
    }
    
    /**
     * Handles mouse clicks, movements, etc. across the main canvas.
     * @param {MouseEvent} theEvent - The event that triggered the function call.
     */
    mouseHandler(theEvent: MouseEvent) {
        let x = Math.floor(theEvent.offsetX / (TW * SCALING));
        let y = Math.floor(theEvent.offsetY / (TH * SCALING));
        let t = this._tileTypes[this._selected];
        if (theEvent.buttons === DRAW_CLICK) {
            if (theEvent.shiftKey) {                
                this._tileMap.assignValue(null, x, y, t);
            } else if (theEvent.ctrlKey) {
                this._tileMap.assignStart(x, y);
            } else {
                this._tileMap.assignValue(this._selected, x, y, t);
            }
            this.draw();
            let output = document.querySelector(OUTPUT_SELECTOR) as HTMLTextAreaElement;
            output.value = this._tileMap.toString();
        }
    }
    
    /** 
     * Handles input on the dimension fields.
     * @param {InputEvent} theEvent - The event that triggered the function call.
     */
    dimensionHandler(theEvent: InputEvent) {
        let widthEl = document.querySelector(WIDTH_SELECTOR) as HTMLInputElement;
        let heightEl = document.querySelector(HEIGHT_SELECTOR) as HTMLInputElement;
        let width = Number.parseInt(widthEl.value);
        let height = Number.parseInt(heightEl.value);
        if (!Number.isNaN(width) && !Number.isNaN(height) && 
            width >= parseInt(widthEl.min) && height >= parseInt(heightEl.min)) {
            this._tileMap.resize(width, height);
            this.setCanvasDimensions(width, height);
            this.draw();
            let output = document.querySelector(OUTPUT_SELECTOR) as HTMLTextAreaElement;
            output.value = this._tileMap.toString();
        }
    }
    
    /**
     * Draws the tilemap onto the canvas.
     */
    draw() {
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");
        let w = this._tileMap.terrain[0].length * TW;
        let h = this._tileMap.terrain.length * TH;
        if (ctx === null) {
            console.log("Drawing on main canvas failed.");
        } else {
            ctx.clearRect(0, 0, w, h);
            this.drawGrid();
            for (let i = 0; i < this._tileMap.terrain.length; i++) {
                for (let j = 0; j < this._tileMap.terrain[i].length; j++) {
                    let n = this._tileMap.terrain[i][j];
                    if (typeof n === "number") {
                        let img = this._tileset[n];
                        ctx.drawImage(img, j * TW, i * TH);
                    }
                    n = this._tileMap.things[i][j];
                    if (typeof n === "number") {
                        let img = this._tileset[n];
                        ctx.drawImage(img, j * TW, i *TH);
                    }
                }
            }
            // Draw the player character's starting position.
            ctx.font = `${TH}px sans-serif`
            ctx.textBaseline = "top";
            ctx.fillStyle = FLAG_COLOR;
            ctx.strokeStyle = GRID_COLOR;
            ctx.fillText("⚑", this._tileMap.startX * TW, this._tileMap.startY * TH);
            ctx.strokeText("⚑", this._tileMap.startX * TW, this._tileMap.startY * TH);
        }
    }
    
    /** Draws a grid beneath the tiles. */
    drawGrid() {
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.log("Drawing grid onto main canvas failed.");
        } else {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;
            for (let i = 0; i < this._tileMap.terrain[0].length; i++) {
                ctx.moveTo((i * TW) - 0.5, 0);
                ctx.lineTo((i * TW) - 0.5, this._tileMap.terrain.length * TH);
            }
            for (let i = 0; i < this._tileMap.terrain.length; i++) {
                ctx.moveTo(0, (i * TH) - 0.5);
                ctx.lineTo(this._tileMap.terrain[0].length * TW, (i * TH) - 0.5);
            }
            ctx.stroke();
        }
    }

    /** Sets the height of the sidebar so the page takes up exactly 100vh. */
    setSidebarHeight() {
        let row1 = document.querySelector(MENU_SELECTOR) as HTMLDivElement;
        let row2 = document.querySelector(DIM_SELECTOR) as HTMLDivElement;
        let row3 = document.querySelector(OUTPUT_SELECTOR) as HTMLDivElement;
        let h = row1.offsetHeight + row2.offsetHeight + row3.offsetHeight;
        let sidebar = document.querySelector(SIDEBAR_SELECTOR) as HTMLElement;
        sidebar.style.height = `calc(100vh - ${h}px)`;
    }

    /** Writes the name of the file to the view. */
    writeFileName() {

    }
}

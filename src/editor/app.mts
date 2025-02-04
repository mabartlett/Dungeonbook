/**
 * @file Contains the App class for the level editor.
 * @author Marcus Bartlett
 */

import { DEFAULT_WIDTH, DEFAULT_HEIGHT, TERRAIN_TYPE, TileMap } from "./tilemap.mjs";

//#region Constants

/** The pixel width of each tile. */
export const TW = 16;

/** The pixel height of each tile. */
export const TH = 16;

/** The degree of scaling when scaling is enabled. */
export const SCALING = 2;

/** The CSS class for the tile canvases in the side bar. */
export const TILE_CANVAS_CLASS = "tile";

/** The number code corresponding to the mouse button for drawing. */
export const DRAW_CLICK = 1;

/** The number code corresponding to the mouse button for erasing. */
export const ERASE_CLICK = 2;

/** The color of the grid lines. */
const GRID_COLOR = "#e0e0e0";

/** The fill color of the flag representing the PC's start position. */
const FLAG_COLOR = "#0000ff";

/** The CSS selector for the app's sidebar. */
const SIDEBAR_SELECTOR = "#Sidebar";

/** The name of the radio button group in the sidebar. */
const RADIO_NAME = "tiles"

/** The CSS class for the labels for the tile canvas elements in the sidebar. */
const TILE_LABEL_CLASS = "tile-label";

/** The CSS selector for the main canvas. */
const CANVAS_SELECTOR = "#MainCanvas";

/** The CSS selector for the width input field. */
const WIDTH_SELECTOR = "#WidthInput";

/** The CSS selector for the height input field. */
const HEIGHT_SELECTOR = "#HeightInput";

/** The CSS selector for the total depth input field. */
const TOT_DEPTH_SELECTOR = "#TotDepthInput";

/** The CSS selector for the current depth input field. */
const CURR_DEPTH_SELECTOR = "#CurrDepthInput";

/** The CSS selector for the row of width and height input fields. */
const DIM_SELECTOR = "#DimensionInputs";

/** The CSS selector for the menu bar. */
const MENU_SELECTOR = "#MenuBar";

/** The CSS selector for the load input. */
const LOAD_SELECTOR = "#LoadInput";

/** The CSS selector for the save as input. */
const SAVE_AS_SELECTOR = "#SaveAsInput";

/** The relative path to the id.json file. */
const ID_JSON_PATH = "./../../id.json";

/** The character used to draw the PC's starting position. */
const START_CHAR = "⚑";

/** The minimum allowed value for the height and width. */
const DIM_MIN = 2;

/** The maximum allowed value for the height and width. */
const DIM_MAX = 256;

//#endregion

/** The "model" portion of the program with some domain violations tossed in. */
export class App {
    //#region Fields, Constructor
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
     * The depth currently being viewed in the editor. Note that this value is 
     * zero-indexed rather than one-indexed like it is in the editor view.
     */
    private _currDepth: number;

    /**
     * Constructs an App object. 
     * @param theTileset - An array representing all tiles.
     */ 
    constructor(theTileset: Array<ImageBitmap>) {
        if (theTileset.length == 0) {
            throw new Error("App constructor passed empty tileset array.");
        } else {
            this._tileset = theTileset;
            this._selected = 0;
            this._tileMap = new TileMap();
            this._currDepth = 0;
            this._tileTypes = new Array<string>(this._tileset.length);
        }
    }

    //#endregion
    //#region Instance Methods

    /** Initializes the _tileTypes field. */
    async initializeTileTypes() {
        await fetch(ID_JSON_PATH)
            .then(async (theResponse: Response) => {
                return await theResponse.json()
            })
            .then((theData: Object | undefined) => {
                if (theData === undefined) {
                    throw new Error("App could not load id.json correctly");
                } else {
                    
                    for (let key in theData) {
                        if (theData[key] < this._tileset.length) {
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
    
    /** Starts the app by initializing the view and adding event handlers. */
    start() {
        let html = document.querySelector("html") as HTMLElement;
        html.style.fontSize = `${TH * SCALING}px`;
        this.createTileCanvases();
        this.setCanvasDimensions(DEFAULT_WIDTH, DEFAULT_HEIGHT, 1);
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        canvas.addEventListener("mousemove", (theEvent: MouseEvent) => {
            this.mouseHandler(theEvent);
        });
        canvas.addEventListener("mousedown", (theEvent: MouseEvent) => {
            this.mouseHandler(theEvent);
        });
        canvas.addEventListener("contextmenu", (theEvent: MouseEvent) => {
            theEvent.preventDefault();
        });
        this.initDimInputElement(WIDTH_SELECTOR, DEFAULT_WIDTH);
        this.initDimInputElement(HEIGHT_SELECTOR, DEFAULT_HEIGHT);
        let tDepth = document.querySelector(TOT_DEPTH_SELECTOR) as HTMLInputElement;
        tDepth.value = String(1);
        tDepth.addEventListener("input", (theEvent: InputEvent) => {
            this.dimensionHandler(theEvent);
        });
        let cDepth = document.querySelector(CURR_DEPTH_SELECTOR) as HTMLInputElement;
        cDepth.value = String(1);
        cDepth.max = String(1);
        cDepth.addEventListener("input", (theEvent: InputEvent) => {
            this.depthHandler(theEvent);
        });
        let saveAs = document.querySelector(SAVE_AS_SELECTOR) as HTMLElement;
        saveAs.addEventListener("click", (theEvent: Event) => {
            this.saveAsHandler(theEvent);
        })
        let load = document.querySelector(LOAD_SELECTOR) as HTMLElement;
        load.addEventListener("input", (theEvent: Event) => {
            this.uploadHandler(theEvent);
        });
        this.setSidebarHeight();
        this.draw();
    }

    /**
     * Initializes a dimension input element with a default value as well as min
     * and max values.
     * @param theSelector - The CSS selector used to locate the input element.
     * @param theDefault - The default value the element is initialized with.
     */
    initDimInputElement(theSelector: string, theDefault: number) {
        const element = document.querySelector(theSelector) as HTMLInputElement;
        element.value = String(theDefault);
        element.addEventListener("input", (theEvent: InputEvent) => {
            this.dimensionHandler(theEvent);
        });
        element.setAttribute("min", String(DIM_MIN));
        element.setAttribute("max", String(DIM_MAX));
    }
    
    /**
     * Creates the tile canvas checkbox group in the sidebar and adds 
     * appropriate event handlers.
     */
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
            radButt.addEventListener("input", (theEvent: InputEvent) => {
                this.radioHandler(theEvent);
            });
            label.append(radButt);
            let canvas = document.createElement("canvas");
            canvas.className = TILE_CANVAS_CLASS;
            canvas.height = TH * SCALING;
            canvas.width = TW * SCALING;
            label.append(canvas);
            let sidebar = document.querySelector(SIDEBAR_SELECTOR) as HTMLDivElement;
            // Add the heading for "things."
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
            } else {
                ctx.imageSmoothingEnabled = false;
                ctx.scale(SCALING, SCALING);
                ctx.drawImage(this._tileset[i], 0, 0);
            }
        }
    }
    
    /**
     * Handles the clicks on the tiles in the sidebar.
     * @param theEvent - The event that triggered the calling of this function.
     */
    radioHandler(theEvent: Event) {
        if (theEvent.target !== null && theEvent.target instanceof HTMLInputElement) {
            this._selected = Number(theEvent.target.value);
        }
    }
    
    /**
     * Sets up the main canvas dimensions.
     * @param theWidth - The width of the canvas (in tiles).
     * @param theHeight - The height of the canvas (in tiles).
     * @param theDepth - The number of levels (in grids).
     */ 
    setCanvasDimensions(theWidth: number, theHeight: number, theDepth: number) {
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        this._tileMap.resize(theWidth, theHeight, theDepth);
        canvas.width = TW * theWidth * SCALING;
        canvas.style.width = String(TW * theWidth * SCALING);
        canvas.height = TH * theHeight * SCALING;
        canvas.style.height = String(TH * theHeight * SCALING);
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.warn("Failed to set canvas dimensions.");
        } else {
            ctx.scale(SCALING, SCALING);
            ctx.imageSmoothingEnabled = false;
        }
    }
    
    /**
     * Handles mouse clicks, movements, etc. across the main canvas.
     * @param theEvent - The event that triggered the function call.
     */
    mouseHandler(theEvent: MouseEvent) {
        if ((theEvent.buttons === DRAW_CLICK || theEvent.buttons === ERASE_CLICK) && 
        this._tileTypes !== undefined) {
            theEvent.preventDefault();
            let x = Math.min(Math.floor(theEvent.offsetX / (TW * SCALING)), 
                this._tileMap.terrain[0][0].length - 1);
            let y = Math.min(Math.floor(theEvent.offsetY / (TH * SCALING)), 
                this._tileMap.terrain[0].length - 1);
            let t = this._tileTypes[this._selected];
            if (theEvent.buttons === ERASE_CLICK) {                
                this._tileMap.assignValue(null, x, y, this._currDepth, t);
            } else if (theEvent.ctrlKey && this._currDepth === 0) {
                this._tileMap.assignStart(x, y);
            } else if (theEvent.buttons === DRAW_CLICK && !theEvent.ctrlKey) {
                this._tileMap.assignValue(this._selected, x, y, this._currDepth, t);
            }
            this.draw();
        }
    }
    
    /** 
     * Handles input on the dimension fields.
     * @param theEvent - The event that triggered the function call.
     */
    dimensionHandler(theEvent: InputEvent) {
        let widthEl = document.querySelector(WIDTH_SELECTOR) as HTMLInputElement;
        let heightEl = document.querySelector(HEIGHT_SELECTOR) as HTMLInputElement;
        let depthEl = document.querySelector(TOT_DEPTH_SELECTOR) as HTMLInputElement;
        let cdepthEl = document.querySelector(CURR_DEPTH_SELECTOR) as HTMLInputElement;
        let width = Number.parseInt(widthEl.value);
        let height = Number.parseInt(heightEl.value);
        let depth = Number.parseInt(depthEl.value);
        if (!Number.isNaN(width) && !Number.isNaN(height) && !Number.isNaN(depth) &&
            width >= DIM_MIN && height >= DIM_MIN && depth >= 1) {
            // Remember that the depth is zero-indexed!
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

    /**
     * Saves the file.
     * @param theEvent - The Event that triggered the function call.
     */
    saveAsHandler(theEvent: Event) {
        if (theEvent.target instanceof HTMLAnchorElement) {
            let blob = new Blob([this._tileMap.toString()], 
                {type: "text/json"});
            let url = URL.createObjectURL(blob);
            theEvent.target.href = url;
            // I know, I know. I didn't really have a choice here.
            window.setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 5000)
        }
    }

    /**
     * Loads a .json file, validates it, replaces the current TileMap object, 
     * and then draws it.
     * @param theEvent - The Event that triggered the function call.
     */
    uploadHandler(theEvent: Event) {
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
                    (document.querySelector(CURR_DEPTH_SELECTOR) as HTMLInputElement)
                        .value = String(d - 1);
                    (document.querySelector(CURR_DEPTH_SELECTOR) as HTMLInputElement)
                        .max = String(d - 1);
                    (document.querySelector(TOT_DEPTH_SELECTOR) as HTMLInputElement)
                        .value = String(d);
                    let h = tm.terrain[0].length;
                    (document.querySelector(HEIGHT_SELECTOR) as HTMLInputElement)
                        .value = String(h);
                    let w = tm.terrain[0][0].length;
                    (document.querySelector(WIDTH_SELECTOR) as HTMLInputElement)
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

    /** 
     * Handles input on the current depth input field.
     * @param theEvent - The event that triggered the function call. 
     */
    depthHandler(theEvent: InputEvent) {
        let inputEl = document.querySelector(CURR_DEPTH_SELECTOR) as HTMLInputElement;
        let depth = Number.parseInt(inputEl.value);
        if (!Number.isNaN(depth) && depth <= this._tileMap.terrain.length) {
            this._currDepth = depth - 1;
            this.draw();
        }
    }
    
    /** Draws the tilemap onto the canvas. */
    draw() {
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");
        let w = this._tileMap.terrain[0][0].length * TW;
        let h = this._tileMap.terrain[0].length * TH;
        if (ctx === null) {
            console.warn("Drawing on main canvas failed.");
        } else {
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
                        ctx.drawImage(img, j * TW, i *TH);
                    }
                }
            }
            // Draw the player character's starting position.
            if (this._currDepth === 0) {
                ctx.font = `${TH}px sans-serif`
                ctx.textBaseline = "top";
                ctx.fillStyle = FLAG_COLOR;
                ctx.strokeStyle = GRID_COLOR;
                ctx.fillText(START_CHAR, this._tileMap.startX * TW, 
                    this._tileMap.startY * TH);
                ctx.strokeText(START_CHAR, this._tileMap.startX * TW, 
                    this._tileMap.startY * TH);
            }
        }
    }
    
    /** Draws a grid beneath the tiles. */
    drawGrid() {
        let canvas = document.querySelector(CANVAS_SELECTOR) as HTMLCanvasElement;
        let ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.warn("Drawing grid onto main canvas failed.");
        } else {
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

    /** Sets the height of the sidebar so the page takes up exactly 100vh. */
    setSidebarHeight() {
        let row1 = document.querySelector(MENU_SELECTOR) as HTMLDivElement;
        let row2 = document.querySelector(DIM_SELECTOR) as HTMLDivElement;
        let h = row1.offsetHeight + row2.offsetHeight;
        let sidebar = document.querySelector(SIDEBAR_SELECTOR) as HTMLElement;
        sidebar.style.height = `calc(100vh - ${h}px)`;
    }
}

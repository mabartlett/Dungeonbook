/**
 * @file Contains the Game class and associated constants. The Game object is 
 * ignorant about the web page and this file contains no constants in reference
 * to it.
 * @author Marcus Bartlett
 */

import { Dungeon } from "./dungeon.mjs";
import { ARROW_KEYS, CS_KEYS, InputHandler } from "./inputhandler.mjs";
import { Observer } from "./observer.mjs";
import { TextBox, TextBoxParams, CW, CH } from "./textbox.mjs";
import { TileMap } from "./editor/tilemap.mjs";

/** Represents a pair of x and y coordinates. */
export type Point = {
    x: number;
    y: number;
};

//#region Constants

/** The height of the screen in pixels before scaling. */
export const SCREEN_HEIGHT = 288;

/** The width of the screen in pixels before scaling. */
export const SCREEN_WIDTH = 512;

/** The signals that can be emitted. */
export enum SIGNALS {
    GAME_START,
    NEW_GAME
}

/** The states of the game as an entirety. */
export enum STATES {
    MAIN_MENU
}

/** The path to the border image. */
const BORDER_PATH = "./img/border.png";

/** The path to the title image. */
const TITLE_PATH = "./img/title.png";

/** The path to the spritesheet/tilesheet. */
const SHEET_PATH = "./img/sheet_16.png";

/** The path to the one bitmap font currently supported. */
const FONT_PATH = "./img/font_6x8.png";

/** The directory in which the dungeons are saved. */
const DUNGEON_DIR = "./dungeons/";

/** The file name of the playground level. */
const PLAYGROUND_NAME = "playground.json";

/** The pixel width of each tile. */
const TW = 16;

/** The pixel height of each tile. */
const TH = 16;

/** The pixel width of the main panel that usually displays the world. */
const MAIN_PANEL_WIDTH = 256;

/** The pixel height of the main panel that usually displays the world. */
const MAIN_PANEL_HEIGHT = 256;

/** The width of the side panels. */
const SIDE_PANEL_WIDTH = 208;

/** The top left corner of the main panel. */
const PT_PANEL_MAIN: Point = {x: 240, y: 16};

/** The number of context-sensitive buttons. */
const BUTTONS_NUM = 6;

/** The top left  corner of the buttons panel. */
const PT_PANEL_BTNS: Point = {x: 16, y: 160};

/** The right margin of the buttons in pixels. */
const BTNS_MARGIN_RIGHT = -1;

/** The top margin of the buttons in pixels. */
const BTNS_MARGIN_TOP = 0;

/** The pixel width of the context-sensitive buttons. */
const BTNS_WIDTH = 70;

/** The pixel height of the context-sensitive buttons. */
const BTNS_HEIGHT = 24;

/** The left padding of the context-sensitive buttons. */
const BTNS_PADDING_LEFT = 2;

/** The top padding for the context-sensitive buttons. */
const BTNS_PADDING_TOP = 4;

/** The object containing all needed data for the main information textbox. */
const TEXTBOX_INFO: TextBoxParams = {
    point: {x: 18, y: 228},
    width: 204,
    height: 40
}

/** The text appearing in the information text box on the title screen. */
const TITLE_SCREEN_INFO_TEXT = "Press one of the context-sensitive keys to " + 
    "start. (On a standard QWERTY keyboard, the keys Q, W, E, A, S, and D.)";

/** The InputHandler singleton. */
const INPUT = InputHandler.getInstance();

//#endregion

/** The Game object is the root object of the world object heirarchy */
export class Game extends Observer {

    //#region Fields, Constructor

    /** An array of images, i.e., all the game's sprites. */
    private _sprites: ImageBitmap[];
    
    /** The game's current dungeon or "level". Can also be a town. */
    private _world: TileMap;

    /** The 2D canvas rendering context for the whole screen. */
    private _ctx: CanvasRenderingContext2D;
    
    /** The border image around which other graphics are drawn. */
    private _img_border: ImageBitmap;

    /** The title image. */
    private _img_title: ImageBitmap;

    /** The textbox where all the dialogue and info is printed. */
    private _info_textBox: TextBox;

    /** The main font used. */
    private _main_font: ImageBitmap[];

    /** The textboxes displaying the hints for the context-sensitive buttons. */
    private _butt_boxes: TextBox[];

    /** The state of the game as a whole. */
    private _state: number;

    /** 
     * Constructs a Game object. 
     * @param theCtx - The 2D canvas rendering context for the screen.
     */
    constructor(theCtx: CanvasRenderingContext2D) {
        super();
        this._ctx = theCtx;
        this._butt_boxes = new Array<TextBox>();
        this._state = 0;
        this._world = new TileMap();
    }

    //#endregion
    
    /** Starts the game by loading resources, drawing, and signalling. */
    async start() {
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
            this._img_border = theValues[0] as ImageBitmap;
            this._img_title = theValues[1] as ImageBitmap;
            this._sprites = theValues[2] as ImageBitmap[];
            this._main_font = theValues[3] as ImageBitmap[];
            this._info_textBox = new TextBox(TEXTBOX_INFO,
                this._main_font, this._ctx);
            this._sprites = theValues[4] as ImageBitmap[];
            this.draw();
            this.emitSignal(SIGNALS.GAME_START);
            this._state = STATES.MAIN_MENU;
            this.draw_buttons();
            });
        }
    
    /** @override */
    protected receiveSignal(theSender: Observer, theSignal: string | number): void {
        if (INPUT.signal_is_keydown(theSignal)) {
            if (this._state === STATES.MAIN_MENU) {
                if (theSignal as string === "KeyQ") {
                    this.new_game();
                }
            }
        }
    }

    //#region Loading
        
    /**
     * Takes a path to an image and returns a Promise that resolves to an 
     * ImageBitmap of that image.
     * @param thePath - The path to the image.
     * @return A Promise resolving to an ImageBitmap for the specified image. If
     * the specified path is invalid, the promise is rejected with an error.
     */
    async loadImageBitmap(thePath: string): Promise<ImageBitmap>  {
        const img = new Image();
        img.src = thePath;
        return new Promise<ImageBitmap>((resolve, reject) => {
            img.addEventListener("load", () => {
                createImageBitmap(img)
                    .then((theIB) => {resolve(theIB)})
                    .catch((theError) => {reject(theError)});
            });
            img.addEventListener("error", () => {
                reject(new Error(`Could not load image from ${thePath}.`));
            });
        });
    }

    /**
     * Takes a path to a sprite sheet and returns a Promise that resolves to an
     * array of ImageBitmaps for each sprite on that sheet.
     * @param thePath - The path to the image.
     * @param theWidth - The pixel width of each sprite.
     * @param theHeight - The pixel height of each sprite.
     * @return A promise resolving to an array of ImageBitmaps for the specified
     * sprite sheet. If the path is invalid, the promise is rejected with an
     * error.
     */
    async loadImageBitmapSheet(thePath: string, theWidth: number, 
            theHeight: number): Promise<ImageBitmap[]> {
        const img = new Image();
        img.src = thePath;
        return new Promise<ImageBitmap[]>((resolve, reject) => {
            img.addEventListener("load", () => {
                const arr = new Array<Promise<ImageBitmap>>();
                for (let i = 0; i * theHeight < img.naturalHeight; i++) {
                    for (let j = 0; j * theWidth < img.naturalWidth; j++) {
                        arr.push(createImageBitmap(img, j * theWidth, 
                            i * theHeight, theWidth, theHeight));
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
    }

    /**
     * Loads a dungeon file and returns a Promise resolving to a TileMap of that
     * dungeon.
     * @param theName - The filename of the dungeon to load.
     * @return A promise resolving to a TileMap representing the loaded dungeon.
     */
    async loadDungeon(theName: string): Promise<TileMap> {
        const path = DUNGEON_DIR + theName;
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Could not load ${path}: status ${response.status}.`);
        }
        const json = await response.json();
        return new TileMap(json);
    }

    //#endregion
    //#region Drawing

    /** Draws everything to the screen. */
    draw(): void {
        this.draw_background();
        this.draw_title_screen();
    }

    /** Draws the background that remains the same throughout the whole game. */
    draw_background(): void {
        this._ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.fillStyle = "#000000";
        this._ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.drawImage(this._img_border, 0, 0);
        this._ctx.strokeStyle = "#ffffff";
    }

    /** Draws the graphics unique to the title screen. */
    draw_title_screen(): void {
        this._ctx.drawImage(this._img_title, PT_PANEL_MAIN.x, PT_PANEL_MAIN.y);
        this._info_textBox.write(TITLE_SCREEN_INFO_TEXT);
    }

    /**
     * Sets up and draws the context-sensitive buttons display.
     */
    draw_buttons(): void {
        let rows = 1;
        let cols = BUTTONS_NUM;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((BTNS_WIDTH + BTNS_MARGIN_RIGHT) * (j + 1) > SIDE_PANEL_WIDTH) {
                    cols = j;
                    if (cols * (rows + 1) <= BUTTONS_NUM) {
                        rows++; 
                    }
                } else {
                    let x_comp = (BTNS_WIDTH + BTNS_MARGIN_RIGHT) * j;
                    let y_comp = (BTNS_HEIGHT + BTNS_MARGIN_TOP) * i;
                    this._ctx.clearRect(PT_PANEL_BTNS.x + x_comp, 
                        PT_PANEL_BTNS.y + y_comp, BTNS_WIDTH, BTNS_HEIGHT);
                    let idx = (i * cols) + j;
                    if (this._butt_boxes.length < BUTTONS_NUM) {
                        let params: TextBoxParams = {
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
                    } else {                        
                        this._butt_boxes[i].write(INPUT.contexts[idx]);
                    }
                    this._ctx.strokeRect(
                        PT_PANEL_BTNS.x + 0.5 + x_comp,
                        PT_PANEL_BTNS.y + 0.5 + y_comp,
                        BTNS_WIDTH - 1, BTNS_HEIGHT - 1
                    );
                }
            }
        }
    }

    /** Draws the game world. */
    draw_world(): void {
        this._ctx.clearRect(PT_PANEL_MAIN.x, PT_PANEL_MAIN.y, MAIN_PANEL_WIDTH, 
            MAIN_PANEL_HEIGHT);
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let terr = this._world.terrain[0][i][j];
                let thing = this._world.things[0][i][j];
                if (terr !== null) {
                    this._ctx.drawImage(this._sprites[terr], (j * TW) + 240 , 
                        (i * TH) + 16);
                }
                if (thing !== null) {
                    this._ctx.drawImage(this._sprites[thing], (j * TW) + 240 , 
                        (i * TH) + 16);
                }
            }
        }
    }
    
    //#endregion

    /** Begins a new game. */
    async new_game(): Promise<void> {
        this.emitSignal(SIGNALS.NEW_GAME);
        this.draw_buttons();
        this._world = await this.loadDungeon(PLAYGROUND_NAME);
        this.draw_world();
    }
}
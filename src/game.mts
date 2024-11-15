/**
 * @file Contains the Game class and associated constants. The Game object is 
 * ignorant about the web page and this file contains no constants in reference
 * to it.
 * @author Marcus Bartlett
 */

import { Dungeon } from "./dungeon.mjs";

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

/** The path to the border image. */
const BORDER_PATH = "./img/border.png";

/** The path to the title image. */
const TITLE_PATH = "./img/title.png";

/** The path to the spritesheet/tilesheet. */
const SHEET_PATH = "./img/sheet_16.png";

/** The pixel width of each tile. */
const TW = 16;

/** The pixel height of each tile. */
const TH = 16;

/** The top left corner of the main panel. */
const PT_PANEL_MAIN: Point = {x: 240, y: 16};

//#endregion

/** The Game object is the root object of the world object heirarchy */
export class Game {

    //#region Fields, Constructor

    /** An array of images, i.e., all the game's sprites. */
    private _sprites: ImageBitmap[];
    
    /** The game's current dungeon or "level". Can also be a town. */
    private _dungeon: Dungeon;

    /** The 2D canvas rendering context for the whole screen. */
    private _ctx: CanvasRenderingContext2D;
    
    /** The border image around which other graphics are drawn. */
    private _img_border: ImageBitmap;

    /** The title image. */
    private _img_title: ImageBitmap;

    /** 
     * Constructs a Game object. 
     * @param theCtx - The 2D canvas rendering context for the screen.
     */
    constructor(theCtx: CanvasRenderingContext2D) {
        this._ctx = theCtx;
    }

    //#endregion
    
    /** Starts the game. */
    async start() {
        this._ctx.imageSmoothingEnabled = false;
        const images = [
            this.loadImageBitmap(BORDER_PATH),
            this.loadImageBitmap(TITLE_PATH),
            this.loadImageBitmapSheet(SHEET_PATH, TW, TH),
        ];
        Promise.all(images).then((theValues) => {
            this._img_border = theValues[0] as ImageBitmap;
            this._img_title = theValues[1] as ImageBitmap;
            this._sprites = theValues[2] as ImageBitmap[];
            this.draw();
        });
    }

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
                        reject(theError)
                    });
            });
        });
    }

    /** Draws everything to the screen. */
    draw() {
        this._ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.fillStyle = "#000000";
        this._ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this._ctx.drawImage(this._img_border, 0, 0);
        this._ctx.drawImage(this._img_title, PT_PANEL_MAIN.x, PT_PANEL_MAIN.y);
    }
}
/**
 * @file Contains the Game class and associated constants. The Game object is 
 * ignorant about the web page and this file contains no constants in reference
 * to it.
 * @author Marcus Bartlett
 */

import { Dungeon } from "./dungeon.mjs";

/** The height of the screen in pixels before scaling. */
export const SCREEN_HEIGHT = 288;

/** The width of the screen in pixels before scaling. */
export const SCREEN_WIDTH = 512;

/** The Game object is the root object of the world object heirarchy */
export class Game {
    /** An array of images, i.e., all the game's sprites. */
    private _sprites: ImageBitmap[];
    
    /** The game's current dungeon or "level". Can also be a town. */
    private _dungeon: Dungeon;

    /** The 2D canvas rendering context for the whole screen. */
    private _ctx: CanvasRenderingContext2D;
    
    /** The border image around which other graphics are drawn. */
    private _border: ImageBitmap;

    /** 
     * Constructs a Game object. 
     * @param theSprites - An array of images, i.e., sprites.
     * @param theCtx - The 2D canvas rendering context for the screen.
     */
    constructor(theSprites: ImageBitmap[], theCtx: CanvasRenderingContext2D) {
        this._sprites = theSprites;
        this._ctx = theCtx;
    }
    
    /** Starts the game. */
    start() {
        
    }

    /**
     * Takes a path to an image and returns a Promise that resolves to an 
     * ImageBitmap of that image.
     * @param thePath - The path to the image.
     * @return A Promise resolving to an ImageBitmap for the specified image. If
     * the specified path is invalid, the returned value is a Promise resolving 
     * to a "blank" ImageBitmap. This is to avoid crashing the game.
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

    /** Draws everything to the screen. */
    draw() {

    }
}
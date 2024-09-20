/**
 * @file Contains the Game class and associated constants.
 * @author Marcus Bartlett
 */

import { Dungeon } from "./dungeon.js";
import { Screen } from "./screen.js";


/** The Game object is the root object of the world object heirarchy */
export class Game {
    /** 
     * An array of images, i.e., all the game's sprites. 
     * @private 
     * */
    private _sprites: ImageBitmap[];
    
    /**
     * The game's current dungeon or "level". Can also be a town.
     * @private
     */
    private _dungeon: Dungeon;
    private _screen: Screen;

    /** 
     * Constructs a Game object. 
     * @param theSprites - An array of images, i.e., sprites.
     */
    constructor(theSprites: ImageBitmap[]) {
        this._sprites = theSprites;
        
    }
    
    /** Starts the game. */
    public start(): void {
        
    }
}
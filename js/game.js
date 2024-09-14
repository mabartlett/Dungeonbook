"use strict";
/**
 * @file Contains the Game class and associated constants.
 * @author Marcus Bartlett
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
/** The Game object is the root object of the world object heirarchy */
class Game {
    /**
     * Constructs a Game object.
     * @param {ImageBitmap[]} theSprites - An array of images, i.e., sprites.
     */
    constructor(theSprites) {
        this._sprites = theSprites;
    }
    /** Starts the game. */
    start() {
    }
}
exports.Game = Game;

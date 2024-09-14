"use strict";
/**
 * @file Contains the dungeon class.
 * @author Marcus Bartlett
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dungeon = void 0;
/**
 * The Dungeon class is the "level" the game is currently taking place in.
 * (Note that a Dungeon instance can also represent a town.)
 */
class Dungeon {
    /**
     * Constructs a Dungeon instance.
     * @param {object} theDungeon - the object representing the dungeon.
     */
    constructor(theDungeon) {
        if (theDungeon === undefined) {
        }
        else {
            console.log(theDungeon);
        }
    }
}
exports.Dungeon = Dungeon;

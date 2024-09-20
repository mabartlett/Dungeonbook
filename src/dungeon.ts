/**
 * @file Contains the dungeon class.
 * @author Marcus Bartlett
 */

/** 
 * The Dungeon class is the "level" the game is currently taking place in. 
 * (Note that a Dungeon instance can also represent a town.)
 */
export class Dungeon {
    /** 
     * Constructs a Dungeon instance. 
     * @param theDungeon - the object representing the dungeon.
     */
    constructor(theDungeon?: object) {
        if (theDungeon === undefined) {

        } else {
            console.log(theDungeon);
        }
    }
}
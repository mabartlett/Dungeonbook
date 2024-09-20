/**
 * @file Contains the TileMap class for the level editor.
 * @author Marcus Bartlett
 */

/** The name of the terrain type as listed in id.json. */
export const TERRAIN_TYPE = "terrain";

/** Represents the array of tiles' numeric values, etc. */
export class TileMap {
    /** Contains the numeric values associated with each terrain tile. */
    private _terrain: Array<Array<number | null>>;

    /** The x-coordinate of the player character's starting position. */
    private _startX: number;

    /** The y-coordinate of the player character's starting position. */
    private _startY: number;

    /** The array of non-terrain things (e.g., enemies or collectibles). */
    private _things: Array<Array<number | null>>;

    /** 
     * Constructs a TileMap object.
     * @param {number} theWidth - The number of tiles wide the TileMap is.
     * @param {number} theHeight - The number of tiles high the TileMap is.
     */
    constructor(theWidth: number, theHeight: number) {
        if (theHeight < 1 || theWidth < 1) {
            throw new Error("TileMap constructor passed non-positive dimensions.");
        } else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth)) {
            throw new Error("TileMap constructor passed non-integer dimensions.");
        } else {
            this._terrain = new Array(theHeight);
            this._things = new Array(theHeight);
            for (let i = 0; i < theHeight; i++) {
                this._terrain[i] = new Array(theWidth).fill(null);
                this._things[i] = new Array(theWidth).fill(null);
            }
            this._startX = 0;
            this._startY = 0;
        }
    }
    
    /**
     * Resizes the TileMap based on provided dimensions.
     * @param {number} theWidth - The number of tiles wide to make the TileMap.
     * @param {number} theHeight - The number of tiles high to make the TileMap.
     */
    resize(theWidth: number, theHeight: number) {
        if (theHeight < 1 || theWidth < 1) {
            throw new Error("TileMap.resize passed non-positive dimensions");
        } else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth)) {
            throw new Error("TileMap.resize passed non-integer dimensions.");
        } else {
            this._terrain.length = theHeight;
            for (let i = 0; i < theHeight; i++) {
                if (Array.isArray(this._terrain[i])) {
                    let oldWidth = this._terrain[i].length;
                    this._terrain[i].length = theWidth;
                    for (let j = oldWidth; j < theWidth; j++) {
                        this._terrain[i][j] = null;
                    }
                } else {
                    this._terrain[i] = new Array(theWidth).fill(null);
                }
            }
        }
    }
    
    /**
     * Sets an array element at the given position to the given value.
     * @param {number | null} theValue - What to assign.
     * @param {number} theX - The x-coordinate (i.e., the column).
     * @param {number} theY - The y-coordinate (i.e., the row).
     * @param theType - The type of element being added, e.g., "terrain."
     */
    assignValue(theValue: number | null, theX: number, theY: number, theType: string) {
        if (theX < 0 || theX >= this._terrain[0].length || theY < 0 ||
                theY >= this._terrain.length) {
            throw new Error("TileMap.assignValue passed x or y out of bounds.");
        } else {
            if (theType === TERRAIN_TYPE) {
                this._terrain[theY][theX] = theValue;
            } else {
                this._things[theY][theX] = theValue;
            }
        }
    }
    
    /** @return {Array<Array<number | null>>} The tilemap */
    get terrain(): Array<Array<number | null>> {
        return this._terrain;
    }

    /** @return The PC's starting x-coordinate. */
    get startX(): number {
        return this._startX;
    }

    /** @return The PC's starting y-coordinate. */
    get startY(): number {
        return this._startY;
    }

    /** @return The array of non-terrain things, e.g., collectibles and NPC's. */
    get things(): Array<Array<number | null>> {
        return this._things;
    }

    /**
     * Changes the player character's starting coordinates.
     * @param theX - The new x-coordinate of the PC's starting position.
     * @param theY - The new y-coordinate of the PC's starting position.
     */
    assignStart(theX: number, theY: number) {
        if (theX < 0 || theX >= this._terrain[0].length || theY < 0 ||
                theY >= this._terrain.length) {
            throw new Error("TileMap.assignStart passed x or y out of bounds.");
        } else {
            this._startX = theX;
            this._startY = theY;
        }
    }

    /**
     * Overrides the default behavior of the inherited toString method.
     * @returns A string representation of the TileMap.
     */
    toString(): string {
        return JSON.stringify(this);
    }
}

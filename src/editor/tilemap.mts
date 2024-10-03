/**
 * @file Contains the TileMap class for the level editor.
 * @author Marcus Bartlett
 */

/** The name of the terrain type as listed in id.json. */
export const TERRAIN_TYPE = "terrain";

/** The default width (in tiles) of the main canvas. */
export const DEFAULT_WIDTH = 16;

/** The default height (in tiles) of the main canvas. */
export const DEFAULT_HEIGHT = 16;

/** Represents the array of tiles' numeric values, etc. */
export class TileMap {

    /** Contains the numeric values associated with each terrain tile. */
    private _terrain: Array<Array<Array<number | null>>>;

    /** The x-coordinate of the player character's starting position. */
    private _startX: number;

    /** The y-coordinate of the player character's starting position. */
    private _startY: number;

    /** The array of non-terrain things (e.g., enemies or collectibles). */
    private _things: Array<Array<Array<number | null>>>;

    /** 
     * Constructs a TileMap object.
     * @param theOther - Another TileMap object. Note that it is not an instance
     * of TileMap but rather is an instance of Object with the same fields as 
     * TileMap.
     */
    constructor(theOther?: TileMap) {
        if (theOther === undefined) {
            // Make a TileMap one level deep of default height and width.
            this._terrain = new Array(1);
            this._terrain[0] = new Array(DEFAULT_HEIGHT);
            this._things = new Array(1);
            this._things[0] = new Array(DEFAULT_HEIGHT);
            for (let i = 0; i < DEFAULT_HEIGHT; i++) {
                this._terrain[0][i] = new Array(DEFAULT_WIDTH).fill(null);
                this._things[0][i] = new Array(DEFAULT_WIDTH).fill(null);
            }
            this._startX = 0;
            this._startY = 0;
        } else if (theOther.hasOwnProperty("_terrain") &&
            theOther.hasOwnProperty("_startX") &&
            theOther.hasOwnProperty("_startY") &&
            theOther.hasOwnProperty("_things")) {
            // Make a deep copy of the other TileMap.
            this._startX = theOther._startX;
            this._startY = theOther._startY;
            let d = theOther._terrain.length;
            this._terrain = new Array(d);
            this._things = new Array(d);
            let h = theOther._terrain[0].length;
            let w = theOther._terrain[0][0].length;
            for (let i = 0; i < d; i++) {
                this._terrain[i] = new Array(h);
                this._things[i] = new Array(h);
                for (let j = 0; j < h; j++) {
                    this._terrain[i][j] = new Array(w);
                    this._things[i][j] = new Array(w);
                    for (let k = 0; k < w; k++) {
                        this._terrain[i][j][k] = theOther._terrain[i][j][k];
                        this._things[i][j][k] = theOther._things[i][j][k];
                    }
                }
            }
        } else {
            throw new Error("TileMap constructor passed non-TileMap type.");
        }
    }
    
    /**
     * Resizes the TileMap based on provided dimensions.
     * @param theWidth - The number of tiles wide to make the TileMap.
     * @param theHeight - The number of tiles high to make the TileMap.
     * @param theDepth - The number of tiles deep to make the TileMap.
     */
    resize(theWidth: number, theHeight: number, theDepth: number) {
        if (theHeight < 1 || theWidth < 1 || theDepth < 1) {
            throw new Error("TileMap.resize passed non-positive dimensions");
        } else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth) ||
            !Number.isInteger(theDepth)) {
            throw new Error("TileMap.resize passed non-integer dimensions.");
        } else {
            this._terrain.length = theDepth;
            this._things.length = theDepth;
            for (let i = 0; i < theDepth; i++) {
                if (Array.isArray(this._terrain[i]) && Array.isArray(this._things[i])) {
                    // Set width.
                    for (let j = 0; j < this._terrain[i].length; j++) {
                        let oldWidth = this._terrain[i][j].length;
                        this._terrain[i][j].length = theWidth;
                        this._things[i][j].length = theWidth;
                        for (let k = oldWidth; k < theWidth; k++) {
                            this._terrain[i][j][k] = null;
                            this._things[i][j][k] = null;
                        }
                    }
                    // Set height.
                    let oldHeight = this._terrain[i].length;
                    this._terrain[i].length = theHeight;
                    this._things[i].length = theHeight;
                    for (let j = oldHeight; j < theHeight; j++) {
                        this._terrain[i][j] = new Array(theWidth).fill(null);
                        this._things[i][j] = new Array(theWidth).fill(null);
                    }
                // Add new depth level(s).
                } else {
                    this._terrain[i] = new Array(theHeight);
                    this._things[i] = new Array(theHeight);
                    for (let j = 0; j < theHeight; j++) {
                        this._terrain[i][j] = new Array(theWidth).fill(null);
                        this._things[i][j] = new Array(theWidth).fill(null);
                    }
                }
            }
            // Readjust start coordinates.
            if (this._startX >= this._terrain[0][0].length) {
                this._startX = this._terrain[0][0].length - 1;
            }
            if (this._startY >= this._terrain[0].length) {
                this._startY = this._terrain[0].length - 1;
            }
        }
    }
    
    /**
     * Sets an array element at the given position to the given value.
     * @param theValue - What to assign.
     * @param theX - The x-coordinate (i.e., the column).
     * @param theY - The y-coordinate (i.e., the row).
     * @param theZ - The z-coordinate (i.e., the depth or grid level).
     * @param theType - The type of element being added, e.g., "terrain."
     */
    assignValue(theValue: number | null, theX: number, theY: number, 
        theZ: number, theType: string) {
        if (theX < 0 || theX >= this._terrain[0][0].length) {
            console.warn(`TileMap.assignValue passed invalid x value: ${theX}.`);
        } else if (theY < 0 || theY >= this._terrain[0].length) {
            console.warn(`TileMap.assignValue passed invalid y value: ${theY}.`);
        } else if (theZ < 0 || theZ >= this._terrain.length) {
            console.warn(`TileMap.assignValue passed invalid z value: ${theZ}.`);
        } else {
            if (theValue === null) {
                this._terrain[theZ][theY][theX] = null;
                this._things[theZ][theY][theX] = null;
            } else if (theType === TERRAIN_TYPE) {
                this._terrain[theZ][theY][theX] = theValue;
            } else {
                this._things[theZ][theY][theX] = theValue;
            }
        }
    }
    
    /** @return The tilemap */
    get terrain(): Array<Array<Array<number | null>>> {
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
    get things(): Array<Array<Array<number | null>>> {
        return this._things;
    }

    /**
     * Changes the player character's starting coordinates.
     * @param theX - The new x-coordinate of the PC's starting position.
     * @param theY - The new y-coordinate of the PC's starting position.
     */
    assignStart(theX: number, theY: number) {
        if (theX < 0 || theX >= this._terrain[0][0].length) {
            console.warn(`TileMap.assignStart passed invalid x value: ${theX}.`);
        } else if (theY < 0 || theY >= this._terrain[0].length) {
            console.warn(`TileMap.assignStart passed invalid y value: ${theY}.`);
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

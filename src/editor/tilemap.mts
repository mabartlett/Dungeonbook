/**
 * @file Contains the TileMap class for the level editor.
 * @author Marcus Bartlett
 */

/** The name of the terrain type as listed in id.json. */
export const TERRAIN_TYPE = "terrain";

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
     * @param theWidth - The number of tiles wide the TileMap is.
     * @param theHeight - The number of tiles high the TileMap is.
     */
    constructor(theWidth: number, theHeight: number) {
        if (theHeight < 1 || theWidth < 1) {
            throw new Error("TileMap constructor passed non-positive dimensions.");
        } else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth)) {
            throw new Error("TileMap constructor passed non-integer dimensions.");
        } else {
            this._terrain = new Array(1);
            this._terrain[0] = new Array(theHeight);
            this._things = new Array(1);
            this._things[0] = new Array(theHeight);
            for (let i = 0; i < theHeight; i++) {
                this._terrain[0][i] = new Array(theWidth).fill(null);
                this._things[0][i] = new Array(theWidth).fill(null);
            }
            this._startX = 0;
            this._startY = 0;
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
            if (theType === TERRAIN_TYPE) {
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

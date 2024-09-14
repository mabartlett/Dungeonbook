/**
 * @file Contains the TileMap class for the level editor.
 * @author Marcus Bartlett
 */

/** Represents the array of tiles' numeric values. */
export default class TileMap {
    /** Contains the numeric values associated with each tile. */
    private _tiles: Array<Array<number | null>>;

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
            this._tiles = new Array(theHeight);
            for (let i = 0; i < theHeight; i++) {
                this._tiles[i] = new Array(theWidth).fill(null);
            }
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
            this._tiles.length = theHeight;
            for (let i = 0; i < theHeight; i++) {
                if (Array.isArray(this._tiles[i])) {
                    let oldWidth = this._tiles[i].length;
                    this._tiles[i].length = theWidth;
                    for (let j = oldWidth; j < theWidth; j++) {
                        this._tiles[i][j] = null;
                    }
                } else {
                    this._tiles[i] = new Array(theWidth).fill(null);
                }
            }
        }
    }
    
    /**
     * Sets an array element at the given position to the given value.
     * @param {number | null} theValue - What to assign.
     * @param {number} theX - The x-coordinate (i.e., the column).
     * @param {number} theY - The y-coordinate (i.e., the row).
     */
    assignValue(theValue: number | null, theX: number, theY: number) {
        if (theX < 0 || theX >= this._tiles[0].length || theY < 0 ||
                theY >= this._tiles.length) {
            throw new Error("TileMap.assignValue passed x or y out of bounds.");
        } else {
            this._tiles[theY][theX] = theValue;
        }
    }
    
    /** @return {Array<Array<number | null>>} The tilemap */
    get tiles(): Array<Array<number | null>> {
        return this._tiles;
    }
    
    /**
     * Overrides the default behavior of the inherited toString method.
     * @return A string representation of the TileMap.
     */
    toString(): string {
        let s = "[\n";
        for (let i = 0; i < this._tiles.length; i++) {
            s += "    [";
            for (let j = 0; j < this._tiles[i].length; j++) {
                s += String(this._tiles[i][j]);
                if (j != this._tiles[i].length - 1) {
                    s += ", ";
                }
            }
            s += "],\n";
        }
        s += "];";
        return s;
    }
}

export const TERRAIN_TYPE = "terrain";
export class TileMap {
    constructor(theWidth, theHeight) {
        if (theHeight < 1 || theWidth < 1) {
            throw new Error("TileMap constructor passed non-positive dimensions.");
        }
        else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth)) {
            throw new Error("TileMap constructor passed non-integer dimensions.");
        }
        else {
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
    resize(theWidth, theHeight) {
        if (theHeight < 1 || theWidth < 1) {
            throw new Error("TileMap.resize passed non-positive dimensions");
        }
        else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth)) {
            throw new Error("TileMap.resize passed non-integer dimensions.");
        }
        else {
            this._terrain.length = theHeight;
            for (let i = 0; i < theHeight; i++) {
                if (Array.isArray(this._terrain[i])) {
                    let oldWidth = this._terrain[i].length;
                    this._terrain[i].length = theWidth;
                    for (let j = oldWidth; j < theWidth; j++) {
                        this._terrain[i][j] = null;
                    }
                }
                else {
                    this._terrain[i] = new Array(theWidth).fill(null);
                }
            }
        }
    }
    assignValue(theValue, theX, theY, theType) {
        if (theX < 0 || theX >= this._terrain[0].length || theY < 0 ||
            theY >= this._terrain.length) {
            throw new Error("TileMap.assignValue passed x or y out of bounds.");
        }
        else {
            if (theType === TERRAIN_TYPE) {
                this._terrain[theY][theX] = theValue;
            }
            else {
                this._things[theY][theX] = theValue;
            }
        }
    }
    get terrain() {
        return this._terrain;
    }
    get startX() {
        return this._startX;
    }
    get startY() {
        return this._startY;
    }
    get things() {
        return this._things;
    }
    assignStart(theX, theY) {
        if (theX < 0 || theX >= this._terrain[0].length || theY < 0 ||
            theY >= this._terrain.length) {
            throw new Error("TileMap.assignStart passed x or y out of bounds.");
        }
        else {
            this._startX = theX;
            this._startY = theY;
        }
    }
    toString() {
        return JSON.stringify(this);
    }
}

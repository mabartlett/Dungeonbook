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
    resize(theWidth, theHeight, theDepth) {
        if (theHeight < 1 || theWidth < 1 || theDepth < 1) {
            throw new Error("TileMap.resize passed non-positive dimensions");
        }
        else if (!Number.isInteger(theHeight) || !Number.isInteger(theWidth) ||
            !Number.isInteger(theDepth)) {
            throw new Error("TileMap.resize passed non-integer dimensions.");
        }
        else {
            this._terrain.length = theDepth;
            this._things.length = theDepth;
            for (let i = 0; i < theDepth; i++) {
                if (Array.isArray(this._terrain[i]) && Array.isArray(this._things[i])) {
                    for (let j = 0; j < this._terrain[i].length; j++) {
                        let oldWidth = this._terrain[i][j].length;
                        this._terrain[i][j].length = theWidth;
                        this._things[i][j].length = theWidth;
                        for (let k = oldWidth; k < theWidth; k++) {
                            this._terrain[i][j][k] = null;
                            this._things[i][j][k] = null;
                        }
                    }
                    let oldHeight = this._terrain[i].length;
                    this._terrain[i].length = theHeight;
                    this._things[i].length = theHeight;
                    for (let j = oldHeight; j < theHeight; j++) {
                        this._terrain[i][j] = new Array(theWidth).fill(null);
                        this._things[i][j] = new Array(theWidth).fill(null);
                    }
                }
                else {
                    this._terrain[i] = new Array(theHeight);
                    this._things[i] = new Array(theHeight);
                    for (let j = 0; j < theHeight; j++) {
                        this._terrain[i][j] = new Array(theWidth).fill(null);
                        this._things[i][j] = new Array(theWidth).fill(null);
                    }
                }
            }
            if (this._startX >= this._terrain[0][0].length) {
                this._startX = this._terrain[0][0].length - 1;
            }
            if (this._startY >= this._terrain[0].length) {
                this._startY = this._terrain[0].length - 1;
            }
        }
    }
    assignValue(theValue, theX, theY, theZ, theType) {
        if (theX < 0 || theX >= this._terrain[0][0].length) {
            console.warn(`TileMap.assignValue passed invalid x value: ${theX}.`);
        }
        else if (theY < 0 || theY >= this._terrain[0].length) {
            console.warn(`TileMap.assignValue passed invalid y value: ${theY}.`);
        }
        else if (theZ < 0 || theZ >= this._terrain.length) {
            console.warn(`TileMap.assignValue passed invalid z value: ${theZ}.`);
        }
        else {
            if (theType === TERRAIN_TYPE) {
                this._terrain[theZ][theY][theX] = theValue;
            }
            else {
                this._things[theZ][theY][theX] = theValue;
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
        if (theX < 0 || theX >= this._terrain[0][0].length) {
            console.warn(`TileMap.assignStart passed invalid x value: ${theX}.`);
        }
        else if (theY < 0 || theY >= this._terrain[0].length) {
            console.warn(`TileMap.assignStart passed invalid y value: ${theY}.`);
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

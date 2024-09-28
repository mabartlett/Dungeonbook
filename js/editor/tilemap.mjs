export const TERRAIN_TYPE = "terrain";
export const DEFAULT_WIDTH = 16;
export const DEFAULT_HEIGHT = 16;
export class TileMap {
    constructor(theOther) {
        if (theOther === undefined) {
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
        }
        else if (theOther.hasOwnProperty("_terrain") &&
            theOther.hasOwnProperty("_startX") &&
            theOther.hasOwnProperty("_startY") &&
            theOther.hasOwnProperty("_things")) {
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
        }
        else {
            throw new Error("TileMap constructor passed non-TileMap type.");
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

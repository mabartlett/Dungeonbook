/**
 * @file Contains the TextBox class.
 * @author Marcus Bartlett
 */

import { Point } from "./game.mjs";

/** The pixel width of each text character. */
export const CW = 6;

/** The pixel width of each text character. */
export const CH = 8;

/** 
 * A type used as a parameter object when constructing new TextBoxes and for
 * drawing them to the canvas.
 */
export type TextBoxParams = {
    point: Point;
    width: number;
    height: number;
}

/** The Unicode character code of the first provided character in the font. */
const START_CODE = 32;

/** The Unicode character code for the newline character. */
const NEWLINE_CODE = 10;

/** Represents a rectangle onto which text is drawn. */
export class TextBox {
    /** At this time, there is only one font in the game. */
    private static FONT: ImageBitmap[];
    
    /** The pixel width of the textbox. */
    private _width: number;
    
    /** The pixel height of the textbox. */
    private _height: number;
    
    /** The length of the line currently being computed. */
    private _lineLen: number;
    
    /** The total height of the bounding box, the sum of all drawn lines. */
    private _boxHeight: number;

    /** The x-coordinate of the top-left corner. */
    private _x: number;

    /** The y-coordinate of the top-left corner; */
    private _y: number;
    
    /** The actual text that will be drawn. */
    private _string: string;

    /** The canvas representing the visible characters on-screen. */
    private _canvas: HTMLCanvasElement;

    /** The rendering context of the canvas. */
    private _ctx: CanvasRenderingContext2D;

    /** The rendering context onto which the text (itself a canvas) box is drawn. */
    private _screen: CanvasRenderingContext2D;
    
    /**
     * Constructs a TextBox object.
     * @param theParams - The TextBoxParams containing point, width & height.
     * @param theFont - An array of ImageBitmaps, each of which is a character.
     */
    constructor(theParams: TextBoxParams, theFont: ImageBitmap[], 
            theScreen: CanvasRenderingContext2D) {
        if (theParams.width <= 0) {
            throw new RangeError("Width must be positive.");
        } else if (theParams.height <= 0) {
            throw new RangeError("Height must be positive.");
        } else {
            this._width = theParams.width;
            this._height = theParams.height;
            this._x = theParams.point.x;
            this._y = theParams.point.y;
            this._lineLen = 0;
            this._boxHeight = 0;
            this._string = "";
            if (TextBox.FONT === undefined) {
                TextBox.FONT = theFont;
            }
            this._screen = theScreen;
            this._canvas = document.createElement("canvas") as HTMLCanvasElement;
            this._ctx = this._canvas.getContext("2d") as CanvasRenderingContext2D;
        }
    }
    
    /**
     * Writes a new string of text onto the text box.
     * @param theText - The string to be drawn.
     */
    write(theText: string): void {
        this._string = "";
        if (theText !== "") {
            const lines = theText.split("\n");
            for (let i = 0; i < lines.length; i++) {
                if (i > 0) {
                    this._boxHeight += CH;
                    this._string += "\n";
                }
                if (this._boxHeight < this._height) {
                    this.writeLine(lines[i]);
                }
            }
        }
        this.updateCanvas();
        this._screen.drawImage(this._canvas, this._x, this._y);
    }

    /**
     * Writes a line of text to the text box.
     * @param theLine - The line to write to the text box.
     */
    private writeLine(theLine: string): void {
        let words = theLine.split(" ");
        if (words[0].length * CW > this._width) {
            this.wrapWord(words[0]);
        } else {
            this._lineLen = words[0].length * CW;
            this._string += words[0];
        }
        for (let j = 1; j < words.length; j++) {
            let lineLenWordAdded = this._lineLen + (1 + words[j].length) * CW;
            if (lineLenWordAdded <= this._width) {
                this._string += " " + words[j]; 
                this._lineLen = lineLenWordAdded;
            } else if (this._boxHeight + CH < this._height) {
                if (words[j].length * CW < this._width) {                    
                    this._string += "\n" + words[j];
                    this._lineLen = words[j].length * CW;
                    this._boxHeight += CH;
                } else {
                    this._string += " ";
                    this._lineLen += 1;
                    this.wrapWord(words[j]);
                }
            }
        }
    }

    /**
     * Wraps a single word across the text box.
     * @param theWord - The word to wrap.
     */
    private wrapWord(theWord: string): void {
        for (let i = 0; i < theWord.length; i++) {
            if (this._lineLen + CW <= this._width) {
                this._lineLen += CW;
                this._string += theWord.charAt(i);
            } else if (this._boxHeight + CH < this._height) {
                this._lineLen = 0;
                this._boxHeight += CH;
                this._string += "\n" + theWord.charAt(i);
            }
        }
    }

    /** Updates the canvas with the new text. */
    private updateCanvas(): void {
        this._ctx.clearRect(0, 0, this._width, this._height);
        let y = 0;
        let x = -CW;
        for (let i = 0; i < this._string.length; i++) {
            x += CW;
            let chCode = this._string.codePointAt(i);
            if (chCode === NEWLINE_CODE) {
                y += CH;
                x = -CW;
            } else if (chCode !== undefined) {
                chCode -= START_CODE;
                if (chCode >= TextBox.FONT.length || chCode < 0) {
                    chCode = 0;
                }
                let img = TextBox.FONT[chCode];
                this._ctx.drawImage(img, x, y);
            } 
        }
    }

    /** @returns The canvas representing the visible text on screen. */
    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}

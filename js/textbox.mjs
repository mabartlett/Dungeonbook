export const CW = 6;
export const CH = 8;
const START_CODE = 32;
const NEWLINE_CODE = 10;
export class TextBox {
    constructor(theParams, theFont) {
        if (theParams.width <= 0) {
            throw new RangeError("Width must be positive.");
        }
        else if (theParams.height <= 0) {
            throw new RangeError("Height must be positive.");
        }
        else {
            this._width = theParams.width;
            this._height = theParams.height;
            this._lineLen = 0;
            this._boxHeight = 0;
            this._string = "";
            if (TextBox.FONT === undefined) {
                TextBox.FONT = theFont;
            }
            this._canvas = document.createElement("canvas");
            this._ctx = this._canvas.getContext("2d");
        }
    }
    write(theText) {
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
    }
    writeLine(theLine) {
        let words = theLine.split(" ");
        if (words[0].length * CW > this._width) {
            this.wrapWord(words[0]);
        }
        else {
            this._lineLen = words[0].length * CW;
            this._string += words[0];
        }
        for (let j = 1; j < words.length; j++) {
            let lineLenWordAdded = this._lineLen + (1 + words[j].length) * CW;
            if (lineLenWordAdded <= this._width) {
                this._string += " " + words[j];
                this._lineLen = lineLenWordAdded;
            }
            else if (this._boxHeight + CH < this._height) {
                if (words[j].length * CW < this._width) {
                    this._string += "\n" + words[j];
                    this._lineLen = words[j].length * CW;
                    this._boxHeight += CH;
                }
                else {
                    this._string += " ";
                    this._lineLen += 1;
                    this.wrapWord(words[j]);
                }
            }
        }
    }
    wrapWord(theWord) {
        for (let i = 0; i < theWord.length; i++) {
            if (this._lineLen + CW <= this._width) {
                this._lineLen += CW;
                this._string += theWord.charAt(i);
            }
            else if (this._boxHeight + CH < this._height) {
                this._lineLen = 0;
                this._boxHeight += CH;
                this._string += "\n" + theWord.charAt(i);
            }
        }
    }
    updateCanvas() {
        this._ctx.clearRect(0, 0, this._width, this._height);
        let y = 0;
        let x = -CW;
        for (let i = 0; i < this._string.length; i++) {
            x += CW;
            let chCode = this._string.codePointAt(i);
            if (chCode === NEWLINE_CODE) {
                y += CH;
                x = -CW;
            }
            else if (chCode !== undefined) {
                chCode -= START_CODE;
                if (chCode >= TextBox.FONT.length || chCode < 0) {
                    chCode = 0;
                }
                let img = TextBox.FONT[chCode];
                this._ctx.drawImage(img, x, y);
            }
        }
    }
    get canvas() {
        return this._canvas;
    }
}

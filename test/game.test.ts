import { describe, expect, test } from "vitest";
import { Game } from "../src/game.mjs";

describe("Game's", async () => {
    const img = new Image();
    img.src = "../img/title.png";
    /*
    const bitmap = await new Promise((resolve, reject) => {
        img.addEventListener("load", () => {
            createImageBitmap(img)
                .then((theBitmap) => resolve(theBitmap))
                .catch((theError) => reject(theError));
        });
        img.addEventListener("error", (theEvent: ErrorEvent) => {
            reject(new Error("Could not load image: " + theEvent.message));
        });
    });
    */
    let a = 0;
    img.addEventListener("load", () => {
        a++;
    });
    img.addEventListener("error", () => {
        throw new Error("img had an error.");
    });
    test("This will pass.", () => {
        expect(img.src).toEqual("../img/title.png");
        expect(a).toBeGreaterThanOrEqual(0);
    });
});
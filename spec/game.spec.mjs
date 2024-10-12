import { Game } from "../js/game.mjs";

/** The URL to an image of K-Mart employees watching the moon landing. */
const KMART_IMAGE = "https://i.imgur.com/BGmV3ED.jpeg";

describe("This suite tests the Game class, namely", function() {
    const img = new Image();
    img.src = "./title.png";
    const bitmapPromise = new Promise((resolveFunc, rejectFunc) => {
        img.addEventListener("load", () => {
            createImageBitmap(img)
                .then((theBitmap) => resolveFunc(theBitmap))
                .catch((theError) => rejectFunc(theError));
        });
        img.addEventListener("error", () => {
            rejectFunc(new Error("Could not load image!"));
        })
    });
    
    it("Foo", async function() {
        const bitmap = await bitmapPromise;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let game = new Game([bitmap], ctx);
        
    })
});
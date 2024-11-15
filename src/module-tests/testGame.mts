/**
 * @file Contains code that tests the Game class in a way Playwright just can't.
 * @author Marcus Bartlett
 */

import { Game } from "../game.mjs";

/** The path of an example image relative to the web page. */
const IMAGE_SOURCE = "./img/title.png";

/** Test the Game class by first making a mock Game object. */
export async function test() {
    const img = new Image();
    img.src = IMAGE_SOURCE;
    const ibm = await new Promise<ImageBitmap>((resolve, reject) => {
        img.addEventListener("load", (theEvent: Event) => {
            if (theEvent.target instanceof Image) {
                createImageBitmap(theEvent.target)
                    .then((theBitmap) => {resolve(theBitmap)})
                    .catch((theError) => {reject(theError)});
            } else {
                reject(new Error("This literally cannot happen."));
            }
        });
    });
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("Could not create CanvasRenderingContext2D.");
    }
    const mockGame = new Game(ctx);
    if (await mockGame.loadImageBitmap(IMAGE_SOURCE) instanceof ImageBitmap) {
        console.log("loadImapgeBitmap produces ImageBitmap.");
    } else {
        console.error("loadImageBitmap does not produce ImageBitmap.");
    }
    await mockGame.loadImageBitmap("FAKEPATH.png")
        .catch((theError) => {console.log(`Caught ${theError}`)});
    
}
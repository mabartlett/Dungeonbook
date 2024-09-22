/** 
 * @file Contains the main function that drives the level editor.
 * @author Marcus Bartlett
 */

import { App, TH, TW } from "./app.mjs";

/** The path to the tileset image. */
const IMAGE_SOURCE = "./img/sheet_16.png";

/** This is the main function that is immediately called when the page loads. */
function main() {
    // Load tileset image, make tiles, and start application.
    let img = new Image();
    img.src = IMAGE_SOURCE;
    img.addEventListener("load", () => {
        let arr = new Array<Promise<ImageBitmap>>();
        for (let i = 0; i * TH < img.naturalHeight; i++) {
            for (let j = 0; j * TW < img.naturalWidth; j++) {
                arr.push(createImageBitmap(img, j * TW, i * TH, TW, TH));
            }
        }
        Promise.all(arr).then(async (theTileset) => {
            let app = new App(theTileset);
            await app.initializeTileTypes();
            app.start();
        }).catch((theError) => {
            console.log("Failed to load tiles.");
            console.log(theError);
        });
    });   
}

main();
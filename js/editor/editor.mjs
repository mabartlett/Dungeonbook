import { App, TH, TW } from "./app.mjs";
const IMAGE_SOURCE = "./img/sheet_16.png";
function main() {
    let img = new Image();
    img.src = IMAGE_SOURCE;
    img.addEventListener("load", () => {
        let arr = new Array();
        for (let i = 0; i * TH < img.naturalHeight; i++) {
            for (let j = 0; j * TW < img.naturalWidth; j++) {
                arr.push(createImageBitmap(img, j * TW, i * TH, TW, TH));
            }
        }
        Promise.all(arr).then((theTileset) => {
            let app = new App(theTileset);
            app.start();
        }).catch((theError) => {
            console.log("Failed to load tiles.");
            console.log(theError);
        });
    });
}
main();

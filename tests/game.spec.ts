import { test, expect } from '@playwright/test';

test("Please work.", async ({ page }) => {
    await page.goto("");
    let val = await page.evaluate(async () => {
        const img = new Image();
        img.src = "./img/title.png";
        return await new Promise((resolve, reject) => {
            img.addEventListener("load", (theEvent: Event) => {
                if (theEvent.target instanceof Image) {
                    resolve(theEvent.target.naturalHeight);
                } else {
                    reject(new Error("This literally cannot happen."));
                }
            });
        });
    });
    // Import Game at the top and then pass a game object as an argument.
    // Start a real file. You're ready.
    await page.evaluate(async () => {
        
    });
    expect(true).toBeTruthy();
});
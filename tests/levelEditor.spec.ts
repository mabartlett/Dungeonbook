/**
 * @file Tests the end-to-end functionality of the level editor.
 * @author Marcus Bartlett
 */

import { expect, Page, test } from "@playwright/test";
import { TILE_CANVAS_CLASS, DRAW_CLICK, ERASE_CLICK, 
    SCALING, TW, TH } from "../js/editor/app.mjs";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, 
    TileMap } from "../js/editor/tilemap.mjs";
import path from "path";

//#region Constants

/** The CSS selector that must be used to locate the *second* tile. */
const SIDEBAR_LABEL_SELECTOR = "label:nth-child(3) > .tile";

/** The relative path to the  */
const EDITOR_PAGE = "/editor.html";

/** The expected number of tiles on the page. */
const EXPECTED_NUM_TILES = 256;

/** The CSS selector for the main canvas onto which tiles are drawn. */
const CANVAS_SELECTOR = "#MainCanvas";

/** The text of the label for the width input field. */
const WIDTH_LABEL = "Width:";

/** The text of the label for the height input field. */
const HEIGHT_LABEL = "Height:";

/** The text of the label for the total depth input field. */
const TOT_DEPTH_LABEL = "Total Depth:";

/** The text of the label for the current depth inptut field. */
const CURR_DEPTH_LABEL = "Current Depth:";

/** The text of the download control (likely a button). */
const DOWNLOAD_TEXT = "Download";

/** The text of the upload control (likely a button). */
const UPLOAD_TEXT = "Upload";

/** The modifier key held while moving the start position on the canvas. */
const START_MOD = "Control";

/** The name to give the downloaded level. */
const FILE_NAME = "test.json";

//#endregion
//#region Tests

test("side canvases change when hovered over", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    const before = await getCSSAsString(page, SIDEBAR_LABEL_SELECTOR);
    await page.locator(SIDEBAR_LABEL_SELECTOR).hover();
    const after = await getCSSAsString(page, SIDEBAR_LABEL_SELECTOR);
    expect(before).not.toBe(after);
});

test("radio buttons check when labels are clicked", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await page.locator(SIDEBAR_LABEL_SELECTOR).click();
    await expect (page.locator(SIDEBAR_LABEL_SELECTOR)).toBeChecked();
});

test("checked radio buttons look different from others", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    const before = await getCSSAsString(page, SIDEBAR_LABEL_SELECTOR);
    await page.locator(SIDEBAR_LABEL_SELECTOR).check();
    const after = await getCSSAsString(page, SIDEBAR_LABEL_SELECTOR);
    expect(before).not.toBe(after);
});

test("the correct number of tiles loaded", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await expect(page.locator(`.${TILE_CANVAS_CLASS}`))
        .toHaveCount(EXPECTED_NUM_TILES);
});

test("dimension inputs are loaded with default values", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    const width = page.getByLabel(WIDTH_LABEL);
    await expect(width).toHaveValue(String(DEFAULT_WIDTH));
    const height = page.getByLabel(HEIGHT_LABEL);
    await expect(height).toHaveValue(String(DEFAULT_HEIGHT));
    const totDep = page.getByLabel(TOT_DEPTH_LABEL);
    await expect(totDep).toHaveValue(String(1));
    const currDep = page.getByLabel(CURR_DEPTH_LABEL);
    await expect(currDep).toHaveValue(String(1));
});

test("canvas will not shrink below minimum dimensions", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    const before = await page.locator(CANVAS_SELECTOR).boundingBox();
    await page.getByLabel(WIDTH_LABEL).fill(String(0));
    const afterW = await page.locator(CANVAS_SELECTOR).boundingBox();
    expect(before).toEqual(afterW);
    await page.getByLabel(HEIGHT_LABEL).fill(String(0));
    const afterH = await page.locator(CANVAS_SELECTOR).boundingBox();
    expect(before).toEqual(afterH);
});

test("canvas will not grow beyond maximum dimensions", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "max");
    const before = await page.locator(CANVAS_SELECTOR).boundingBox();
    await page.getByLabel(WIDTH_LABEL).fill(String(Number.MAX_SAFE_INTEGER));
    const afterW = await page.locator(CANVAS_SELECTOR).boundingBox();
    expect(before).toEqual(afterW);
    await page.getByLabel(HEIGHT_LABEL).fill(String(Number.MAX_SAFE_INTEGER));
    const afterH = await page.locator(CANVAS_SELECTOR).boundingBox();
    expect(before).toEqual(afterH);
});

test("current depth cannot exceed total depth", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    const currDep = page.getByLabel(CURR_DEPTH_LABEL);
    await currDep.fill(String(1));
    const before = await getCanvasAsString(page);
    const depMax = await page.getByLabel(TOT_DEPTH_LABEL).inputValue();
    const n = parseInt(depMax);
    await currDep.fill(String(n + 1));
    const after = await getCanvasAsString(page);
    expect(before).toBe(after);
});

test("canvas changes size when width input is changed", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    const defaultBB = await page.locator(CANVAS_SELECTOR).boundingBox();
    await page.getByLabel(WIDTH_LABEL).fill(String(DEFAULT_WIDTH + 1));
    const biggerBB = await page.locator(CANVAS_SELECTOR).boundingBox();
    await page.getByLabel(WIDTH_LABEL).fill(String(DEFAULT_WIDTH - 1));
    const smallerBB = await page.locator(CANVAS_SELECTOR).boundingBox();
    if (defaultBB === null || biggerBB === null || smallerBB === null) {
        throw new Error("Canvas bounding box is somehow null.");
    } else {
        expect(biggerBB.width).toBeGreaterThan(defaultBB.width);
        expect(smallerBB.width).toBeLessThan(defaultBB.width);
    }
});

test("canvas changes size when height input is changed", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    const defaultBB = await page.locator(CANVAS_SELECTOR).boundingBox();
    await page.getByLabel(HEIGHT_LABEL).fill(String(DEFAULT_HEIGHT + 1));
    const biggerBB = await page.locator(CANVAS_SELECTOR).boundingBox();
    await page.getByLabel(HEIGHT_LABEL).fill(String(DEFAULT_HEIGHT - 1));
    const smallerBB = await page.locator(CANVAS_SELECTOR).boundingBox();
    if (defaultBB === null || biggerBB === null || smallerBB === null) {
        throw new Error("Canvas bounding box is somehow null.");
    } else {
        expect(biggerBB.height).toBeGreaterThan(defaultBB.width);
        expect(smallerBB.height).toBeLessThan(defaultBB.width);
    }
});

test("canvas isn't cleared when width/height grows", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    await clickCanvas(page, DRAW_CLICK, 1, 1);
    const before = await getCanvasAsString(page);
    await page.getByLabel(WIDTH_LABEL).fill(String(DEFAULT_WIDTH));
    await minMaxCanvas(page, "min");
    const afterW = await getCanvasAsString(page);
    expect(before).toBe(afterW);
    await page.getByLabel(HEIGHT_LABEL).fill(String(DEFAULT_HEIGHT));
    await minMaxCanvas(page, "min");
    const afterH = await getCanvasAsString(page);
    expect(before).toBe(afterH);
});

test("canvas shows new level when current depth changes", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    await clickCanvas(page, DRAW_CLICK, 1, 1);
    const level1 = await getCanvasAsString(page);
    const totDep = await page.getByLabel(TOT_DEPTH_LABEL).inputValue();
    const n = parseInt(totDep);
    await page.getByLabel(TOT_DEPTH_LABEL).fill(String(n + 1));
    await page.getByLabel(CURR_DEPTH_LABEL).fill(String(n + 1));
    const level2 = await getCanvasAsString(page);
    expect(level1).not.toBe(level2);
    await page.getByLabel(CURR_DEPTH_LABEL).fill(String(n));
    const level1After = await getCanvasAsString(page);
    expect(level1After).toBe(level1);
});

test("erasing works", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    const before = await getCanvasAsString(page);
    await clickCanvas(page, DRAW_CLICK, 1, 1);
    await clickCanvas(page, ERASE_CLICK, 1, 1);
    const after = await getCanvasAsString(page);
    expect(before).toBe(after);
});

test("drawing works", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    const before = await getCanvasAsString(page);
    await clickCanvas(page, DRAW_CLICK, 1, 1);
    const after = await getCanvasAsString(page);
    expect(before).not.toBe(after);
});

test("the player start moves", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    const before = await getCanvasAsString(page);
    const x = (TW * SCALING) + 1;
    const y = (TH * SCALING);
    await clickCanvas(page, DRAW_CLICK, x, y, START_MOD);
    const after = await getCanvasAsString(page);
    expect(before).not.toBe(after);
});

test("downloading then uploading the same file works", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    await minMaxCanvas(page, "min");
    await clickCanvas(page, DRAW_CLICK, 1, 1);
    const before = await getCanvasAsString(page);
    const downloadPromise = page.waitForEvent("download");
    await page.getByText(DOWNLOAD_TEXT).click();
    const download = await downloadPromise;
    await download.saveAs(__dirname + path.sep + FILE_NAME);
    await clickCanvas(page, ERASE_CLICK, 1, 1);
    const afterDL = await getCanvasAsString(page);
    expect(before).not.toBe(afterDL);
    await page.getByText(UPLOAD_TEXT).setInputFiles(path.join(__dirname, FILE_NAME));
    const afterUL = await getCanvasAsString(page);
    expect(before).toBe(afterUL);
});

test("uploading an invalid file throws an error", async ({ page }) => {
    await page.goto(EDITOR_PAGE);
    const alertPoppedUp = await new Promise<boolean>(async (resolve) => {
        page.on("dialog", async (theDialog) => {
            await theDialog.accept();
            resolve(true);
        });
        await page.getByText(UPLOAD_TEXT).setInputFiles(__filename);
    });
    expect(alertPoppedUp).toBeTruthy();
});

//#endregion
//#region Helper Functions

/**
 * Gives the JSON.stringify representation of an element's computed CSS.
 * @param thePage - The page on which the element resides.
 * @param theSelector - The CSS selector used to find the element.
 * @returns A string representation of the computed CSS of the chosen element.
 */
async function getCSSAsString(thePage: Page, theSelector: string): Promise<string> {
    return thePage.evaluate((theArg) => {
        const element = document.querySelector(theArg) as HTMLElement;
        return JSON.stringify(getComputedStyle(element));
    }, theSelector);
}

/**
 * Blobs the main canvas and returns that Blob's text() method.
 * @param thePage - The current page context.
 * @returns - The Canvas Blob as a string.
 */
async function getCanvasAsString(thePage: Page): Promise<string> {
    return thePage.evaluate(async (theSelector) => {
        const canvas = document.querySelector(theSelector) as HTMLCanvasElement;
        let prom = new Promise<string>((resolve, reject) => {
            canvas.toBlob(async (theBlob) => {
                if (theBlob === null) {
                    reject(new Error("Could not blob canvas."));
                } else {
                    resolve(await theBlob.text());
                }
            });
        });
        return prom;
    }, CANVAS_SELECTOR);
}

/**
 * Clicks the page's main canvas.
 * @param thePage - The current page context.
 * @param theButton - The mouse button to click with. (Corresponds to 
 * MouseEvent.buttons.)
 * @param theX - The relative position to click's x-coordinate.
 * @param theY - The relative position to click's y-coordinate.
 * @param theMod - The modifier key to hold while clicking.
 */
async function clickCanvas(thePage: Page, theButton: number, theX: number, 
    theY: number, theMod?: "Alt" | "Control" | "Shift"): Promise<void> {
    if (theMod === undefined) {
        if (theButton === 1) {
            await thePage.locator(CANVAS_SELECTOR).click({button: "left", 
                position: {x: theX, y: theY}});
        } else if (theButton === 2) {
            await thePage.locator(CANVAS_SELECTOR).click({button: "right", 
                position: {x: theX, y: theY}});
        } else {
            await thePage.locator(CANVAS_SELECTOR).click({button: "middle", 
                position: {x: theX, y: theY}});
        }
    } else {
        if (theButton === 1) {
            await thePage.locator(CANVAS_SELECTOR).click({button: "left", 
                position: {x: theX, y: theY}, modifiers: [theMod]});
        } else if (theButton === 2) {
            await thePage.locator(CANVAS_SELECTOR).click({button: "right", 
                position: {x: theX, y: theY}, modifiers: [theMod]});
        } else {
            await thePage.locator(CANVAS_SELECTOR).click({button: "middle", 
                position: {x: theX, y: theY}, modifiers: [theMod]});
        }
    }
}

/**
 * Change the size of the canvas by setting the height and width values to their
 * minimums or maximums.
 * @param thePage - The current page context.
 * @param theSize - Either "min" for minimum or "max" for maximum.
 */
async function minMaxCanvas(thePage: Page, theSize: "min" | "max"): Promise<void> {
    const wVal = await thePage.getByLabel(WIDTH_LABEL).getAttribute(theSize);
    const hVal = await thePage.getByLabel(HEIGHT_LABEL).getAttribute(theSize);
    if (wVal === null || hVal === null) {
        throw new Error(`Width or Height inputs have no ${theSize} attribute.`);
    } else {
        await thePage.getByLabel(WIDTH_LABEL).fill(wVal);
        await thePage.getByLabel(HEIGHT_LABEL).fill(hVal);
    }
}

//#endregion
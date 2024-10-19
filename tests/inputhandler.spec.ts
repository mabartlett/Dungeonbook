import { expect, test } from "@playwright/test";
import { InputHandler } from "../src/inputhandler.mjs";

test.describe("InputHandler's", () => {
    const ih = InputHandler.getInstance();

    test("getInstance function returns one and the same instance.", () => {
        expect(ih).toBe(InputHandler.getInstance());
    });

    test("constructor initializes fields properly.", () => {
        ih.keyspressed.forEach((theValue) => {
            expect(theValue).toBeFalsy();
        });
    });
});
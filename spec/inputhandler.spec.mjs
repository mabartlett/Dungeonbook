import { CS_KEYS, ARROW_KEYS, InputHandler } from "../js/InputHandler.mjs";

describe("This suite tests that InputHandler's", function() {
    let ih = InputHandler.getInstance();

    it("getInstance function returns one and the same InputHandler", function() {
        let ih2 = InputHandler.getInstance();
        expect(ih).toEqual(ih2);
    });

    it("constructor initializes the fields properly", function() {
        ih.keyspressed.forEach((theValue) => {
            expect(theValue).toBeFalse();
        });
    });
});
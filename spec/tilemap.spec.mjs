import { TileMap, DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../js/editor/tilemap.mjs";

describe("This suite tests TileMap's constructor, namely", function() {
    let tm = new TileMap();
    let tm2 = new TileMap(tm);

    it("the creation of a TileMap object", function() {
        // toEqual uses deep equality and should be used with objects.
        expect(tm).toEqual(jasmine.any(TileMap));
    });

    it("the default dimensions of the TileMap's terrain array", function() {
        expect(tm.terrain.length).toBe(1);
        expect(tm.terrain[0].length).toBe(DEFAULT_HEIGHT);
        expect(tm.terrain[0][0].length).toBe(DEFAULT_WIDTH);
    });

    it("the default dimensions of the TileMap's things array", function() {
        expect(tm.things.length).toBe(1);
        expect(tm.things[0].length).toBe(DEFAULT_HEIGHT);
        expect(tm.things[0][0].length).toBe(DEFAULT_WIDTH);
    });

    it("that each element in a TileMap's arrays defaults to null", function() {
        for (let i = 0; i < tm.terrain[0].length; i++) {
            for (let j = 0; j < tm.terrain[0][i].length; j++) {
                expect(tm.terrain[0][i][j]).toBe(null);
                expect(tm.things[0][i][j]).toBe(null);
            }
        }
    });

    it("that the startX and startY are both 0", function() {
        expect(tm.startX).toBe(0);
        expect(tm.startY).toBe(0);
    });

    it("that it performs a deep copy of the another TileMap", function() {
        expect(tm2).toEqual(tm);
    });

    it("that it throws an error when not passed another TileMap.", function() {
        // .toThrowError must have a function used in the preceding expect().
        expect(() => new TileMap(null)).toThrowError();
        // Fix how we're using structural typing.
    });
});
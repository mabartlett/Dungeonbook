/**
 * @file Tests the level editor's TileMap class as a unit.
 * @author Marcus Bartlett
 */

import { expect, test } from "@playwright/test";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, TileMap, TERRAIN_TYPE } 
    from "../src/editor/tilemap.mjs";

test.describe("TileMap's", () => {
    const myTM = new TileMap();

    test("constructor initializes fields correctly", () => {
        expect(myTM.terrain.length).toBe(1);
        expect(myTM.terrain[0].length).toBe(DEFAULT_HEIGHT);
        expect(myTM.terrain[0][0].length).toBe(DEFAULT_WIDTH);
        expect(myTM.things.length).toBe(1);
        expect(myTM.things[0].length).toBe(DEFAULT_HEIGHT);
        expect(myTM.things[0][0].length).toBe(DEFAULT_WIDTH);
        expect(myTM.startX).toBe(0);
        expect(myTM.startY).toBe(0);
        for (let i = 0; i < DEFAULT_HEIGHT; i++) {
            for (let j = 0; j < DEFAULT_WIDTH; j++) {
                expect(myTM.terrain[0][i][j]).toBe(null);
                expect(myTM.things[0][i][j]).toBe(null);
            }
        }
    });

    test("resize() throws errors when passed invalid arguments", () => {
        expect(() => {myTM.resize(0, 1, 1)}).toThrow();
        expect(() => {myTM.resize(1, 0, 1)}).toThrow();
        expect(() => {myTM.resize(1, 1, 0)}).toThrow();
        expect(() => {myTM.resize(1.5, 1, 1)}).toThrow();
        expect(() => {myTM.resize(1, 1.5, 1)}).toThrow();
        expect(() => {myTM.resize(1, 1, 1.5)}).toThrow();
    });

    test("resize() resizes arrays, sets values to null, & moves start", () => {
        myTM.resize(1, 1, 1);
        expect(myTM.terrain.length).toBe(1);
        expect(myTM.terrain[0].length).toBe(1);
        expect(myTM.terrain[0][0].length).toBe(1);
        expect(myTM.things.length).toBe(1);
        expect(myTM.things[0].length).toBe(1);
        expect(myTM.things[0][0].length).toBe(1);
        expect(myTM.startX).toBe(0);
        expect(myTM.startY).toBe(0);
        myTM.assignValue(null, 0, 0, 0, "");
        myTM.resize(2, 2, 2);
        const nullArray = [[[null, null], [null, null]], 
            [[null, null], [null, null]]];
        expect(myTM.terrain).toEqual(nullArray);
        expect(myTM.things).toEqual(nullArray);
    });

    test("assignValue() prints six warnings", () => {
        myTM.assignValue(0, -1, 1, 0, TERRAIN_TYPE);
        myTM.assignValue(0, myTM.terrain[0][0].length, 1, 0, TERRAIN_TYPE);
        myTM.assignValue(0, 1, -1, 0, TERRAIN_TYPE);
        myTM.assignValue(0, 1, myTM.terrain[0].length, 0, TERRAIN_TYPE);
        myTM.assignValue(0, 1, 1, -1, TERRAIN_TYPE);
        myTM.assignValue(0, 1, 1, myTM.terrain.length, TERRAIN_TYPE);
    });

    test("assignValue() assigns values correctly", () => {
        myTM.assignValue(0, 0, 0, 0, TERRAIN_TYPE);
        expect(myTM.terrain[0][0][0]).toBe(0);
        myTM.assignValue(null, 0, 0, 0, "");
        expect(myTM.terrain[0][0][0]).toBe(null);
        myTM.assignValue(128, 0, 0, 0, "npc");
        expect(myTM.things[0][0][0]).toBe(128);
    });

    test("constructor correctly copies another TileMap object", () => {
        myTM.assignValue(1, 0, 0, 0, TERRAIN_TYPE);
        const newTM = new TileMap(myTM);
        expect(newTM).toEqual(myTM);
    });

    test("assignStart() prints four warnings", () => {
        myTM.assignStart(-1, 0);
        myTM.assignStart(myTM.terrain[0][0].length, 0);
        myTM.assignStart(0, -1);
        myTM.assignStart(0, myTM.terrain[0].length);
    });

    test("assignStart() assigns a new start value", () => {
        myTM.assignStart(1, 1);
        expect(myTM.startX).toBe(1);
        expect(myTM.startY).toBe(1);
    });

    test("toString() prints a JSON version of the TileMap", () => {
        const jsonDerulo = myTM.toString();
        const jsonDesrouleaux = JSON.stringify(myTM);
        expect(jsonDerulo).toBe(jsonDesrouleaux);
    });

    test("resemblesTileMap() returns true when given correct object", () => {
        const obj = {_terrain: null, _startX: null, _startY: null, _things: null};
        expect(myTM.resemblesTileMap(obj)).toBeTruthy();
    });

    test("resemblesTileMap returns false when given incorrect object", () => {
        const obj = new Object();
        expect(myTM.resemblesTileMap(obj)).toBeFalsy();
    });
});
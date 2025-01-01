/**
 * @file Tests the Observer abstract class.
 * @author Marcus Bartlett
 */

import { expect, test } from "@playwright/test";
import { Observer } from "../src/observer.mjs";

/** An arbitrary signal name to use for testing purposes. */
const SIGNAL_NAME = "foo";

/** This is perfunctory and just for testing. */
class ConcreteObserver extends Observer {
    constructor() {super()}

    get subscribers() {
        return this._subscribers;
    }
}

/** Changes value of _publisher to the last object the signal was received 
 * from. */
class BetterObserver extends ConcreteObserver {
    _publisher: null | Observer;

    constructor() {
        super();
        this._publisher = null;
    }

    protected receiveSignal(theSender: Observer, theSignal: string): void {
        if (theSignal === SIGNAL_NAME) {
            this._publisher = theSender;
        }
    }
}

test("subscribe", () => {
    const co1 = new ConcreteObserver();
    const co2 = new ConcreteObserver();
    co1.subscribe(co2);
    expect(co1.subscribers.has(co2)).toBeTruthy();
});

test("unsubscribe", () => {
    const co1 = new ConcreteObserver();
    const co2 = new ConcreteObserver();
    co1.subscribe(co2);
    expect(co1.subscribers.has(co2)).toBeTruthy();
    co1.unsubscribe(co2);
    expect(co1.subscribers.has(co2)).toBeFalsy();
    co1.unsubscribe(co2);
});

test("subscribe doesn't add duplicates", () => {
    const co1 = new ConcreteObserver();
    const co2 = new ConcreteObserver();
    co1.subscribe(co2);
    co1.subscribe(co2);
    expect(co1.subscribers.size).toEqual(1);
});

test("emitSignal throws error when receiveSignal is not implemented", () => {
    const co1 = new ConcreteObserver();
    const co2 = new ConcreteObserver();
    co1.subscribe(co2);
    expect(() => {co1.emitSignal(SIGNAL_NAME)}).toThrow();
});

test("emitSignal coordinates with receiveSignal", () => {
    const ob1 = new BetterObserver();
    const ob2 = new BetterObserver();
    ob1.subscribe(ob2);
    ob1.emitSignal(SIGNAL_NAME);
    expect(ob2._publisher).toBe(ob1);
});
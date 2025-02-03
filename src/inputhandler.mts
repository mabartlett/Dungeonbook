/**
 * @file Contains the InputHandler class, a singleton which handles all input.
 * @author Marcus Bartlett
 */

import { Observer } from "./observer.mjs";
import { Game, SIGNALS as GAMESIGNALS } from "./game.mjs";

/** 
 * The codes corresponding to the context sensitive buttons.
 * The order is critical!
 * */
export const CS_KEYS = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD"];

/** The codes corresponding to the arrow keys. */
export const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

/** Handles input. This is a singleton and is accessed by many objects. */
export class InputHandler extends Observer {
    /** The single instance of the InputHandler class. */
    private static _instance: InputHandler;

    /** Maps keys to whether they are currently pressed. */
    private _keyspressed: Map<string, boolean>;

    /** The context hints appearing in the button panels. */
    private _butt_hints: Array<string>;

    /** Constructs and InputHandler. */
    private constructor() {
        super();
        this._keyspressed = new Map<string, boolean>();
        for (const el of CS_KEYS.concat(ARROW_KEYS)) {
            this._keyspressed.set(el, false);
        }
        this._butt_hints = new Array<string>(CS_KEYS.length).fill("");
    }

    /** @override */
    protected receiveSignal(theSender: Observer, theSignal: string | number): void {
        if (theSender instanceof Game) {
            if (theSignal === GAMESIGNALS.GAME_START) {
                this._butt_hints[0] = "New Game";
                this._butt_hints[2] = "Load Game";
            } else if (theSignal === GAMESIGNALS.NEW_GAME) {
                this._butt_hints.fill("");
            }
        }
    }

    /** Creates the singleton if there isn't one then returns it either way. */
    static getInstance(): InputHandler {
        if (InputHandler._instance === undefined) {
            InputHandler._instance = new InputHandler();
        }
        return InputHandler._instance; 
    }

    /** @return The keys map. */
    get keyspressed(): Map<string, boolean> {
        return this._keyspressed;
    }

    /** @return The context hints. */
    get contexts(): Array<string> {
        return this._butt_hints;
    }

    /**
     * Adds keydown and keyup event listeners to the window. These listeners set
     * the corresponding key code's value in the keyspressed map to true or 
     * false.
     */
    addListeners(): void {
        window.addEventListener("keydown", (theEvent) => {
            let keycode = (theEvent as KeyboardEvent).code;
            if (CS_KEYS.includes(keycode) || ARROW_KEYS.includes(keycode)) {
                if (this._keyspressed.get(keycode) === false) {
                    this._keyspressed.set(keycode, true);
                    this.emitSignal(keycode);
                }
            }
        });
        window.addEventListener("keyup", (theEvent) => {
            let keycode = (theEvent as KeyboardEvent).code;
            if (CS_KEYS.includes(keycode) || ARROW_KEYS.includes(keycode)) {
                this._keyspressed.set(keycode, false);
            }
        });
    }

    /**
     * Tests whether a signal is a keydown event.
     * @param theSignal The signal to test.
     * @returns Whether the signal is a keydown event.
     */
    signal_is_keydown(theSignal: number | string): boolean {
        return typeof theSignal === "string" && (ARROW_KEYS.indexOf(theSignal) > 
            -1 || CS_KEYS.indexOf(theSignal) > -1);
    }
}
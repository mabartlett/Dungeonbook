/**
 * @file Contains the InputHandler class, a singleton which handles all input.
 * @author Marcus Bartlett
 */

/** The codes corresponding to the context sensitive buttons. */
const CS_KEYS = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD"];

/** The codes corresponding to the arrow keys. */
const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

/** Handles input. This is a singleton and is accessed by many objects. */
export class InputHandler {
    /** The single instance of the InputHandler class. */
    private static _instance: InputHandler;

    /** Maps keys to whether they are currently pressed. */
    private _keyspressed: Map<string, boolean>;

    /** Constructs and InputHandler. */
    private constructor() {
        this._keyspressed = new Map<string, boolean>();
        for (const el of CS_KEYS.concat(ARROW_KEYS)) {
            this._keyspressed.set(el, false);
        }
    }

    /** Creates the singleton if there isn't one then returns it either way. */
    static getInstance() {
        if (InputHandler._instance === undefined) {
            InputHandler._instance = new InputHandler();
        }
        return InputHandler._instance; 
    }

    /** @return The keys map. */
    get keyspressed(): Map<string, boolean> {
        return this._keyspressed;
    }
}
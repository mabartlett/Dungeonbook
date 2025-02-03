import { Observer } from "./observer.mjs";
import { Game, SIGNALS as GAMESIGNALS } from "./game.mjs";
export const CS_KEYS = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD"];
export const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export class InputHandler extends Observer {
    constructor() {
        super();
        this._keyspressed = new Map();
        for (const el of CS_KEYS.concat(ARROW_KEYS)) {
            this._keyspressed.set(el, false);
        }
        this._butt_hints = new Array(CS_KEYS.length).fill("");
    }
    receiveSignal(theSender, theSignal) {
        if (theSender instanceof Game) {
            if (theSignal === GAMESIGNALS.GAME_START) {
                this._butt_hints[0] = "New Game";
                this._butt_hints[2] = "Load Game";
            }
            else if (theSignal === GAMESIGNALS.NEW_GAME) {
                this._butt_hints.fill("");
            }
        }
    }
    static getInstance() {
        if (InputHandler._instance === undefined) {
            InputHandler._instance = new InputHandler();
        }
        return InputHandler._instance;
    }
    get keyspressed() {
        return this._keyspressed;
    }
    get contexts() {
        return this._butt_hints;
    }
    addListeners() {
        window.addEventListener("keydown", (theEvent) => {
            let keycode = theEvent.code;
            if (CS_KEYS.includes(keycode) || ARROW_KEYS.includes(keycode)) {
                if (this._keyspressed.get(keycode) === false) {
                    this._keyspressed.set(keycode, true);
                    this.emitSignal(keycode);
                }
            }
        });
        window.addEventListener("keyup", (theEvent) => {
            let keycode = theEvent.code;
            if (CS_KEYS.includes(keycode) || ARROW_KEYS.includes(keycode)) {
                this._keyspressed.set(keycode, false);
            }
        });
    }
    signal_is_keydown(theSignal) {
        return typeof theSignal === "string" && (ARROW_KEYS.indexOf(theSignal) >
            -1 || CS_KEYS.indexOf(theSignal) > -1);
    }
}

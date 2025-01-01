import { Observer } from "./observer.mjs";
import { Game, SIGNALS as GAMESIGNALS } from "./game.mjs";
const CS_KEYS = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD"];
export const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export class InputHandler extends Observer {
    constructor() {
        super();
        this._keyspressed = new Map();
        for (const el of CS_KEYS.concat(ARROW_KEYS)) {
            this._keyspressed.set(el, false);
        }
    }
    receiveSignal(theSender, theSignal) {
        if (theSender instanceof Game) {
            if (theSignal === GAMESIGNALS.GAME_START) {
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
    bindStartKeys(theGame) {
        console.log("Beep.");
    }
}

export const CS_KEYS = ["KeyQ", "KeyW", "KeyE", "KeyA", "KeyS", "KeyD"];
export const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
export class InputHandler {
    constructor() {
        this._keyspressed = new Map();
        for (const el of CS_KEYS.concat(ARROW_KEYS)) {
            this._keyspressed.set(el, false);
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
}

export class Observer {
    constructor() {
        this._subscribers = new Set();
    }
    receiveSignal(theSender, theSignal) {
        throw new Error(`receiveSignal not overridden in ${this}.`);
    }
    subscribe(theSubscriber) {
        if (!this._subscribers.has(theSubscriber)) {
            this._subscribers.add(theSubscriber);
        }
    }
    unsubscribe(theSubscriber) {
        if (this._subscribers.has(theSubscriber)) {
            this._subscribers.delete(theSubscriber);
        }
    }
    emitSignal(theSignal) {
        this._subscribers.forEach((theSub) => {
            theSub.receiveSignal(this, theSignal);
        });
    }
}

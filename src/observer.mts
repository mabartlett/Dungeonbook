/** 
 * @file Contains the Observer abstract class.
 * @author Marcus Bartlett
 */

/** 
 * Represents both the "subscriber" and the "publisher" of the "Observer"
 * design pattern. The motivation behind combining them here is twofold: 1) Any
 * subscriber in the game also ends up being a publisher at some point and vice-
 * versa. 2) Multiple inheritance is not allowed in TypeScript. I could write 
 * them as separate interfaces but I do not want to have to rewrite these 
 * methods.
 */
export abstract class Observer {

    /** The list of subscribers, i.e., the objects to send emit signals to. */
    protected _subscribers: Set<Observer>;

    /** Initializes fields. */
    constructor() {
        this._subscribers = new Set<Observer>();
    }
    
    /**
     * Handles signals as they're received by invoking the appropriate function
     * in the signals map with the signalling object as that function's 
     * argument.
     * @param theSender - The object (the "publisher") sending the signal.
     * @param theSignal - The name of the signal being received.
     */
    protected receiveSignal(theSender: Observer, theSignal: string | number) {
        throw new Error(`receiveSignal not overridden in ${this}.`);
    }

    /**
     * Adds a subscriber to the list.
     * @param theSubscriber - The subscriber to add.
     */
    public subscribe(theSubscriber: Observer) {
        if (!this._subscribers.has(theSubscriber)) {
            this._subscribers.add(theSubscriber);
        }
    }

    /**
     * Removes a subscriber from the list.
     * @param theSubscriber - The subscriber to remove.
     */
    public unsubscribe(theSubscriber: Observer) {
        if (this._subscribers.has(theSubscriber)) {
            this._subscribers.delete(theSubscriber);
        }
    }

    /**
     * Publishes a signal to all subscribers.
     * @param theSignal - The signal to emit.
     */
    protected emitSignal(theSignal: string | number) {
        this._subscribers.forEach((theSub) => {
            theSub.receiveSignal(this, theSignal);
        });
    }
}
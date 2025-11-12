/**
 * OutputMessage – message sent from the system to the UI.
 *
 * @class OutputMessage
 * @extends UIMessage
 */
export default class OutputMessage extends UIMessage {
    static PRIORITY: {
        LOW: number;
        NORMAL: number;
        HIGH: number;
        CRITICAL: number;
    };
    /**
     * Creates an OutputMessage from plain input.
     *
     * @param {Object} input - Message data.
     * @returns {OutputMessage}
     */
    static from(input: any): OutputMessage;
    /** @type {string[]} */
    body: string[];
    /** @type {Object} */
    meta: any;
    /** @type {Error|null} */
    error: Error | null;
    /** @type {number} */
    priority: number;
    /** @param {string[]|string} value */
    set content(value: string[] | string);
    /** @returns {string[]} */
    get content(): string[];
    /** @returns {number} */
    get size(): number;
    /** @returns {boolean} */
    get isError(): boolean;
    /** @returns {boolean} */
    get isInfo(): boolean;
    /**
     * Combines multiple messages into a new one.
     *
     * @param {...OutputMessage} messages - Messages to combine.
     * @returns {OutputMessage}
     */
    combine(...messages: OutputMessage[]): OutputMessage;
    /**
     * Serialises the message to a plain JSON object.
     *
     * @returns {Object}
     */
    toJSON(): any;
}
import UIMessage from "./Message.js";

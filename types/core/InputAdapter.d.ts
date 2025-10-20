/**
 * Abstract input adapter for UI implementations.
 *
 * @class InputAdapter
 * @extends Event
 */
export default class InputAdapter extends Event {
    static CancelError: typeof CancelError;
    /**
     * Starts listening for input and emits an `input` event.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Stops listening for input. Default implementation does nothing.
     *
     * @returns {void}
     */
    stop(): void;
    /**
     * Checks whether the adapter is ready to receive input.
     *
     * @returns {boolean} Always true in base class.
     */
    isReady(): boolean;
    /**
     * Helper to ask a question.
     * @param {string} question - Question to ask.
     * @returns {Promise<string>}
     */
    ask(question: string): Promise<string>;
    /**
     * Generic selection prompt.
     * @param {Object} config - Selection configuration.
     * @returns {Promise<{ index: number, value: string | null }>}
     */
    select(config: any): Promise<{
        index: number;
        value: string | null;
    }>;
}
import Event from "@nan0web/event/oop";
import CancelError from "./Error/CancelError.js";

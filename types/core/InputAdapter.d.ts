export default InputAdapter;
/**
 * Abstract input adapter for UI implementations.
 *
 * @class InputAdapter
 * @extends Event
 */
declare class InputAdapter extends Event {
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
}
import Event from "@nan0web/event/oop";

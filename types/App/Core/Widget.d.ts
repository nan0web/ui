export default Widget;
export type ComponentFn = import("./UI.js").ComponentFn;
/** @typedef {import("./UI.js").ComponentFn} ComponentFn */
/**
 * Abstract Widget class.
 * Widget is a view with ability to input data in a specific format.
 * Input and output data are typed classes.
 */
declare class Widget extends EventProcessor {
    /**
     * Creates a new Widget instance.
     * @param {View} [view] - View instance (default: new View())
     */
    constructor(view?: View | undefined);
    /** @type {View} The view associated with this widget */
    view: View;
    /**
     * Ask user for input data of specific class.
     * @param {InputMessage} input - instance of InputMessage or similar
     * @returns {Promise<InputMessage | null>} instance of InputMessage or null
     */
    ask(input: InputMessage): Promise<InputMessage | null>;
    /**
     * @param {AsyncGenerator<StreamEntry>} stream
     * @returns {Promise<void>}
     */
    read(stream: AsyncGenerator<StreamEntry>): Promise<void>;
    /**
     * Render output data using a view function.
     * @param {Function|string} viewFnOrName - View function or registered view name
     * @param {object} outputData - Typed output data instance
     * @returns {any} Rendered output
     * @throws {Error} If view component is not found when using string name
     */
    render(viewFnOrName: Function | string, outputData: object): any;
}
import EventProcessor from "@nan0web/event/oop";
import View from "../../View/View.js";
import InputMessage from "../../core/Message/InputMessage.js";
import { StreamEntry } from "@nan0web/db";

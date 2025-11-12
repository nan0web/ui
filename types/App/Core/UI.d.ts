export default UI;
export type ComponentFn = import("../../View/View.js").ComponentFn;
/** @typedef {import("../../View/View.js").ComponentFn} ComponentFn */
/**
 * Abstract UI class to connect apps and widgets.
 * Supports input/output data typed classes and views.
 */
declare class UI extends Widget {
    /**
     * Creates a new UI instance.
     * @param {CoreApp} app - The app to connect to this UI
     * @param {View} [view] - View instance for rendering (default: new View())
     */
    constructor(app: CoreApp, view?: View);
    /** @type {CoreApp} The app instance connected to this UI */
    app: CoreApp;
    /**
     * Convert raw input to CommandMessage array.
     * Must be implemented by subclasses.
     * @param {any} rawInput - Raw input to convert
     * @returns {CommandMessage[]} Array of command messages
     * @throws {Error} Always thrown as this method must be implemented by subclasses
     */
    convertInput(rawInput: any): CommandMessage[];
    /**
     * Process input, run commands on app, and output results.
     * Supports progress callback.
     * @emits {start} Emitted when processing begins
     * @emits {data} Emitted for each command being processed
     * @emits {end} Emitted when all commands have been processed
     * @param {any} rawInput - Raw input to process
     * @returns {Promise<any[]>} Results of command processing
     */
    process(rawInput: any): Promise<any[]>;
    /**
     * Sets up event handlers for UI process events.
     * @param {ComponentFn} UIProcess - Process view component
     */
    show(UIProcess: ComponentFn): void;
    /**
     * Output results to the interface.
     * @param {any[]} results - Results to output
     */
    output(results: any[]): void;
}
import Widget from "./Widget.js";
import CoreApp from "./CoreApp.js";
import { CommandMessage } from "../Command/index.js";
import View from "../../View/View.js";

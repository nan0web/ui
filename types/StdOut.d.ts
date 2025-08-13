export default StdOut;
/**
 * Handles standard output stream with formatting capabilities.
 */
declare class StdOut extends NanoEvent {
    /** @type {string} End of line character */
    static EOL: string;
    /** @type {string} Beginning of line character */
    static BOL: string;
    /** @type {object} Color escape codes */
    static COLORS: object;
    /** @type {object} Style escape codes */
    static STYLES: object;
    /** @type {string} Reset formatting escape code */
    static RESET: string;
    /** @type {string} Clear screen escape code */
    static CLEAR: string;
    /**
     * Creates a new StdOut instance.
     * @param {object} props - StdOut properties
     * @param {any} [props.processor] - Output processor
     * @param {string[]} [props.stream=[]] - Initial output stream
     * @param {number[]} [props.windowSize=[144, 33]] - Window size [width, height]
     */
    constructor(props?: {
        processor?: any;
        stream?: string[] | undefined;
        windowSize?: number[] | undefined;
    });
    /**
     * @todo define go top by rows constants.
     */
    /** @type {string[]} Output stream buffer */
    stream: string[];
    /** @type {number[]} Window size [width, height] */
    windowSize: number[];
    /** @type {any} Output processor */
    processor: any;
    /**
     * Writes output to the output stream.
     * Must be overwritten by other apps.
     * @param {any} output - Output to write
     * @param {Function} onError - Error handler callback
     */
    write(output: any, onError?: Function): void;
    /**
     * Gets the window size.
     * @returns {number[]} Window size [width, height]
     */
    getWindowSize(): number[];
}
import NanoEvent from "@yaro.page/nano-events";

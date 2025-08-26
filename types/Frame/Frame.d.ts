export class FrameRenderMethod {
    static APPEND: string;
    static REPLACE: string;
    static VISIBLE: string;
}
export default Frame;
/**
 * @link https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797 - ANSI escape codes
 */
declare class Frame {
    /** @type {typeof FrameRenderMethod} */
    static RenderMethod: typeof FrameRenderMethod;
    static Props: typeof FrameProps;
    /** @type {string} End of line */
    static EOL: string;
    /** @type {string} Beginning of line */
    static BOL: string;
    /** @type {string} Beginning of frame */
    static BOF: string;
    /** @type {string} Hide cursor */
    static HIDE_CURSOR: string;
    /** @type {string} Show cursor */
    static SHOW_CURSOR: string;
    /** @type {string} Tab */
    static TAB: string;
    static BOLD: string;
    static ITALIC: string;
    static UNDERLINE: string;
    static STRIKETHROUGH: string;
    static RESET: string;
    static is(value: any): boolean;
    static from(input: any): Frame;
    static spaces(options?: {}): (row: any) => any;
    static weight(arr: any): (Fn?: (v: any) => any) => any[];
    /**
     *
     * @param {object} options
     * @param {function} [options.fn=(fn = v => v)] - Function to calculate weight.
     * @param {string[]} [options.cols=[]] - Widths of the columns.
     * @param {number} [options.padding=1] - The padding between columns.
     * @param {string[]} [options.aligns=[]] - The column aligns: l, r
     * @returns {(arr: []) => string[][]}
     */
    static table(options?: {
        fn?: Function | undefined;
        cols?: string[] | undefined;
        padding?: number | undefined;
        aligns?: string[] | undefined;
    }): (arr: []) => string[][];
    static cursorUp(lines?: number): string;
    static cursorDown(lines?: number): string;
    static clearLine(str?: string): string;
    static clearScreen(): string;
    /**
     * @param {object} [input]
     * @param {string[]|string[][]} [input.value]
     * @param {number} [input.width]
     * @param {number} [input.height]
     * @param {string} [input.imprint]
     * @param {string} [input.renderMethod]
     * @param {FrameProps} [input.defaultProps]
     */
    constructor(input?: {
        value?: string[] | string[][] | undefined;
        width?: number | undefined;
        height?: number | undefined;
        imprint?: string | undefined;
        renderMethod?: string | undefined;
        defaultProps?: FrameProps | undefined;
    } | undefined);
    /**
     * @example
     * ```js
     * new Frame([
     * 	["Hello", "World"],
     * 	[["Hello", { color: "red", bgColor: "#009" }], "World"],
     * 	["<b i fg=#900>Hello</b>", "<i>World</i>"],
     * ])
     * ```
     * @type {string[][]|any[][]}
     */
    value: string[][] | any[][];
    /** @type {FrameProps} */
    defaultProps: FrameProps;
    /** @type {string} */
    imprint: string;
    /** @type {number} */
    width: number;
    /** @type {number} */
    height: number;
    /** @type {string} */
    renderMethod: string;
    get empty(): boolean;
    lengthOf(str: any): number;
    render(options?: {}): string;
    toString(): string;
    transform(fn: any): Frame;
    setWindowSize(width: any, height: any): void;
    #private;
}
import FrameProps from "./Props.js";

export default View;
declare class View {
    /** @type {typeof RenderOptions} */
    static RenderOptions: typeof RenderOptions;
    /** @type {typeof FrameRenderMethod} */
    static RenderMethod: typeof FrameRenderMethod;
    /**
     * @param {Frame} frame
     * @param {RenderOptions} [options]
     * @returns {Frame}
     */
    static fixFrame(frame: Frame, options?: RenderOptions | undefined): Frame;
    /**
     * @param {object} [input]
     * @param {StdIn} [input.stdin]
     * @param {StdOut} [input.stdout]
     * @param {number} [input.startedAt]
     * @param {Frame} [input.frame]
     * @param {Locale} [input.locale]
     * @param {Map} [input.vocab]
     * @param {number[]} [input.windowSize]
     * @param {Map} [input.components]
     * @param {string} [input.renderMethod]
     */
    constructor(input?: {
        stdin?: StdIn | undefined;
        stdout?: StdOut | undefined;
        startedAt?: number | undefined;
        frame?: Frame | undefined;
        locale?: Locale | undefined;
        vocab?: Map<any, any> | undefined;
        windowSize?: number[] | undefined;
        components?: Map<any, any> | undefined;
        renderMethod?: string | undefined;
    } | undefined);
    /** @type {StdIn} */
    stdin: StdIn;
    /** @type {StdOut} */
    stdout: StdOut;
    /** @type {number} */
    startedAt: number;
    /** @type {Frame} */
    frame: Frame;
    /** @type {Locale} */
    locale: Locale;
    /** @type {Map} */
    vocab: Map<any, any>;
    /** @type {number[]} */
    windowSize: number[];
    /** @type {Map} */
    components: Map<any, any>;
    /** @type {string} */
    renderMethod: string;
    get empty(): boolean;
    get RenderMethod(): typeof FrameRenderMethod;
    get RenderOptions(): typeof RenderOptions;
    getWindowSize(): number[];
    setWindowSize(width: any, height: any): void;
    startTimer(): void;
    spent(checkpoint?: number): number;
    /**
     * @param {boolean|number|function} [shouldRender=0]
     * @param {RenderOptions} [options]
     * @returns {(value: Frame|string|string[], ...args: any) => Frame}
     */
    render(shouldRender?: number | boolean | Function | undefined, options?: RenderOptions | undefined): (value: Frame | string | string[], ...args: any) => Frame;
    clear(shouldRender?: number): Frame;
    progress(shouldRender?: boolean): (value: any) => Frame;
    t(value: any): any;
    debug(...args: any[]): Frame;
    info(...args: any[]): Frame;
    warn(...args: any[]): Frame;
    error(...args: any[]): Frame;
    /**
     * @param {string} name
     * @param {Function} component
     */
    register(name: string, component: Function): void;
    /**
     * @param {string} name
     */
    unregister(name: string): void;
    /**
     * @param {string} name
     * @returns {boolean}
     */
    has(name: string): boolean;
    /**
     * @param {string} name
     * @returns {Function}
     */
    get(name: string): Function;
    /**
     * @param {InputMessage} input
     * @returns {Promise<InputMessage | null>}
     */
    ask(input: InputMessage): Promise<InputMessage | null>;
}
import StdIn from "../StdIn.js";
import StdOut from "../StdOut.js";
import Frame from "../Frame/Frame.js";
import Locale from "../Locale.js";
import { FrameRenderMethod } from "../Frame/Frame.js";
import RenderOptions from "./RenderOptions.js";
import InputMessage from "../InputMessage.js";

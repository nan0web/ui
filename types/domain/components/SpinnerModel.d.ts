/**
 * @typedef {'sm'|'md'|'lg'} SpinnerSize
 * @typedef {Object} SpinnerData
 * @property {SpinnerSize} [size]
 * @property {string} [color]
 */
/**
 * Model-as-Schema for Spinner component.
 * Represents a loading or progress state without user interaction.
 */
export class SpinnerModel {
    static size: {
        help: string;
        default: string;
        options: string[];
    };
    static color: {
        help: string;
        type: string;
        default: string;
    };
    /**
     * @param {SpinnerData} [data]
     */
    constructor(data?: SpinnerData);
    /** @type {SpinnerSize|undefined} */ size: SpinnerSize | undefined;
    /** @type {string|undefined} */ color: string | undefined;
    run(): AsyncGenerator<{
        type: string;
        message: string;
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            completed: boolean;
        };
    }, unknown>;
}
export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerData = {
    size?: SpinnerSize | undefined;
    color?: string | undefined;
};

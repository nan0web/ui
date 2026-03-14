/**
 * @typedef {'primary'|'secondary'|'info'|'ok'|'warn'|'err'|'ghost'} ButtonVariant
 * @typedef {'sm'|'md'|'lg'} ButtonSize
 * @typedef {Object} ButtonData
 * @property {string} [content]
 * @property {ButtonVariant} [variant]
 * @property {ButtonSize} [size]
 * @property {boolean} [outline]
 * @property {boolean} [disabled]
 * @property {boolean} [loading]
 */
/**
 * Model-as-Schema for Button component.
 * Represents the intention and state of a Button interaction.
 * Used exclusively for schema definition and editor validation.
 */
export class ButtonModel {
    static content: {
        help: string;
        default: string;
        type: string;
    };
    static variant: {
        help: string;
        default: string;
        options: string[];
    };
    static size: {
        help: string;
        default: string;
        options: string[];
    };
    static outline: {
        help: string;
        default: boolean;
        type: string;
    };
    static disabled: {
        help: string;
        default: boolean;
        type: string;
    };
    static loading: {
        help: string;
        default: boolean;
        type: string;
    };
    /**
     * @param {ButtonData} [data]
     */
    constructor(data?: ButtonData);
    /** @type {string|undefined} */ content: string | undefined;
    /** @type {ButtonVariant|undefined} */ variant: ButtonVariant | undefined;
    /** @type {ButtonSize|undefined} */ size: ButtonSize | undefined;
    /** @type {boolean|undefined} */ outline: boolean | undefined;
    /** @type {boolean|undefined} */ disabled: boolean | undefined;
    /** @type {boolean|undefined} */ loading: boolean | undefined;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
        };
        component: string;
        model: any;
    }, {
        type: string;
        data: any;
    }, unknown>;
}
export type ButtonVariant = "primary" | "secondary" | "info" | "ok" | "warn" | "err" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonData = {
    content?: string | undefined;
    variant?: ButtonVariant | undefined;
    size?: ButtonSize | undefined;
    outline?: boolean | undefined;
    disabled?: boolean | undefined;
    loading?: boolean | undefined;
};

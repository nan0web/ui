/**
 * @typedef {'success'|'error'|'info'|'warning'} ToastVariant
 * @typedef {Object} ToastData
 * @property {string} [message]
 * @property {ToastVariant} [variant]
 * @property {number} [duration]
 * @property {boolean} [open]
 */
/**
 * Model-as-Schema for Toast notification component.
 * Represents a transient message displayed to the user.
 */
export class ToastModel extends Model {
    static message: {
        help: string;
        default: string;
        type: string;
    };
    static variant: {
        help: string;
        default: string;
        options: string[];
    };
    static duration: {
        help: string;
        default: number;
        type: string;
    };
    static open: {
        help: string;
        default: boolean;
        type: string;
    };
    /**
     * @param {ToastData | any} [data]
     */
    constructor(data?: ToastData | any);
    /** @type {string|undefined} */ message: string | undefined;
    /** @type {ToastVariant|undefined} */ variant: ToastVariant | undefined;
    /** @type {number|undefined} */ duration: number | undefined;
    /** @type {boolean|undefined} */ open: boolean | undefined;
    run(): AsyncGenerator<{
        type: string;
        level: string;
        message: string | undefined;
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            closed: boolean;
        };
    }, unknown>;
}
export type ToastVariant = "success" | "error" | "info" | "warning";
export type ToastData = {
    message?: string | undefined;
    variant?: ToastVariant | undefined;
    duration?: number | undefined;
    open?: boolean | undefined;
};
import { Model } from '@nan0web/core';

/**
 * @typedef {Object} ConfirmData
 * @property {string} [message]
 * @property {string} [confirmText]
 * @property {string} [cancelText]
 */
/**
 * Model-as-Schema for Confirm component.
 */
export class ConfirmModel extends Model {
    static message: {
        help: string;
        default: string;
        type: string;
    };
    static confirmText: {
        help: string;
        default: string;
        type: string;
    };
    static cancelText: {
        help: string;
        default: string;
        type: string;
    };
    /**
     * @param {ConfirmData | any} [data]
     */
    constructor(data?: ConfirmData | any);
    /** @type {string|undefined} */ message: string | undefined;
    /** @type {string|undefined} */ confirmText: string | undefined;
    /** @type {string|undefined} */ cancelText: string | undefined;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string | undefined;
            type: string;
        };
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            confirmed: boolean;
        };
    }, unknown>;
}
export type ConfirmData = {
    message?: string | undefined;
    confirmText?: string | undefined;
    cancelText?: string | undefined;
};
import { Model } from '@nan0web/core';

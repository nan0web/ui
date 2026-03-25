/**
 * Navigation Model — OLMUI Model-as-Schema
 * Generic recursive navigation structure for all UI platforms (CLI, Web, Mobile).
 */
export default class Navigation extends Model {
    static $id: string;
    static title: {
        help: string;
        placeholder: string;
        default: string;
        required: boolean;
    };
    static href: {
        help: string;
        placeholder: string;
        default: string;
    };
    static icon: {
        help: string;
        placeholder: string;
        default: string;
    };
    static image: {
        help: string;
        placeholder: string;
        default: string;
    };
    static children: {
        help: string;
        type: string;
        hint: typeof Navigation;
        default: never[];
    };
    static hidden: {
        help: string;
        type: string;
        default: boolean;
    };
    /**
     * @param {Partial<Navigation>} data
     */
    constructor(data?: Partial<Navigation>);
    /** @type {string|undefined} */ title: string | undefined;
    /** @type {string|undefined} */ href: string | undefined;
    /** @type {string|undefined} */ icon: string | undefined;
    /** @type {string|undefined} */ image: string | undefined;
    /** @type {Navigation[]|undefined} */ children: Navigation[] | undefined;
    /** @type {boolean|undefined} */ hidden: boolean | undefined;
}
import { Model } from '@nan0web/core';

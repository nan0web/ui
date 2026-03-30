/**
 * HeaderModel — OLMUI Model-as-Schema
 * Universal header structure: logo, navigation, language switcher, actions.
 */
export default class HeaderModel extends Model {
    static $id: string;
    static title: {
        help: string;
        placeholder: string;
        default: string;
    };
    static logo: {
        help: string;
        placeholder: string;
        default: string;
    };
    static actions: {
        help: string;
        type: string;
        hint: typeof Navigation;
        default: never[];
    };
    static lang: {
        help: string;
        type: string;
        default: null;
    };
    static langs: {
        help: string;
        type: string;
        default: never[];
    };
    /**
     * @param {Partial<HeaderModel> | Record<string, any>} data Model input data.
     * @param {object} [options] Extended options (db, etc.)
     */
    constructor(data?: Partial<HeaderModel> | Record<string, any>, options?: object);
    /** @type {string} Site or app title displayed in the header */ title: string;
    /** @type {string} Logo image URL or icon name */ logo: string;
    /** @type {Navigation[]} Header action links (CTA, Sign In, etc.) */ actions: Navigation[];
    /** @type {any|null} Currently active language */ lang: any | null;
    /** @type {any[]} Available languages for switcher */ langs: any[];
}
import { Model } from '@nan0web/types';
import Navigation from './Navigation.js';

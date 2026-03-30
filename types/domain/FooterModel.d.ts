/**
 * FooterModel — OLMUI Model-as-Schema
 * Universal footer structure: copyright, version, license, navigation, sharing, languages.
 */
export default class FooterModel extends Model {
    static $id: string;
    static copyright: {
        help: string;
        placeholder: string;
        default: string;
    };
    static version: {
        help: string;
        placeholder: string;
        default: string;
    };
    static license: {
        help: string;
        placeholder: string;
        default: string;
    };
    static nav: {
        help: string;
        type: string;
        hint: typeof Navigation;
        default: never[];
    };
    static share: {
        help: string;
        type: string;
        hint: typeof Navigation;
        default: never[];
    };
    static langs: {
        help: string;
        type: string;
        default: never[];
    };
    /**
     * @param {Partial<FooterModel> | Record<string, any>} data Model input data.
     * @param {object} [options] Extended options (db, etc.)
     */
    constructor(data?: Partial<FooterModel> | Record<string, any>, options?: object);
    /** @type {string} Copyright text */ copyright: string;
    /** @type {string} Application version string */ version: string;
    /** @type {string} License type */ license: string;
    /** @type {Navigation[]} Footer navigation links */ nav: Navigation[];
    /** @type {Navigation[]} Social sharing links */ share: Navigation[];
    /** @type {any[]} Available languages for switcher */ langs: any[];
}
import { Model } from '@nan0web/types';
import Navigation from './Navigation.js';

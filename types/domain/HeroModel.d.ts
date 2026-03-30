/**
 * HeroModel — OLMUI Model-as-Schema
 * Universal hero/banner section for landing pages.
 * Uses Navigation[] for actions instead of a single CTA.
 */
export default class HeroModel extends Model {
    static $id: string;
    static title: {
        help: string;
        placeholder: string;
        default: string;
        required: boolean;
    };
    static description: {
        help: string;
        placeholder: string;
        default: string;
    };
    static image: {
        help: string;
        placeholder: string;
        hint: string;
        upload: boolean;
        default: string;
    };
    static actions: {
        help: string;
        type: string;
        hint: typeof Navigation;
        default: never[];
    };
    /**
     * @param {Partial<HeroModel> | Record<string, any>} data Model input data.
     * @param {object} [options] Extended options (db, etc.)
     */
    constructor(data?: Partial<HeroModel> | Record<string, any>, options?: object);
    /** @type {string} Hero main headline */ title: string;
    /** @type {string} Hero sub-headline or description text */ description: string;
    /** @type {string} Hero background or feature image URL */ image: string;
    /** @type {Navigation[]} Call-to-action buttons (multiple CTA support) */ actions: Navigation[];
}
import { Model } from '@nan0web/types';
import Navigation from './Navigation.js';

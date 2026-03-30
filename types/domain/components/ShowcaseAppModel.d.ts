/**
 * ShowcaseAppModel — OLMUI Model-as-Schema
 * A container model representing the entire UI library showcase.
 * @property {string} title - App title
 * @property {any[]} sections - Collection of UI sections
 */
export class ShowcaseAppModel extends Model {
    static $id: string;
    static title: {
        help: string;
        default: string;
    };
    static sections: {
        help: string;
        type: string;
        default: never[];
    };
    /**
     * OLMUI Generator — drives the showcase rendering.
     */
    run(): AsyncGenerator<{
        type: string;
        message: any;
        component: string;
    }, {
        type: string;
        data: {
            success: boolean;
        };
    }, unknown>;
}
import { Model } from '@nan0web/core';

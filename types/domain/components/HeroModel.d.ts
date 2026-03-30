/**
 * HeroModel — OLMUI Model-as-Schema
 * Main landing page banner with a big heading, description, and primary CTA.
 */
export class HeroModel extends Model {
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
    static actions: {
        help: string;
        type: string;
        default: never[];
    };
}
import { Model } from '@nan0web/core';

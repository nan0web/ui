export class GalleryRenderIntent extends Model {
    static alias: string;
    static UI: {
        rendering: string;
        success: string;
        failed: string;
    };
    static dataDir: {
        type: string;
        default: string;
        help: string;
    };
    static dir: {
        type: string;
        default: string;
        help: string;
    };
    /**

     * @param {Partial<GalleryRenderIntent> | Record<string, any>} [data={}]

     * @param {import('@nan0web/types').ModelOptions} [options={}]

     */
    constructor(data?: Partial<GalleryRenderIntent> | Record<string, any>, options?: import("@nan0web/types").ModelOptions);
    /** @type {string} */ dataDir: string;
    /** @type {string} */ dir: string;
    run(): AsyncGenerator<import("../../core/Intent.js").ShowIntent, import("../../core/Intent.js").ResultIntent | undefined, unknown>;
}
export default GalleryRenderIntent;
import { Model } from '@nan0web/types';

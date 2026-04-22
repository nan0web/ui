export class GalleryCommand extends ModelAsApp {
    static alias: string;
    static UI: {
        unknownAction: string;
    };
    static action: {
        type: string;
        help: string;
        options: (typeof SnapshotAuditor | typeof GalleryRenderIntent)[];
        default: string;
        positional: boolean;
    };
    /**
     * @param {Partial<GalleryCommand> | Record<string, any>} [data={}]
     * @param {import('@nan0web/types').ModelOptions} [options={}]
     */
    constructor(data?: Partial<GalleryCommand> | Record<string, any>, options?: import("@nan0web/types").ModelOptions);
    /** @type {string} */ action: string;
    /** @type {string[]} */ _positionals: string[];
    run(): AsyncGenerator<import("../../core/Intent.js").ShowIntent | (import("../../core/Intent.js").AskIntent & {
        $value?: any;
        $success?: boolean;
        $files?: Record<string, string>;
        $message?: string;
    }) | (import("../../core/Intent.js").ProgressIntent & {
        $value?: any;
        $success?: boolean;
        $files?: Record<string, string>;
        $message?: string;
    }) | (import("../../core/Intent.js").LogIntent & {
        $value?: any;
        $success?: boolean;
        $files?: Record<string, string>;
        $message?: string;
    }) | (import("../../core/Intent.js").RenderIntent & {
        $value?: any;
        $success?: boolean;
        $files?: Record<string, string>;
        $message?: string;
    }) | (import("../../core/Intent.js").AgentIntent & {
        $value?: any;
        $success?: boolean;
        $files?: Record<string, string>;
        $message?: string;
    }) | (import("../../core/Intent.js").ResultIntent & {
        $value?: any;
        $success?: boolean;
        $files?: Record<string, string>;
        $message?: string;
    }), any, any>;
}
export default GalleryCommand;
import { ModelAsApp } from '../ModelAsApp.js';
import SnapshotAuditor from './SnapshotAuditor.js';
import GalleryRenderIntent from './GalleryRenderIntent.js';

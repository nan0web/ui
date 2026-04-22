export class UIApp extends ModelAsApp {
    static command: {
        type: string;
        help: string;
        options: (typeof SnapshotAuditor | typeof GalleryCommand)[];
        default: string;
        positional: boolean;
    };
    static UI: {
        helpText: string;
        unknownCommand: string;
    };
    static help: {
        help: string;
        default: boolean;
    };
    /**
     * @param {Partial<UIApp> | Record<string, any>} [data={}]
     * @param {import('@nan0web/types').ModelOptions} [options={}]
     */
    constructor(data?: Partial<UIApp> | Record<string, any>, options?: import("@nan0web/types").ModelOptions);
    /** @type {string[]} */ _positionals: string[];
    /** @type {string} Type of command to run */ command: string;
    /** @type {boolean} Show help message */ help: boolean;
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
export default UIApp;
import { ModelAsApp } from '../ModelAsApp.js';
import SnapshotAuditor from './SnapshotAuditor.js';
import GalleryCommand from './GalleryCommand.js';

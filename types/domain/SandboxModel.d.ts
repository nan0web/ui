/**
 * @typedef {Object} SandboxData
 * @property {string[]} [components]
 * @property {string} [selectedComponent]
 * @property {string} [themeFormat]
 */
/**
 * Model-as-Schema for the UI Sandbox environment.
 * Represents a tool wrapping standard OLMUI components, allowing
 * users to inspect their models, tweak variables interactively,
 * and export the configuration as themes for the Marketplace.
 *
 * Navigation uses BreadcrumbModel:
 *   ESC = pop one level (if stack has no parent → exit app)
 *   Ctrl+C = always exit (handled by prompts.js wrapper)
 *
 * URL mapping:
 *   /sandbox             → Select Component
 *   /sandbox/button      → Edit Button properties
 *   /sandbox/button/export → Choose export format
 */
export class SandboxModel {
    static components: {
        help: string;
        type: string;
        default: never[];
    };
    static selectedComponent: {
        help: string;
        type: string;
    };
    static themeFormat: {
        help: string;
        options: string[];
        default: string;
    };
    /**
     * @param {SandboxData} [data]
     */
    constructor(data?: SandboxData);
    /** @type {string[]|undefined} */ components: string[] | undefined;
    /** @type {string|undefined} */ selectedComponent: string | undefined;
    /** @type {string|undefined} */ themeFormat: string | undefined;
    run(): AsyncGenerator<any, {
        type: string;
        data: {
            targetComponent: string | undefined;
            themeConfig: any;
            exportFormat: string | undefined;
            breadcrumb: string;
        };
    }, any>;
}
export type SandboxData = {
    components?: string[] | undefined;
    selectedComponent?: string | undefined;
    themeFormat?: string | undefined;
};

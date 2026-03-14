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
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
            options: string[];
            validate: (val: any) => true | "Component not found in sandbox registry";
        };
        component: string;
        model: any;
        instance?: undefined;
        level?: undefined;
        message?: undefined;
    } | {
        type: string;
        field: string;
        schema: any;
        component: string;
        model: boolean;
        instance: any;
        level?: undefined;
        message?: undefined;
    } | {
        type: string;
        field: string;
        schema: {
            help: string;
            options: string[];
            validate?: undefined;
        };
        component: string;
        model: any;
        instance?: undefined;
        level?: undefined;
        message?: undefined;
    } | {
        type: string;
        level: string;
        message: string;
        component: string;
        model: any;
        field?: undefined;
        schema?: undefined;
        instance?: undefined;
    }, {
        type: string;
        data: {
            targetComponent: string | undefined;
            themeConfig: any;
            exportFormat: string | undefined;
        };
    }, any>;
}
export type SandboxData = {
    components?: string[] | undefined;
    selectedComponent?: string | undefined;
    themeFormat?: string | undefined;
};

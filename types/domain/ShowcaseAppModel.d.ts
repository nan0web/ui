/**
 * Model-as-Schema for the entire UI Sandbox Showcase.
 * Represents a complete User Journey demonstrating all components.
 * Showcases OLMUI Scenario Testing capabilities.
 */
export class ShowcaseAppModel {
    static appName: {
        help: string;
        default: string;
        type: string;
    };
    appName: string;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
        };
        component: string;
        model: any;
    } | {
        type: string;
        field: string;
        schema: {
            help: string | undefined;
            type: string;
        };
        component: string;
        model: any;
    } | {
        type: string;
        level: string;
        message: string | undefined;
        component: string;
        model: any;
    } | {
        type: string;
        message: string;
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            success: boolean;
            reason: string;
            profile?: undefined;
            rowsDisplayed?: undefined;
        };
    } | {
        type: string;
        data: {
            success: boolean;
            profile: {
                userName: string;
                role: string;
                tool: string;
            };
            rowsDisplayed: number;
            reason?: undefined;
        };
    }, unknown>;
}

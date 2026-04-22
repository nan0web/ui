export class SpecRunner extends ModelAsApp {
    static stream: {
        help: string;
        default: never[];
    };
    static registry: {
        help: string;
        default: {};
    };
    static UI: {
        invalidStream: string;
        invalidFirstStep: string;
        missingAppName: string;
        appNotFound: string;
        invalidGenerator: string;
        running: string;
        unhandledSteps: string;
    };
    /**
     * Run a Nan0Spec sequence programmatically (for unit tests).
     *
     * @param {Array<object>} stream The .nan0 intent stream array
     * @param {Record<string, any>} registry A registry of Model Classes that can be mounted
     * @param {typeof import('node:assert/strict')} [asserter] Custom assertion library
     */
    static execute(stream: Array<object>, registry: Record<string, any>, asserter?: typeof import("node:assert/strict")): Promise<any>;
    /**
     * @param {Partial<SpecRunner>} [data={}]
     * @param {Partial<import('../index.js').ModelAsAppOptions> & { assert?: typeof import('node:assert/strict') }} [options={}]
     */
    constructor(data?: Partial<SpecRunner>, options?: Partial<import("../index.js").ModelAsAppOptions> & {
        assert?: typeof import("node:assert/strict");
    });
    /** @type {Array<object>} The Nan0Spec stream */
    stream: Array<object>;
    /** @type {Record<string, any>} The registry of Model Classes */
    registry: Record<string, any>;
    #private;
}
export default SpecRunner;
import { ModelAsApp } from '../domain/ModelAsApp.js';

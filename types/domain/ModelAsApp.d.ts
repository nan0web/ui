/** @typedef {import('@nan0web/types').ModelOptions & { adapter: InputAdapter }} ModelAsAppOptions */
/**
 * The model with a run generator.
 */
export class ModelAsApp extends Model {
    /**
     * @param {Partial<ModelAsApp> | Record<string, any>} [data={}]
     * @param {ModelAsAppOptions} [options={}]
     */
    constructor(data?: Partial<ModelAsApp> | Record<string, any>, options?: ModelAsAppOptions);
    /** @returns {ModelAsAppOptions} */
    get _(): ModelAsAppOptions;
    /**
     * @returns {AsyncGenerator<import('@nan0web/ui').Intent, import('@nan0web/ui').ResultIntent, any>}
     */
    run(): AsyncGenerator<import("@nan0web/ui").Intent, import("@nan0web/ui").ResultIntent, any>;
    #private;
}
export type ModelAsAppOptions = import("@nan0web/types").ModelOptions & {
    adapter: InputAdapter;
};
import { Model } from '@nan0web/types';
import { InputAdapter } from '../core/InputAdapter.js';

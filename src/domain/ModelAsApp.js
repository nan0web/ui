import { Model } from '@nan0web/types'
import { result } from '../core/Intent.js'
import { InputAdapter } from '../core/InputAdapter.js'

/** @typedef {import('@nan0web/types').ModelOptions & { adapter: InputAdapter }} ModelAsAppOptions */

/**
 * The model with a run generator.
 */
export class ModelAsApp extends Model {
	/** @type {ModelAsAppOptions} */
	#appOptions = {
		t: (key) => key,
		plugins: {},
		adapter: null,
	}
	/**
	 * @param {Partial<ModelAsApp> | Record<string, any>} [data={}]
	 * @param {ModelAsAppOptions} [options={}]
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		this.#appOptions = {
			...options,
			t:
				options.t ||
				((key, props = {}) =>
					String(key)
						.replace(/{(\w+)}/g, (_, x) => props[x] ?? `{${x}}`)
						.replace(/_/g, ' ')),
			plugins: options.plugins || {},
			adapter: options.adapter || new InputAdapter(),
		}
	}

	/** @returns {ModelAsAppOptions} */
	get _() {
		return this.#appOptions
	}
	/**
	 * @returns {AsyncGenerator<import('@nan0web/ui').Intent, import('@nan0web/ui').ResultIntent, any>}
	 */
	async *run() {
		return result({})
	}
}

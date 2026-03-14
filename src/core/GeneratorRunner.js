/**
 * @file GeneratorRunner — Universal Adapter Loop with Timeout, Abort, and Contract Enforcement.
 *
 * This is the core engine that runs any OLMUI async generator (Model.run())
 * through a set of adapter handlers. It enforces:
 *
 * 1. Intent validation (the "Judge" — Ярослав Мудрий).
 * 2. Timeout / Abort support (Іван Сірко).
 * 3. Type-safe handler dispatch (Борис Патон).
 *
 * Every UI Adapter (CLI, Lit, Chat, Test) uses this runner
 * instead of writing its own while(true) loop.
 */

import { validateIntent } from './Intent.js'
import { IntentErrorModel } from './IntentErrorModel.js'

/**
 * @typedef {Object} AdapterHandlers
 * @property {(intent: import('./Intent.js').AskIntent) => Promise<import('./Intent.js').AskResponse>} ask
 *   Handler for 'ask' intents. Must return { value: ... }.
 * @property {(intent: import('./Intent.js').ProgressIntent) => void | Promise<void>} [progress]
 *   Handler for 'progress' intents. Optional (defaults to no-op).
 * @property {(intent: import('./Intent.js').LogIntent) => void | Promise<void>} [log]
 *   Handler for 'log' intents. Optional (defaults to no-op).
 * @property {(intent: import('./Intent.js').ResultIntent) => void | Promise<void>} [result]
 *   Handler for the final 'result'. Optional (defaults to no-op).
 */

/**
 * @typedef {Object} RunnerOptions
 * @property {number} [timeoutMs=0]
 *   Maximum milliseconds to wait for an adapter handler to respond.
 *   Default is 0 (disabled) — web forms may wait indefinitely.
 *   Set to a positive value for CLI/Chat adapters where hanging is unacceptable.
 * @property {AbortSignal} [signal]
 *   External AbortSignal for cancellation from outside.
 */

/**
 * Wraps a promise with a timeout. Rejects if the promise doesn't resolve in time.
 * If ms <= 0, timeout is disabled (promise runs without time limit).
 *
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @param {string} label - Description for the timeout error.
 * @returns {Promise<T>}
 */
function withTimeout(promise, ms, label) {
	if (!ms || ms <= 0) return promise

	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			const error = IntentErrorModel.error('timeout', { label, ms })
			reject(error)
		}, ms)

		promise.then(
			(val) => {
				clearTimeout(timer)
				resolve(val)
			},
			(err) => {
				clearTimeout(timer)
				reject(err)
			},
		)
	})
}

/**
 * Runs an OLMUI async generator through the provided adapter handlers.
 *
 * This function is the SINGLE point of execution for all adapters.
 * It guarantees:
 * - Every yielded intent is validated (contract enforcement).
 * - Every 'ask' intent gets a response or times out (if timeoutMs > 0).
 * - External abort signals are respected.
 * - The final result is returned.
 *
 * @template T
 * @param {AsyncGenerator<import('./Intent.js').Intent, import('./Intent.js').ResultIntent, import('./Intent.js').IntentResponse>} generator
 *   The model's async generator (from Model.run()).
 * @param {AdapterHandlers} handlers
 *   Platform-specific handlers for each intent type.
 * @param {RunnerOptions} [options={}]
 *   Runner configuration (timeout, abort signal).
 * @returns {Promise<T>}
 *   The final result data from the generator.
 */
export async function runGenerator(generator, handlers, options = {}) {
	const { timeoutMs = 0, signal } = options

	// Validate that at least 'ask' handler is provided (Ярослав Мудрий's law)
	if (!handlers || typeof handlers.ask !== 'function') {
		throw IntentErrorModel.error('adapter_missing_ask')
	}

	/** @type {import('./Intent.js').IntentResponse} */
	let nextVal = undefined

	while (true) {
		// ─── Check external abort signal ───
		if (signal?.aborted) {
			await generator.return({ type: 'result', data: null })
			const error = IntentErrorModel.error('aborted')
			error.name = 'AbortError'
			throw error
		}

		const { value: intent, done } = await generator.next(nextVal)

		// ─── Generator completed (return statement) ───
		if (done) {
			if (handlers.result) {
				await handlers.result(intent)
			}
			return intent?.data
		}

		// ─── Validate intent structure (the Judge) ───
		validateIntent(intent)

		// ─── Dispatch to adapter handler ───
		switch (intent.type) {
			case 'ask': {
				const response = await withTimeout(
					handlers.ask(intent),
					timeoutMs,
					`ask("${intent.field}")`,
				)

				// Validate response shape (Борис Патон's weld check)
				if (!response || typeof response !== 'object' || !('value' in response)) {
					throw IntentErrorModel.error('ask_wrong_response', {
						field: intent.field,
						actual: JSON.stringify(response),
					})
				}

				// ─── Handle cancellation (ESC / back navigation) ───
				if (response.cancelled) {
					await generator.return({ type: 'result', data: null })
					return /** @type {T} */ (null)
				}

				// Run field validation if schema has a validator (the Judge again)
				if (!intent.model) {
					/** @type {import('./Intent.js').FieldSchema} */
					const fieldSchema = /** @type {import('./Intent.js').FieldSchema} */ (intent.schema)
					if (fieldSchema.validate) {
						const validationResult = fieldSchema.validate(response.value)
						if (validationResult !== true) {
							throw IntentErrorModel.error('validation_failed', {
								field: intent.field,
								reason: validationResult,
							})
						}
					}
				}

				// Instantiate Model-as-Schema class with collected data
				if (intent.model && typeof intent.schema === 'function') {
					const ModelClass = /** @type {new (data: any) => any} */ (intent.schema)
					response.value = new ModelClass(response.value)
				}

				nextVal = response
				break
			}

			case 'progress': {
				if (handlers.progress) {
					await handlers.progress(intent)
				}
				nextVal = undefined
				break
			}

			case 'log': {
				if (handlers.log) {
					await handlers.log(intent)
				}
				nextVal = undefined
				break
			}

			default:
				throw IntentErrorModel.error('unhandled_intent', { type: /** @type {any} */ (intent).type })
		}
	}
}

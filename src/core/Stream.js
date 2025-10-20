import StreamEntry from "./StreamEntry.js"

/**
 * Agnostic UI stream for processing progress.
 *
 * @class UIStream
 */
export default class UIStream {
	/**
	 * Creates an async generator that runs the supplied processor function.
	 *
	 * @param {AbortSignal} signal - Abort signal.
	 * @param {() => Promise<StreamEntry>} processorFn - Async function that returns a result.
	 * @returns {() => AsyncGenerator<StreamEntry>} Async generator function.
	 */
	static createProcessor(signal, processorFn) {
		return async function* () {
			try {
				const result = await processorFn()
				yield result
			} catch (/** @type {any} */ error) {
				if (error.name === 'AbortError') {
					yield StreamEntry.from({ done: true, cancelled: true })
				} else {
					yield StreamEntry.from({ error: error.message })
				}
			}
		}
	}

	/**
	 * Runs a generator with progress callbacks and abort handling.
	 *
	 * @param {AbortSignal} signal - Abort signal.
	 * @param {Function} generator - Function returning an async iterator.
	 * @param {Function} [onProgress] - Called with (progress, item).
	 * @param {Function} [onError] - Called with (errorMessage, item).
	 * @param {Function} [onComplete] - Called with (item) when done.
	 * @returns {Promise<void>}
	 */
	static async process(signal, generator, onProgress, onError, onComplete) {
		const iter = generator()

		try {
			for await (const item of iter) {
				if (signal.aborted) {
					throw new DOMException('Aborted', 'AbortError')
				}

				if (item.progress !== undefined) {
					onProgress?.(item.progress, item)
				} else if (item.error) {
					onError?.(item.error, item)
				} else if (item.done) {
					onComplete?.(item)
					break
				} else {
					// Intermediate results
					onProgress?.(null, item)
				}
			}
		} catch (/** @type {any} */ error) {
			if (error.name === 'AbortError') {
				onComplete?.({ cancelled: true })
			} else {
				onError?.(error.message)
			}
			throw error
		}
	}
}

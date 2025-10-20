/**
 * Represents an entry in a stream with value, completion status, cancellation status, and error message.
 */
export default class StreamEntry {
	/**
	 * The value of the stream entry.
	 * @type {any}
	 */
	value = undefined

	/**
	 * Indicates if the stream entry is done (completed).
	 * @type {boolean}
	 */
	done = false

	/**
	 * Indicates if the stream entry has been cancelled.
	 * @type {boolean}
	 */
	cancelled = false

	/**
	 * Error message associated with the stream entry.
	 * @type {string}
	 */
	error = ""

	/**
	 * Creates a new StreamEntry instance.
	 * @param {Object} [input={}] - Input object to initialize the stream entry.
	 * @param {any} [input.value] - The value for the stream entry.
	 * @param {boolean} [input.done] - Whether the stream entry is completed.
	 * @param {boolean} [input.cancelled] - Whether the stream entry is cancelled.
	 * @param {string} [input.error] - Error message for the stream entry.
	 */
	constructor(input = {}) {
		const {
			value = this.value,
			done = this.done,
			cancelled = this.cancelled,
			error = this.error,
		} = input
		this.value = value
		this.done = Boolean(done)
		this.cancelled = Boolean(cancelled)
		this.error = String(error)
	}

	/**
	 * Creates a StreamEntry instance from the given input.
	 * @param {any} input - The input to create a StreamEntry from.
	 * @returns {StreamEntry} A new or existing StreamEntry instance.
	 */
	static from(input) {
		if (input instanceof StreamEntry) return input
		return new StreamEntry(input)
	}
}
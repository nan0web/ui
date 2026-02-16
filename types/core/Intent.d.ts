/**
 * Intent represents the user's declared will to perform an action.
 * It is interface-agnostic and can be validated or executed without
 * any UI, CLI, or external dependencies.
 *
 * An Intent may be:
 * - Ready: all required data is valid → can be executed immediately
 * - Partial: some data missing or invalid → requires user action
 * - Invalid: cannot be fulfilled under any interface (e.g., restricted field)
 *
 * @example
 * const intent = new Intent({
 *   target: LoginMessage,
 *   body: { username: "alice" }
 * })
 * if (!intent.isReady()) {
 *   const validMsg = await handleIntent(intent, adapter)
 * }
 */
declare class Intent extends Message {
	/**
	 * Create a new Intent.
	 *
	 * @param {object} input
	 * @param {typeof Message} input.target - message class this intent wants to create
	 * @param {any} [input.context] - execution context
	 * @param {object} [body] - partial or complete data for the target message
	 */
	constructor({ target, context, ...body }?: { target: typeof Message; context?: any })
	/**
	 * The target Message class this Intent aims to produce.
	 * Must be a class with a static `.Body` schema.
	 *
	 * @type {typeof Message | null}
	 */
	target: typeof Message | null
	/**
	 * Optional context for execution (session, locale, state, etc.).
	 *
	 * @type {any}
	 */
	context: any
	/**
	 * Validates all fields in the Intent's body against the target's schema.
	 *
	 * Checks:
	 * - Required fields presence and non-emptiness
	 * - Pattern matching (RegExp)
	 * - Value within allowed options (if defined)
	 * - Custom validation logic (if `validate` function is defined)
	 *
	 * @returns {Map<string, string>} Map of field → error message, empty if valid
	 */
	validateIntent(): Map<string, string>
	/**
	 * Executes the Intent by creating a valid instance of the target message.
	 *
	 * If the Intent is not ready (has validation errors), returns null.
	 *
	 * @returns {Message | null} the created message, or null if invalid
	 */
	execute(): Message | null
	/**
	 * Checks if the Intent can be executed immediately, without user input.
	 *
	 * @returns {boolean} true if all required fields are valid
	 */
	isReady(): boolean
	/**
	 * Converts the Intent to a plain object for logging or inspection.
	 *
	 * @returns {object} serializable object with intent, body, and context
	 */
	toObject(): object
}
declare namespace Intent {
	/**
	 * Handles an Intent by fulfilling missing or invalid fields.
	 *
	 * @param {Intent} intent - the declared intent to handle
	 * @param {object} inputAdapter - must have `.ask(prompt)`
	 * @returns {Promise<Message | null>} resolved when intent is fulfilled
	 * @throws {CancelError} if user cancels
	 */
	function handleIntent(intent: Intent, inputAdapter: object): Promise<Message | null>
}
export default Intent
import { Message } from '@nan0web/co'

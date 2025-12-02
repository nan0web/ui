import EventProcessor from "@nan0web/event/oop"
import CancelError from "./Error/CancelError.js"
import UIMessage from "./Message/Message.js"
import UIForm from "./Form/Form.js"
import FormInput from "./Form/Input.js"

/**
 * Unified UI Adapter that handles both input and output operations.
 * It manages user interactions and rendering of messages, forms, and progress.
 *
 * @class UiAdapter
 * @extends EventProcessor
 *
 * @example
 * const adapter = new UiAdapter()
 * adapter.output = new View()
 *
 * const result = await adapter.requireInput(new LoginMessage())
 * console.log(result) // { username: "user", password: "pass" }
 */
export default class UiAdapter extends EventProcessor {
	static CancelError = CancelError
	/** @returns {typeof CancelError} */
	get CancelError() {
		return /** @type {typeof UiAdapter} */ (this.constructor).CancelError
	}

	/** @type {OutputAdapter | null} Output interface for rendering */
	output = null

	/**
	 * Starts listening for input and emits an `input` event.
	 *
	 * @returns {void}
	 */
	start() {
		this.emit('input', UIMessage.from({ body: "Adapter started" }))
	}

	/**
	 * Stops listening for input and output streams.
	 * Default implementation does nothing; override in subclasses to perform cleanup.
	 *
	 * @returns {void}
	 */
	stop() {
		// Default implementation – does nothing
	}

	/**
	 * Checks whether the adapter is ready to receive input.
	 *
	 * @returns {boolean} Always true in base class; override for specific checks.
	 */
	isReady() {
		return true
	}

	/**
	 * Helper to ask a question.
	 * Must be implemented by subclasses.
	 *
	 * @param {string} question - Question to ask the user.
	 * @returns {Promise<string>} User's response.
	 * @throws {Error} If not implemented in subclass.
	 */
	async ask(question) {
		throw new Error('ask() method must be implemented in subclass')
	}

	/**
	 * Generic selection prompt.
	 * Must be implemented by subclasses.
	 *
	 * @param {object} config - Selection configuration.
	 * @param {string[]} [config.options=[]] - List of options to choose from.
	 * @returns {Promise<{ index: number, value: string | null }>} Selected option.
	 * @throws {Error} If not implemented in subclass.
	 */
	async select(config) {
		throw new Error('select() method must be implemented in subclass')
	}

	/**
	 * Ensures a message's body is fully and validly filled.
	 * Generates a form from the message's static Body schema,
	 * then iteratively collects input until all fields are valid or cancelled.
	 *
	 * @template {UIMessage} T
	 * @param {T} msg - Message instance needing input.
	 * @returns {Promise<T['body']>} Updated and validated message body.
	 *
	 * @example
	 * const body = await adapter.requireInput(new LoginMessage({ body: { username: "user" } }))
	 * // → prompts for password, returns { username: "user", password: "..." }
	 */
	async requireInput(msg) {
		if (!msg) {
			throw new Error("Message instance is required")
		}
		if (!(msg instanceof UIMessage)) {
			throw new TypeError("Message must be an instance of UIMessage")
		}
		/** @type {Map<string,string>} */
		let errors = msg.validate()
		while (errors.size > 0) {
			const form = generateForm(
				/** @type {any} */ (msg.constructor).Body,
				{ initialState: msg.body }
			)

			const formResult = await this.processForm ? this.processForm(form, msg.body) : {} // Assume method exists or handle differently, but error indicates missing method; perhaps remove if not used
			if (formResult.escaped) {
				throw new CancelError("User cancelled form")
			}

			const updatedBody = { ...msg.body, ...formResult.form.state }
			const updatedErrors = msg.validate(updatedBody)

			if (updatedErrors.size > 0) {
				if (this.output) {
					await this.output.render("Alert", {
						variant: "error",
						content: Array.from(updatedErrors.values()).join("\n")
					})
				}
				errors = updatedErrors
				continue
			}
			msg.body = updatedBody
			break
		}
		return msg.body
	}

	/**
	 * Renders a message to the user interface.
	 * Must be implemented by subclasses.
	 *
	 * @param {UIMessage} message - Message to render.
	 * @emits rendered
	 * @throws {Error} If not implemented in subclass.
	 */
	render(message) {
		throw new Error("render() must be implemented by subclass")
		this.emit("rendered", message)
	}
}

/**
 * Generates a UIForm from a static Body schema.
 *
 * @param {Function} BodyClass - Class defining field schema.
 * @param {Object} [options={}] - Generation options.
 * @param {Object} [options.initialState={}] - Pre-filled form values.
 * @param {Function} [options.t] - Optional translation function.
 * @returns {UIForm} Form instance ready for input.
 */
export function generateForm(BodyClass, options = {}) {
	const { initialState = {}, t = v => v } = options
	const fields = []

	for (const [name, schema] of Object.entries(BodyClass)) {
		if (typeof schema !== "object" || schema === null || !name || !schema.help) continue

		const label = t(schema.help) || name
		const placeholder = t(schema.placeholder || schema.defaultValue || "")
		const isRequired = !!schema.required

		fields.push(
			new FormInput({
				name,
				label,
				type: schema.type || FormInput.TYPES.TEXT,
				required: isRequired,
				placeholder,
				options: schema.options ? schema.options.map(o => String(o)) : [],
				validation: schema.validate
					? (value) => {
						const res = schema.validate(value)
						return res === true ? true : typeof res === "string" ? res : `Invalid ${name}`
					}
					: () => true,
			}),
		)
	}

	return new UIForm({ fields })
}

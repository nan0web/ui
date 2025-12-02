/**
 * @typedef {Object} Filter
 * @property {string} [q=""]
 * @property {number} [offset=0]
 * @property {number} [limit=36]
 */

/** @typedef {Array<string> | ((filter: Filter) => Promise<string[]>)} InputOptions */

/**
 * Form input field descriptor.
 *
 * @class FormInput
 * @property {string} name - Field name.
 * @property {string} label - Display label.
 * @property {string} type - Input type (text, email, number, select, etc.).
 * @property {boolean} required - Whether the field is required.
 * @property {string} placeholder - Placeholder text.
 * @property {Array<string>} options - Select options (if type is 'select').
 * @property {Function|null} validation - Custom validation function.
 * @property {*} defaultValue - Default value.
 */
export default class FormInput {
	/** @type {string} */ name = ''
	/** @type {string} */ label = ''
	/** @type {string} */ type = 'text'
	/** @type {boolean} */ required = false
	/** @type {string} */ placeholder = ''
	/** @type {InputOptions} */ options = []
	/** @type {import("@nan0web/co").ValidateFn|null} */ validation = null
	/** @type {*} */ defaultValue = null

	/**
	 * Predefined input types.
	 */
	static TYPES = {
		TEXT: 'text',
		EMAIL: 'email',
		NUMBER: 'number',
		SELECT: 'select',
		CHECKBOX: 'checkbox',
		TEXTAREA: 'textarea'
	}

	/**
	 * Create a new form input.
	 *
	 * @param {Object} props - Input properties.
	 * @param {string} props.name - Field name.
	 * @param {string} [props.label=props.name] - Display label.
	 * @param {string} [props.type='text'] - Input type.
	 * @param {boolean} [props.required=false] - Is required.
	 * @param {string} [props.placeholder=''] - Placeholder.
	 * @param {InputOptions} [props.options=[]] - Select options or async function to retrieve data with the search and page.
	 * @param {Function} [props.validation=null] - Custom validation.
	 * @param {*} [props.defaultValue=null] - Default value.
	 */
	constructor(props) {
		const {
			name,
			label = name,
			type = FormInput.TYPES.TEXT,
			required = this.required,
			placeholder = this.placeholder,
			options = [],
			validation = this.validation,
			defaultValue = this.defaultValue
		} = props

		if (!name) {
			throw new TypeError('FormInput.name is required')
		}

		this.name = String(name)
		this.label = String(label)
		this.type = String(type)
		this.required = Boolean(required)
		this.placeholder = String(placeholder)
		this.options = options
		this.validation = validation
		this.defaultValue = defaultValue

		this.requireValidType()
	}

	requireValidType() {
		if (!Object.values(FormInput.TYPES).includes(this.type)) {
			throw new TypeError([
				"FormInput.type is invalid!",
				["Provided", this.type].join(": "),
				"Available types:",
				...Object.values(FormInput.TYPES).map(t => `  - ${t}`)
			].join("\n"))
		}
	}

	/**
	 * Serialises the input to a plain JSON object.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			name: this.name,
			label: this.label,
			type: this.type,
			required: this.required,
			placeholder: this.placeholder,
			options: this.options,
			defaultValue: this.defaultValue
		}
	}

	/**
	 * @param {*} input
	 * @returns {FormInput}
	 */
	static from(input) {
		if (input instanceof FormInput) return input
		if ("string" === typeof input) {
			return new FormInput({ name: input, label: input })
		}
		return new FormInput(input)
	}
}

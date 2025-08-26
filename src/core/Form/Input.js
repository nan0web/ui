export default class FormInput {
	static TYPES = {
		TEXT: 'text',
		EMAIL: 'email',
		PASSWORD: 'password',
		SELECT: 'select',
		CHECKBOX: 'checkbox',
		RADIO: 'radio',
		DATE: 'date',
		NUMBER: 'number',
		HIDDEN: 'hidden'
	}

	type = FormInput.TYPES.TEXT
	name
	label
	required = false
	placeholder = ''
	options = []
	validator = null
	defaultValue = ''

	constructor(input = {}) {
		const {
			type = this.type,
			name,
			label,
			required = this.required,
			placeholder = this.placeholder,
			options = [],
			validator = this.validator,
			defaultValue = this.defaultValue
		} = input

		this.type = String(type)
		this.name = name ? String(name) : undefined
		this.label = label ? String(label) : undefined
		this.required = Boolean(required)
		this.placeholder = String(placeholder)
		this.options = Array.isArray(options) ? options : []
		this.validator = validator
		this.defaultValue = defaultValue
	}

	// Додаткові перевірки
	hasOptions() {
		return this.type === 'select' && this.options.length > 0
	}

	isValidType() {
		return Object.values(FormInput.TYPES).includes(this.type)
	}

	static from(input) {
		if (input instanceof FormInput) return input
		if ("string" === typeof input) {
			return new FormInput({ name: input, label: input })
		}
		return new FormInput(input)
	}

}

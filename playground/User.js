import FormInput from "../src/core/Form/Input.js"

/**
 * Simple domain model representing a user.
 *
 * The static `formFields` property defines the UI fields that should be
 * displayed when generating a form for this model.
 *
 * Each field is described using `FormInput`, which the UI core library
 * understands.  The `required` flag, `type`, and other properties are
 * respected by the validation routine inside `UIForm`.
 */
export default class User {
	/**
	 * Constructs a new User instance.
	 *
	 * @param {Object} data - Initial data.
	 * @param {string} data.name
	 * @param {string} data.email
	 * @param {number} data.age
	 */
	constructor({ name = "", email = "", age = null } = {}) {
		this.name = String(name)
		this.email = String(email)
		this.age = age !== null ? Number(age) : null
	}

	/** @type {FormInput[]} UI fields for the User model */
	static formFields = [
		new FormInput({
			name: "name",
			label: "Name",
			type: FormInput.TYPES.TEXT,
			required: true,
			placeholder: "Enter full name",
		}),
		new FormInput({
			name: "email",
			label: "Email",
			type: FormInput.TYPES.EMAIL,
			required: true,
			placeholder: "example@domain.com",
		}),
		new FormInput({
			name: "age",
			label: "Age",
			type: FormInput.TYPES.NUMBER,
			required: false,
			placeholder: "Optional",
		}),
	]
}
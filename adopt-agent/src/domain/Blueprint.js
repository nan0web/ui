import { resolveAliases, resolveDefaults } from '@nan0web/types'

export class Blueprint {
	static blueprint = {
		help: 'Blueprint is a domain object that represents a blueprint of a system.',
		alias: 'bp',
		default: true,
	}

	static _name = {
		help: 'Project/agent name (Package Name)',
		alias: 'name',
		default: 'new-agent',
		validate: (val) => (val?.length > 2 ? true : 'Name must be at least 3 characters long'),
	}

	static description = {
		help: 'Short description for seed.md',
		alias: 'desc',
		default: 'Zero-Hallucination Agent',
	}

	static version = {
		help: 'Version',
		alias: 'v',
		default: '1.0.0',
	}

	static strictness = {
		help: 'Generation strictness level',
		default: 'zero-hallucination',
		options: ['zero-hallucination', 'flexible'],
	}

	/** @type {boolean} */
	blueprint = Blueprint.blueprint.default

	/** @type {string} */
	name = Blueprint._name.default

	/** @type {string} */
	description = Blueprint.description.default

	/** @type {string} */
	version = Blueprint.version.default

	/** @type {'zero-hallucination' | 'flexible'} */
	strictness = Blueprint.strictness.default

	constructor(data = {}) {
		resolveDefaults(Blueprint, this)
		const resolvedData = resolveAliases(Blueprint, data)
		Object.assign(this, resolvedData)

		// Map the static _name key to the instance property name
		if (this._name !== undefined) {
			this.name = this._name
			delete this._name
		}
	}
}

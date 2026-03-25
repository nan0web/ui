import { Model } from '@nan0web/core'

/**
 * Navigation Model — OLMUI Model-as-Schema
 * Generic recursive navigation structure for all UI platforms (CLI, Web, Mobile).
 */
export default class Navigation extends Model {
	static $id = '@nan0web/ui/Navigation'

	static title = {
		help: 'Label for the menu item',
		placeholder: 'Home',
		default: '',
		required: true,
	}
	static href = {
		help: 'URL or internal app route',
		placeholder: '/',
		default: '#',
	}
	static icon = {
		help: 'Icon name/ID',
		placeholder: 'home',
		default: '',
	}
	static image = {
		help: 'Display image or thumbnail',
		placeholder: 'https://...',
		default: '',
	}
	static children = {
		help: 'Nested sub-menu navigation',
		type: 'Navigation[]',
		hint: Navigation,
		default: [],
	}
	static hidden = {
		help: 'Hide from lists/menus',
		type: 'boolean',
		default: false,
	}

	/**
	 * @param {Partial<Navigation>} data
	 */
	constructor(data = {}) {
		super(data)
		/** @type {string|undefined} */ this.title
		/** @type {string|undefined} */ this.href
		/** @type {string|undefined} */ this.icon
		/** @type {string|undefined} */ this.image
		/** @type {Navigation[]|undefined} */ this.children
		/** @type {boolean|undefined} */ this.hidden

		if (this.children) {
			this.children = this.children.map((item) => new Navigation(item))
		}
	}
}

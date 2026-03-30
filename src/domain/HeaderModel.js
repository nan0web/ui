import { Model } from '@nan0web/types'
import Navigation from './Navigation.js'

/**
 * HeaderModel — OLMUI Model-as-Schema
 * Universal header structure: logo, navigation, language switcher, actions.
 */
export default class HeaderModel extends Model {
	static $id = '@nan0web/ui/HeaderModel'

	static title = {
		help: 'Site or app title displayed in the header',
		placeholder: 'My App',
		default: '',
	}
	static logo = {
		help: 'Logo image URL or icon name',
		placeholder: 'https://...',
		default: '',
	}
	static actions = {
		help: 'Header action links (CTA, Sign In, etc.)',
		type: 'Navigation[]',
		hint: Navigation,
		default: [],
	}
	static lang = {
		help: 'Currently active language',
		type: 'Language',
		default: null,
	}
	static langs = {
		help: 'Available languages for switcher',
		type: 'Language[]',
		default: [],
	}

	/**
	 * @param {Partial<HeaderModel> | Record<string, any>} data Model input data.
	 * @param {object} [options] Extended options (db, etc.)
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} Site or app title displayed in the header */ this.title
		/** @type {string} Logo image URL or icon name */ this.logo
		/** @type {Navigation[]} Header action links (CTA, Sign In, etc.) */ this.actions
		/** @type {any|null} Currently active language */ this.lang
		/** @type {any[]} Available languages for switcher */ this.langs
	}
}

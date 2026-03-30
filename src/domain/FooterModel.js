import { Model } from '@nan0web/types'
import Navigation from './Navigation.js'

/**
 * FooterModel — OLMUI Model-as-Schema
 * Universal footer structure: copyright, version, license, navigation, sharing, languages.
 */
export default class FooterModel extends Model {
	static $id = '@nan0web/ui/FooterModel'

	static copyright = {
		help: 'Copyright text',
		placeholder: '© 2026 Company',
		default: '',
	}
	static version = {
		help: 'Application version string',
		placeholder: '1.0.0',
		default: '',
	}
	static license = {
		help: 'License type',
		placeholder: 'ISC',
		default: '',
	}
	static nav = {
		help: 'Footer navigation links',
		type: 'Navigation[]',
		hint: Navigation,
		default: [],
	}
	static share = {
		help: 'Social sharing links',
		type: 'Navigation[]',
		hint: Navigation,
		default: [],
	}
	static langs = {
		help: 'Available languages for switcher',
		type: 'Language[]',
		default: [],
	}

	/**
	 * @param {Partial<FooterModel> | Record<string, any>} data Model input data.
	 * @param {object} [options] Extended options (db, etc.)
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} Copyright text */ this.copyright
		/** @type {string} Application version string */ this.version
		/** @type {string} License type */ this.license
		/** @type {Navigation[]} Footer navigation links */ this.nav
		/** @type {Navigation[]} Social sharing links */ this.share
		/** @type {any[]} Available languages for switcher */ this.langs
	}
}

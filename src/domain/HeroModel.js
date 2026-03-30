import { Model } from '@nan0web/types'
import Navigation from './Navigation.js'

/**
 * HeroModel — OLMUI Model-as-Schema
 * Universal hero/banner section for landing pages.
 * Uses Navigation[] for actions instead of a single CTA.
 */
export default class HeroModel extends Model {
	static $id = '@nan0web/ui/HeroModel'

	static title = {
		help: 'Hero main headline',
		placeholder: 'Welcome to Our Platform',
		default: '',
		required: true,
	}
	static description = {
		help: 'Hero sub-headline or description text',
		placeholder: 'Build something amazing...',
		default: '',
	}
	static image = {
		help: 'Hero background or feature image URL',
		placeholder: 'https://...',
		hint: 'image',
		upload: true,
		default: '',
	}
	static actions = {
		help: 'Call-to-action buttons (multiple CTA support)',
		type: 'Navigation[]',
		hint: Navigation,
		default: [],
	}

	/**
	 * @param {Partial<HeroModel> | Record<string, any>} data Model input data.
	 * @param {object} [options] Extended options (db, etc.)
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} Hero main headline */ this.title
		/** @type {string} Hero sub-headline or description text */ this.description
		/** @type {string} Hero background or feature image URL */ this.image
		/** @type {Navigation[]} Call-to-action buttons (multiple CTA support) */ this.actions
	}
}

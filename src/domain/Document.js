import { Model } from '@nan0web/types'
import { Content } from './Content.js'

export class Document extends Model {
	static title = { type: 'string', help: 'Title' }
	static content = { type: 'array', model: Content, help: 'Content' }
	/**
	 *
	 * @param {Partial<Document>} [data]
	 * @param {import('@nan0web/types').ModelOptions} [options]
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} Title */ this.title
		/** @type {Array<Content>} Content */ this.content
	}
}

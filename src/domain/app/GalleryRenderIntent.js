import { Model } from '@nan0web/types'
import SnapshotRunner from './SnapshotRunner.js'

import { show, result } from '../../core/Intent.js'

export class GalleryRenderIntent extends Model {
	static alias = 'render'

	static UI = {
		rendering: '📸 Rendering gallery from {dataDir} to {dir}',
		success: '✅ Gallery render complete',
		failed: '🚨 Gallery render failed: {error}',
	}
	
	static dataDir = { 
		type: 'string', 
		default: 'docs/data',
		help: 'Path to source models directory'
	}
	
	static dir = { 
		type: 'string', 
		default: 'snapshots/core',
		help: 'Path to output snapshots directory'
	}

	/**

	 * @param {Partial<GalleryRenderIntent> | Record<string, any>} [data={}]

	 * @param {import('@nan0web/types').ModelOptions} [options={}]

	 */

	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} */ this.dataDir
		/** @type {string} */ this.dir
	}

	async *run() {
		yield show(this._.t(GalleryRenderIntent.UI.rendering, { dataDir: this.dataDir, dir: this.dir }))
		
		const snapshotRunner = new SnapshotRunner({
			dataDir: this.dataDir,
			snapshotsDir: this.dir,
			getCategory: (comp) => {
				const groups = {
					Actions: ['Button', 'Toggle'],
					Forms: ['Input', 'Select', 'Slider', 'Autocomplete', 'Color', 'Shadow'],
					Data: ['Accordion', 'Card', 'Sortable', 'Table', 'Tree', 'CodeBlock', 'Markdown', 'Badge'],
					Feedback: ['Alert', 'Confirm', 'Modal', 'ProgressBar', 'Spinner', 'Toast'],
					System: ['LangSelect', 'ThemeToggle'],
				}
				for (const [cat, comps] of Object.entries(groups)) {
					if (comps.includes(comp)) return cat
				}
				return 'Other'
			}
		}, this._)

		try {
			const res = yield* snapshotRunner.run()
			if (res.data && res.data.success) {
				yield show(this._.t(GalleryRenderIntent.UI.success, {}))
			} else {
				yield show(this._.t(GalleryRenderIntent.UI.failed, { error: 'Audit failed' }), 'error')
				return result({ status: 'error' })
			}
		} catch (error) {
			yield show(this._.t(GalleryRenderIntent.UI.failed, { error: /** @type {Error} */ (error).message }), 'error')
			return result({ status: 'error' })
		}
	}
}

export default GalleryRenderIntent

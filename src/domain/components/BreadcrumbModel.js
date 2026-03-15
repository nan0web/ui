import { resolveDefaults } from '@nan0web/types'

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label  - Human-readable display name (e.g. "Sandbox", "Кнопка")
 * @property {string} path   - URL-safe segment (e.g. "sandbox", "button")
 */

/**
 * @typedef {Object} BreadcrumbData
 * @property {BreadcrumbItem[]} [items]
 * @property {string} [separator]
 */

/**
 * Model-as-Schema for Breadcrumb navigation.
 *
 * Each breadcrumb item has a `label` (display) and a `path` (URL segment).
 * The full path is the join of all segments, mirroring both:
 *   - Web URL:  /sandbox/button/export
 *   - FS data:  data/sandbox/button/export/index.yaml
 *   - CLI nav:  🏖 Sandbox › Button › Export
 *
 * This is the universal "where am I?" model for any OLMUI application.
 *
 * ESC/Back = pop() one item. Empty stack = app exit.
 * Ctrl+C   = always exit (adapter responsibility).
 */
export class BreadcrumbModel {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static items = {
		help: 'Navigation path segments forming the breadcrumb trail',
		type: 'array',
		default: [],
	}

	static separator = {
		help: 'Visual separator between breadcrumb segments',
		default: '›',
		type: 'string',
	}

	/** @type {BreadcrumbItem[]} */ items = [];
	/** @type {string} */ separator = '›';

	/**
	 * @param {BreadcrumbData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(BreadcrumbModel, data))
		// Normalize: if items were passed as plain strings, convert to {label, path}
		if (Array.isArray(this.items)) {
			this.items = this.items.map((item) =>
				typeof item === 'string'
					? { label: item, path: BreadcrumbModel.slugify(item) }
					: item
			)
		}
	}

	// ==========================================
	// 2. NAVIGATION API (Imperative)
	// ==========================================

	/**
	 * Push a new level onto the navigation stack.
	 *
	 * @param {string} label - Display label (e.g. "Button", "Кнопка")
	 * @param {string} [path] - URL segment. Auto-slugified from label if omitted.
	 * @returns {this}
	 */
	push(label, path) {
		this.items.push({
			label,
			path: path || BreadcrumbModel.slugify(label),
		})
		return this
	}

	/**
	 * Pop the last level from the navigation stack.
	 *
	 * @returns {BreadcrumbItem|undefined} The removed item, or undefined if stack was empty.
	 */
	pop() {
		return this.items.pop()
	}

	/**
	 * Whether the user can navigate back (stack has > 0 items after pop).
	 *
	 * @returns {boolean}
	 */
	canGoBack() {
		return this.items.length > 1
	}

	/**
	 * Navigate to a specific depth by truncating the stack.
	 *
	 * @param {number} depth - Target depth (0 = root only).
	 * @returns {this}
	 */
	navigateTo(depth) {
		this.items = this.items.slice(0, depth + 1)
		return this
	}

	// ==========================================
	// 3. PATH / URL API (Serialization)
	// ==========================================

	/**
	 * Full URL-style path: `/sandbox/button/export`
	 * @returns {string}
	 */
	get path() {
		if (this.items.length === 0) return '/'
		return '/' + this.items.map((i) => i.path).join('/')
	}

	/**
	 * Just the path segments array: `['sandbox', 'button', 'export']`
	 * @returns {string[]}
	 */
	get segments() {
		return this.items.map((i) => i.path)
	}

	/**
	 * Just the display labels: `['Sandbox', 'Button', 'Export']`
	 * @returns {string[]}
	 */
	get labels() {
		return this.items.map((i) => i.label)
	}

	/**
	 * Current (last) breadcrumb item.
	 * @returns {BreadcrumbItem|undefined}
	 */
	get current() {
		return this.items[this.items.length - 1]
	}

	/**
	 * Current navigation depth (0 = no items).
	 * @returns {number}
	 */
	get depth() {
		return this.items.length
	}

	/**
	 * Display string: `Sandbox › Button › Export`
	 * @returns {string}
	 */
	toString() {
		return this.labels.join(` ${this.separator} `)
	}

	/**
	 * Serialize to URL query param value: `sandbox/button/export`
	 * @returns {string}
	 */
	toURL() {
		return this.segments.join('/')
	}

	/**
	 * Filesystem data path: `data/sandbox/button/export/index.yaml`
	 * @param {string} [filename='index.yaml'] - Leaf filename.
	 * @returns {string}
	 */
	toDataPath(filename = 'index.yaml') {
		if (this.items.length === 0) return `data/${filename}`
		return `data/${this.segments.join('/')}/${filename}`
	}

	/**
	 * Reconstruct a BreadcrumbModel from a URL path string.
	 *
	 * @param {string} urlPath - e.g. "/sandbox/button" or "sandbox/button"
	 * @param {Record<string,string>} [labelMap={}] - Optional map of path→label for display names.
	 * @returns {BreadcrumbModel}
	 */
	static fromPath(urlPath, labelMap = {}) {
		const segments = urlPath
			.replace(/^\//, '')
			.split('/')
			.filter(Boolean)

		const items = segments.map((seg) => ({
			label: labelMap[seg] || seg,
			path: seg,
		}))

		return new BreadcrumbModel({ items })
	}

	/**
	 * Create a URL-safe slug from any label.
	 * Handles Unicode (Cyrillic, etc.) by lowercasing and replacing spaces/special chars.
	 *
	 * @param {string} label
	 * @returns {string}
	 */
	static slugify(label) {
		return label
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\p{L}\p{N}\-]/gu, '')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
	}

	// ==========================================
	// 4. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	/**
	 * Yields a log intent with the current breadcrumb path.
	 * This is a "display-only" run — it shows the navigation state.
	 */
	async *run() {
		yield /** @type {any} */ ({
			type: 'log',
			level: 'info',
			message: this.toString(),
			component: 'Breadcrumbs',
			model: /** @type {any} */ (this),
		})

		return {
			type: 'result',
			data: {
				path: this.path,
				items: this.items,
				depth: this.depth,
			},
		}
	}
}

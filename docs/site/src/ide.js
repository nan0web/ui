import { LitElement, html, css } from 'lit'
import { saveVariations, loadVariations } from './persistence.js'

/**
 * Master IDE — Sovereign Workbench for @nan0web/ui
 * Premium dark-themed component sandbox with live preview and props editor.
 */
export class MasterIDE extends LitElement {
	static properties = {
		components: { type: Object },
		activeApp: { type: String },
		activeComponent: { type: String, attribute: 'active-component' },
		activeVariant: { type: String },
		editableProps: { type: Object },
		searchQuery: { type: String },
		codeFormat: { type: String },
		lang: { type: String },
		sidebarOpen: { type: Boolean },
	}

	static styles = css`
		:host {
			display: flex;
			height: 100vh;
			font-family: var(--ide-font, 'Inter', system-ui, sans-serif);
		}

		/* ── Sidebar ────────────────────────────── */
		.sidebar {
			width: var(--ide-sidebar-w, 260px);
			min-width: 220px;
			background: var(--ide-surface, #12121a);
			border-right: 1px solid var(--ide-border, rgba(255, 255, 255, 0.06));
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.sidebar-header {
			padding: 20px 18px 14px;
			border-bottom: 1px solid var(--ide-border);
		}
		.logo {
			font-size: 0.7rem;
			font-weight: 700;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: var(--ide-accent, #818cf8);
			margin-bottom: 6px;
		}
		.logo-sub {
			font-size: 0.72rem;
			color: var(--ide-text-muted, #71717a);
		}
		.reset-btn {
			background: transparent;
			border: 1px solid var(--ide-border-bright, rgba(255, 255, 255, 0.12));
			color: var(--ide-text-muted, rgba(255, 255, 255, 0.4));
			border-radius: 6px;
			width: 26px;
			height: 26px;
			font-size: 0.85rem;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: auto;
			flex-shrink: 0;
			transition: all 0.15s;
			padding: 0;
		}
		.reset-btn:hover {
			background: var(--ide-surface-2, #1a1a26);
			color: var(--ide-err, #f87171);
			border-color: var(--ide-err, #f87171);
		}
		.search-box {
			padding: 12px 18px 8px;
			box-sizing: border-box;
		}
		.search-box input {
			width: 100%;
			box-sizing: border-box;
			background: var(--ide-surface-2, #1a1a26);
			border: 1px solid var(--ide-border-bright, rgba(255, 255, 255, 0.12));
			border-radius: 8px;
			padding: 8px 12px;
			font-size: 0.8rem;
			color: var(--ide-text);
			outline: none;
			transition: border-color 0.2s;
			font-family: inherit;
		}
		.search-box input::placeholder {
			color: var(--ide-text-muted);
		}
		.search-box input:focus {
			border-color: var(--ide-accent);
		}

		/* Component List */
		.comp-list {
			flex: 1;
			overflow-y: auto;
			padding: 8px 0;
		}
		.comp-list::-webkit-scrollbar {
			width: 4px;
		}
		.comp-list::-webkit-scrollbar-thumb {
			background: var(--ide-border-bright);
			border-radius: 4px;
		}
		.app-section {
			padding: 0 10px;
			margin-bottom: 4px;
		}
		.app-title {
			font-size: 0.65rem;
			font-weight: 700;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--ide-text-muted);
			padding: 8px 8px 4px;
		}
		.comp-item {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 7px 12px;
			border-radius: 6px;
			cursor: pointer;
			font-size: 0.82rem;
			color: var(--ide-text);
			transition:
				background 0.15s,
				color 0.15s;
		}
		.comp-item:hover {
			background: var(--ide-accent-dim);
		}
		.comp-item.active {
			background: var(--ide-accent-dim);
			color: var(--ide-accent);
			font-weight: 600;
		}
		.comp-dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--ide-accent);
			opacity: 0.4;
			flex-shrink: 0;
		}
		.comp-item.active .comp-dot {
			opacity: 1;
		}

		.app-items {
			display: flex;
			flex-direction: column;
		}

		.app-section:not(.expanded) .app-items {
			display: none;
		}

		.app-title {
			cursor: pointer;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.app-title-arr {
			transition: transform 0.2s;
			font-family: monospace;
		}

		.app-section.expanded .app-title-arr {
			transform: rotate(90deg);
		}

		.comp-count {
			padding: 12px 18px;
			font-size: 0.7rem;
			color: var(--ide-text-muted);
			border-top: 1px solid var(--ide-border);
		}

		/* ── Main Area ──────────────────────────── */
		.main {
			flex: 1;
			display: flex;
			flex-direction: column;
			background: var(--ide-bg, #0a0a0f);
			overflow: hidden;
		}
		.toolbar {
			display: flex;
			align-items: center;
			padding: 14px 24px;
			gap: 16px;
			border-bottom: 1px solid var(--ide-border);
			background: var(--ide-surface);
		}
		.toolbar h2 {
			font-size: 1rem;
			font-weight: 600;
			margin: 0;
		}
		.toolbar .tag-name {
			font-size: 0.78rem;
			color: var(--ide-text-muted);
			background: var(--ide-surface-2);
			padding: 3px 10px;
			border-radius: 20px;
			font-family: 'SF Mono', 'Fira Code', monospace;
		}
		.toolbar .desc {
			flex: 1;
			font-size: 0.78rem;
			color: var(--ide-text-muted);
			text-align: right;
		}

		/* ── Content Split ──────────────────────── */
		.content {
			flex: 1;
			display: flex;
			overflow: hidden;
		}

		/* Preview pane */
		.preview-pane {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.pane-label {
			font-size: 0.65rem;
			font-weight: 700;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--ide-text-muted);
			padding: 12px 20px 8px;
		}
		.preview-area {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 32px;
			overflow: auto;
		}
		.preview-canvas {
			background: var(--ide-surface);
			border: 1px solid var(--ide-border-bright);
			border-radius: var(--ide-radius, 10px);
			padding: 32px;
			min-width: 300px;
			max-width: 600px;
			width: 100%;
			box-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
		}

		/* Props Editor pane */
		.props-pane {
			width: 320px;
			min-width: 280px;
			flex-shrink: 0;
			box-sizing: border-box;
			background: var(--ide-surface);
			border-left: 1px solid var(--ide-border);
			display: flex;
			flex-direction: column;
			overflow-x: hidden;
		}
		.props-scroll {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
			padding: 8px 16px 16px;
		}
		.props-scroll::-webkit-scrollbar {
			width: 4px;
		}
		.props-scroll::-webkit-scrollbar-thumb {
			background: var(--ide-border-bright);
			border-radius: 4px;
		}

		.variants-list {
			display: flex;
			gap: 0;
			padding: 0 24px;
			border-bottom: 1px solid var(--ide-border);
			background: var(--ide-surface);
			overflow-x: auto;
			align-items: stretch;
		}
		.variant-pill {
			padding: 8px 14px;
			border-radius: 0;
			font-size: 0.75rem;
			font-weight: 600;
			background: transparent;
			border: none;
			border-right: 1px solid var(--ide-border);
			color: var(--ide-text-muted);
			cursor: pointer;
			white-space: nowrap;
			transition: all 0.2s;
			border-bottom: 2px solid transparent;
		}
		.variant-pill:hover {
			color: var(--ide-text);
			background: var(--ide-surface-2);
		}
		.variant-pill.active {
			background: var(--ide-accent-dim);
			color: var(--ide-accent);
			border-bottom: 2px solid var(--ide-accent);
		}
		.variant-pill.add-btn {
			background: transparent;
			border-right: none;
			border-bottom: 2px solid transparent;
			color: var(--ide-text-muted);
		}
		.variant-pill.add-btn:hover {
			color: var(--ide-accent);
			background: var(--ide-surface-2);
		}

		/* Code Snippet */
		.code-pane {
			background: var(--ide-code-bg);
			color: var(--ide-text);
			border-top: 1px solid var(--ide-border);
			display: flex;
			flex-direction: column;
		}
		.code-tabs {
			display: flex;
			background: var(--ide-code-tabs-bg);
			border-bottom: 1px solid var(--ide-border-bright);
		}
		.code-tab {
			padding: 6px 16px;
			font-size: 0.72rem;
			text-transform: uppercase;
			color: var(--ide-text-muted);
			cursor: pointer;
			background: transparent;
			border: none;
			border-right: 1px solid var(--ide-border-bright);
			border-radius: 0;
			font-family: inherit;
			font-weight: 600;
			line-height: 1;
		}
		.code-tab.active {
			background: var(--ide-code-bg);
			color: var(--ide-text);
			box-shadow: inset 0 2px 0 var(--ide-accent);
		}
		.code-copy {
			margin-left: auto;
			padding: 6px 12px;
			font-size: 0.72rem;
			cursor: pointer;
			background: transparent;
			color: var(--ide-accent);
			border: none;
		}
		.code-copy:hover {
			text-decoration: underline;
		}
		.code-content {
			margin: 0;
			padding: 16px;
			font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
			font-size: 0.82rem;
			overflow-x: auto;
			white-space: pre;
		}

		.theme-select {
			background: transparent;
			border: 1px solid var(--ide-border-bright);
			color: var(--ide-text-muted);
			padding: 4px 8px;
			border-radius: 6px;
			font-size: 0.75rem;
			font-family: inherit;
		}
		.prop-group {
			margin-bottom: 14px;
		}
		.prop-label {
			font-size: 0.72rem;
			font-weight: 600;
			color: var(--ide-text-muted);
			margin-bottom: 5px;
			font-family: 'SF Mono', 'Fira Code', monospace;
			word-wrap: break-word;
			white-space: normal;
		}
		.prop-input {
			width: 100%;
			box-sizing: border-box;
			background: var(--ide-surface-2);
			border: 1px solid var(--ide-border);
			color: var(--ide-text);
			border-radius: 4px;
			padding: 6px 8px;
			font-family: 'SF Mono', 'Fira Code', monospace;
			font-size: 0.72rem;
			outline: none;
			transition: border-color 0.2s;
		}
		.prop-input:focus {
			border-color: var(--ide-accent);
		}
		.prop-color-group {
			display: flex;
			box-sizing: border-box;
			gap: 8px;
			align-items: center;
		}
		.prop-select {
			width: 100%;
			background: var(--ide-surface-2);
			border: 1px solid var(--ide-border-bright);
			border-radius: 6px;
			padding: 7px 10px;
			font-size: 0.82rem;
			color: var(--ide-text);
			outline: none;
			font-family: inherit;
			cursor: pointer;
		}
		.prop-select:focus {
			border-color: var(--ide-accent);
		}

		.prop-toggle {
			display: flex;
			align-items: center;
			gap: 8px;
			cursor: pointer;
		}
		.prop-toggle input[type='checkbox'] {
			appearance: none;
			width: 34px;
			height: 18px;
			background: var(--ide-surface-2);
			border: 1px solid var(--ide-border-bright);
			border-radius: 10px;
			position: relative;
			cursor: pointer;
			transition: background 0.2s;
		}
		.prop-toggle input[type='checkbox']::after {
			content: '';
			position: absolute;
			top: 2px;
			left: 2px;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: var(--ide-text-muted);
			transition:
				transform 0.2s,
				background 0.2s;
		}
		.prop-toggle input[type='checkbox']:checked {
			background: var(--ide-accent);
			border-color: var(--ide-accent);
		}
		.prop-toggle input[type='checkbox']:checked::after {
			transform: translateX(16px);
			background: white;
		}
		.prop-toggle span {
			font-size: 0.78rem;
			color: var(--ide-text-muted);
		}

		.btn-reset {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			margin-top: 8px;
			padding: 6px 14px;
			font-size: 0.75rem;
			font-weight: 600;
			background: transparent;
			border: 1px solid var(--ide-border-bright);
			border-radius: 6px;
			color: var(--ide-text-muted);
			cursor: pointer;
			font-family: inherit;
			transition:
				color 0.15s,
				border-color 0.15s;
		}
		.btn-reset:hover {
			color: var(--ide-accent);
			border-color: var(--ide-accent);
		}

		/* ── Mobile Layout ─────────────────────── */
		.sidebar-toggle {
			display: none;
			position: fixed;
			bottom: 16px;
			right: 16px;
			z-index: 100;
			background: var(--ide-surface);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			border: 1px solid var(--ide-border-bright);
			border-radius: 12px;
			padding: 10px 14px;
			color: var(--ide-text);
			font-size: 1.2rem;
			cursor: pointer;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
			transition: background 0.15s;
			opacity: 0.85;
		}
		.sidebar-toggle:hover {
			background: var(--ide-accent-dim);
			opacity: 1;
		}
		.add-btn-text {
			margin-left: 4px;
		}

		.sidebar-backdrop {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 49;
			background: rgba(0, 0, 0, 0.5);
		}

		@media (max-width: 768px) {
			:host {
				flex-direction: column;
			}
			.sidebar-toggle {
				display: block;
			}
			.add-btn-text {
				display: none;
			}
			.sidebar {
				position: fixed;
				top: 0;
				left: 0;
				bottom: 0;
				z-index: 50;
				transform: translateX(-100%);
				transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: none;
			}
			.sidebar.open {
				transform: translateX(0);
				box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
			}
			.sidebar-backdrop.visible {
				display: block;
			}
			.content {
				flex-direction: column;
			}
			.props-pane {
				width: 100%;
				min-width: 0;
				border-left: none;
				border-top: 1px solid var(--ide-border);
				max-height: 40vh;
			}
			.preview-canvas {
				min-width: auto;
				max-width: 100%;
			}
			.preview-area {
				padding: 16px;
			}
			.toolbar {
				padding: 14px 24px 14px 52px;
			}
			.toolbar .desc {
				display: none;
			}
			.variants-list {
				padding: 0;
				flex-wrap: wrap;
			}
		}

		@media (max-width: 480px) {
			.toolbar h2 {
				font-size: 0.88rem;
			}
			.toolbar .tag-name {
				display: none;
			}
		}

		/* ── Modal ───────────────────────────────── */
		.modal-overlay {
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.6);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 9999;
			backdrop-filter: blur(4px);
		}
		.ide-modal {
			background: var(--ide-surface, #12121a);
			border: 1px solid var(--ide-border-bright, rgba(255, 255, 255, 0.12));
			border-radius: 12px;
			padding: 24px;
			min-width: 320px;
			max-width: 420px;
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		}
		.modal-message {
			margin: 0 0 16px;
			font-size: 0.9rem;
			color: var(--ide-text, #fff);
		}
		.modal-input {
			width: 100%;
			padding: 8px 12px;
			border: 1px solid var(--ide-border-bright, rgba(255, 255, 255, 0.12));
			border-radius: 6px;
			background: var(--ide-bg, #0a0a0f);
			color: var(--ide-text, #fff);
			font-size: 0.85rem;
			font-family: inherit;
			outline: none;
			margin-bottom: 16px;
			box-sizing: border-box;
		}
		.modal-input:focus {
			border-color: var(--ide-accent, #0099dc);
			box-shadow: 0 0 0 2px var(--ide-accent-dim, rgba(0, 153, 220, 0.15));
		}
		.modal-buttons {
			display: flex;
			justify-content: flex-end;
			gap: 8px;
		}
		.modal-buttons button {
			padding: 6px 16px;
			border-radius: 6px;
			border: 1px solid var(--ide-border-bright);
			cursor: pointer;
			font-family: inherit;
			font-size: 0.8rem;
			font-weight: 600;
		}
		.modal-cancel {
			background: transparent;
			color: var(--ide-text-muted, rgba(255, 255, 255, 0.6));
		}
		.modal-cancel:hover {
			background: var(--ide-surface-2, #1a1a26);
		}
		.modal-ok {
			background: var(--ide-accent, #0099dc);
			color: #fff;
			border-color: var(--ide-accent, #0099dc);
		}
		.modal-ok:hover {
			filter: brightness(1.1);
		}
		.modal-danger {
			background: var(--ide-err, #f87171);
			border-color: var(--ide-err, #f87171);
		}
		.modal-danger:hover {
			filter: brightness(1.1);
		}

		/* ── Theme Variables ──────────────────────── */
		:host {
			--ide-bg: #0a0a0f;
			--ide-surface: #12121a;
			--ide-surface-2: #1a1a26;
			--ide-border: rgba(255, 255, 255, 0.06);
			--ide-border-bright: rgba(255, 255, 255, 0.12);
			--ide-text: #fff;
			--ide-text-muted: rgba(255, 255, 255, 0.6);
			--ide-accent: #0099dc;
			--ide-accent-dim: rgba(0, 153, 220, 0.15);
			--ide-err: #f87171;
			--ide-code-bg: #1e1e1e;
			--ide-code-tabs-bg: #252526;

			/* Propagate dark fallbacks to UI components */
			--ba: var(--ide-surface);
			--ba-surface: var(--ide-surface-2);
			--fg: var(--ide-text);
			--fg-dim: var(--ide-text-muted);
			--border: var(--ide-border-bright);
			--co-text: var(--ide-text);
			--co: var(--ide-accent);
		}

		:host(.theme-light) {
			--ide-bg: #f8f9fa;
			--ide-surface: #ffffff;
			--ide-surface-2: #f1f3f5;
			--ide-border: rgba(0, 0, 0, 0.08);
			--ide-border-bright: rgba(0, 0, 0, 0.12);
			--ide-text: #212529;
			--ide-text-muted: rgba(0, 0, 0, 0.5);
			--ide-accent: #0099dc;
			--ide-accent-dim: rgba(0, 153, 220, 0.1);
			--ide-err: #dc2626;
			--ide-code-bg: #f6f8fa;
			--ide-code-tabs-bg: #ebedf0;

			/* Propagate to UI components too */
			--ba: var(--ide-surface);
			--ba-surface: var(--ide-surface-2);
			--fg: var(--ide-text);
			--fg-dim: var(--ide-text-muted);
			--border: var(--ide-border-bright);
			--co-text: var(--ide-text);
			--co: var(--ide-accent);
			--ui-code-bg: var(--ide-surface);
		}
	`

	/** @type {Map<string, Set<string>>} Snapshot of built-in variant names per component */
	_builtInVariantNames = new Map()

	/** i18n translations for IDE UI labels */
	static _i18n = {
		uk: {
			preview: 'Попередній перегляд',
			properties: 'Властивості',
			reset: 'Скинути',
			resetIde: 'Скинути IDE',
			resetConfirm: 'Скинути всі налаштування IDE? (тема, варіації, секції)',
			resetToDefault: 'Скинути до початкових',
			copyCode: 'Копіювати код',
			addVariation: 'Додати варіацію',
			selectComponent: 'Оберіть компонент',
		},
		en: {
			preview: 'Preview',
			properties: 'Properties',
			reset: 'Reset',
			resetIde: 'Reset IDE',
			resetConfirm: 'Reset all IDE settings? (theme, variations, sections)',
			resetToDefault: 'Reset to defaults',
			copyCode: 'Copy code',
			addVariation: 'Add variation',
			selectComponent: 'Select a component',
		},
	}

	/** Get translated string */
	_t(key) {
		const lang = this.lang === 'en' ? 'en' : 'uk'
		return MasterIDE._i18n[lang]?.[key] || MasterIDE._i18n.uk[key] || key
	}

	constructor() {
		super()
		this.components = {}
		this.activeApp = 'Core'
		this.activeComponent = 'Alert'
		this.activeVariant = null
		this.editableProps = {}
		this.searchQuery = ''
		this.theme = localStorage.getItem('ui-theme') || 'auto'
		this.codeFormat = localStorage.getItem('ui-code-format') || 'html'
		this.lang = 'uk'
		this.sidebarOpen = false
		const savedSections = localStorage.getItem('ui-open-sections')
		this._openSections = new Set(savedSections ? JSON.parse(savedSections) : ['Core'])

		window.addEventListener('manifest-updated', (e) => {
			this.components = structuredClone(e.detail)
			this._snapshotBuiltInVariants()
			this._syncFromUrl()
			this._syncProps()
			this._restoreVariationsForActive()
		})
		window.addEventListener('popstate', () => {
			this._syncFromUrl()
		})
	}

	connectedCallback() {
		super.connectedCallback()
		this._checkReset()
		this.components = window.uiLitApp?.componentsManifests || {}
		this._snapshotBuiltInVariants()

		this._syncFromUrl()
		this._applyTheme(this.theme)
	}

	_syncFromUrl() {
		// Regex: /([^/]+)/([^/]+)/([^/.]+)\.html (category-aware URL pattern)
		let match = window.location.pathname.match(RegExp('/([^/]+)/([^/]+)/([^/.]+)\.html$'))
		if (match) {
			this.lang = match[1]
			const category = match[2]
			if (this.activeComponent !== match[3]) {
				this.activeVariant = null
			}
			this.activeComponent = match[3]

			// Find and expand the section that contains the active component
			for (const [app, manifest] of Object.entries(this.components)) {
				if (manifest[this.activeComponent]) {
					this.activeApp = app
					if (!this._openSections.has(app)) {
						this._openSections.add(app)
						localStorage.setItem('ui-open-sections', JSON.stringify([...this._openSections]))
					}
				}
			}
		} else {
			// Fallback: try /{lang}/{Component}.html (legacy)
			match = window.location.pathname.match(/\/([^/]+)\/([^/.]+)\.html$/)
			if (match) {
				this.lang = match[1]
				if (this.activeComponent !== match[2]) {
					this.activeVariant = null
				}
				this.activeComponent = match[2]

				for (const [app, manifest] of Object.entries(this.components)) {
					if (manifest[this.activeComponent]) {
						this.activeApp = app
						if (!this._openSections.has(app)) {
							this._openSections.add(app)
							localStorage.setItem('ui-open-sections', JSON.stringify([...this._openSections]))
						}
					}
				}
			}
		}
		this._syncProps()
		this._restoreVariationsForActive()
		this._scrollToActive()
	}

	_toggleSection(app) {
		if (this._openSections.has(app)) {
			this._openSections.delete(app)
		} else {
			this._openSections.add(app)
		}
		localStorage.setItem('ui-open-sections', JSON.stringify([...this._openSections]))
		this.requestUpdate()
	}

	_scrollToActive() {
		setTimeout(() => {
			const activeEl = this.shadowRoot?.querySelector('.comp-item.active')
			if (activeEl) {
				activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		}, 100)
	}

	/** Snapshot which variant names are built-in so we never confuse them with custom ones */
	_snapshotBuiltInVariants() {
		for (const [, manifest] of Object.entries(this.components)) {
			for (const [name, meta] of Object.entries(manifest)) {
				if (!this._builtInVariantNames.has(name)) {
					this._builtInVariantNames.set(name, new Set((meta.variants || []).map((v) => v.name)))
				}
			}
		}
	}

	_applyTheme(theme) {
		this.theme = theme
		localStorage.setItem('ui-theme', theme)

		const isDark =
			theme === 'dark' ||
			(theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

		if (isDark) {
			document.body.className = 'theme-dark'
			this.classList.remove('theme-light')
			this.classList.add('theme-dark')
		} else {
			document.body.className = 'theme-light'
			this.classList.remove('theme-dark')
			this.classList.add('theme-light')
		}
	}

	_syncProps() {
		const meta = this._activeMeta
		if (meta) {
			this.editableProps = { ...meta.defaultProps }
		}
	}

	get _activeMeta() {
		const app = this.components[this.activeApp]
		return app?.[this.activeComponent] || null
	}

	get _filteredComponents() {
		const q = this.searchQuery.toLowerCase()
		const result = {}
		for (const [app, manifest] of Object.entries(this.components)) {
			const filtered = Object.entries(manifest).filter(
				([name, meta]) =>
					name.toLowerCase().includes(q) ||
					meta.description?.toLowerCase().includes(q) ||
					meta.tag?.toLowerCase().includes(q) ||
					meta.searchTags?.toLowerCase().includes(q),
			)
			if (filtered.length > 0) result[app] = Object.fromEntries(filtered)
		}
		return result
	}

	get _totalCount() {
		return Object.values(this.components).reduce((s, m) => s + Object.keys(m).length, 0)
	}

	_selectComponent(app, name) {
		if (this.activeComponent === name) return
		this.activeApp = app
		const newUrl = `../../${this.activeApp}/${name}.html`
		history.pushState(null, '', newUrl)
		this._syncFromUrl()
		this.sidebarOpen = false
	}

	_loadVariant(name, variantProps) {
		this.activeVariant = name
		// Replace current editable props with the ones defined in the variant
		this.editableProps = { ...this._activeMeta?.defaultProps, ...variantProps }

		const meta = this._activeMeta
		if (meta && meta.variants) {
			const index = meta.variants.findIndex((v) => v.name === name)
			if (index >= 0) {
				const newUrl = `../../${this.activeApp}/${this.activeComponent}.html#var${index + 1}`
				history.replaceState(null, '', newUrl)
			}
		}
	}

	_onPropChange(key, value) {
		this.editableProps = { ...this.editableProps, [key]: value }

		// Sync changes to the active variant
		if (this.activeVariant) {
			const meta = this._activeMeta
			const variant = meta.variants?.find((v) => v.name === this.activeVariant)
			if (variant) {
				variant.props = { ...this.editableProps }

				// Automatically persist custom variations on change
				if (!this._builtInVariantNames.get(this.activeComponent)?.has(this.activeVariant)) {
					this._persistVariations()
				}
			}
		}
	}

	_resetProps() {
		this.activeVariant = null
		const meta = this._activeMeta
		if (meta) this.editableProps = { ...meta.defaultProps }
	}

	async _saveVariant() {
		const name = await this._showModal('Назва варіації:')
		if (!name) return
		const meta = this._activeMeta
		if (!meta.variants) meta.variants = []
		meta.variants.push({ name, props: { ...this.editableProps } })
		this.activeVariant = name
		this._persistVariations()
		// Update URL to point to the new variant: #varN
		const index = meta.variants.length
		const newUrl = `${window.location.pathname}#var${index}`
		history.replaceState(null, '', newUrl)
		this.requestUpdate()
	}

	async _renameVariant(oldName) {
		const newName = await this._showModal('Нова назва варіації:', oldName)
		if (!newName || newName === oldName) return

		const meta = this._activeMeta
		if (!meta) return

		const v = meta.variants?.find((v) => v.name === oldName)
		if (v) v.name = newName

		if (this.activeVariant === oldName) {
			this.activeVariant = newName
		}
		this._persistVariations()
		this.requestUpdate()
	}

	async _deleteVariant(name) {
		const ok = await this._showConfirm(`Delete variation "${name}"?`)
		if (!ok) return
		const meta = this._activeMeta
		if (!meta) return
		meta.variants = (meta.variants || []).filter((v) => v.name !== name)
		if (this.activeVariant === name) {
			this._resetProps()
		}
		this._persistVariations()
		this.requestUpdate()
	}

	/** Persist custom (non-built-in) variations to IndexedDB */
	async _persistVariations() {
		const meta = this._activeMeta
		if (!meta) return
		const builtInNames = this._builtInVariantNames.get(this.activeComponent) || new Set()
		const custom = (meta.variants || []).filter((v) => !builtInNames.has(v.name))
		await saveVariations(this.activeComponent, custom)
	}

	/** Restore persisted variations from IndexedDB for the active component */
	async _restoreVariationsForActive() {
		const meta = this._activeMeta
		if (!meta) return
		try {
			const saved = await loadVariations(this.activeComponent)
			if (saved.length > 0) {
				// Migrate legacy prop names: label → content
				for (const v of saved) {
					if (v.props && 'label' in v.props) {
						if (!v.props.content) v.props.content = v.props.label
						delete v.props.label
					}
				}
				const builtInNames = this._builtInVariantNames.get(this.activeComponent) || new Set()
				// Keep existing variants that are built-in, then add saved custom ones
				const builtIn = (meta.variants || []).filter((v) => builtInNames.has(v.name))
				meta.variants = [...builtIn, ...saved.filter((v) => !builtInNames.has(v.name))]
			}
		} catch {
			// IndexedDB unavailable — silently degrade
		}

		// Map hash back to variation if present
		if (window.location.hash) {
			const slug = decodeURIComponent(window.location.hash.substring(1))
			let targetVariant = null
			if (slug.startsWith('var')) {
				const index = parseInt(slug.substring(3), 10) - 1 // #var1 is index 0
				if (!isNaN(index) && index >= 0 && index < (meta.variants?.length || 0)) {
					targetVariant = meta.variants[index]
				}
			}
			if (!targetVariant && meta.variants) {
				targetVariant = meta.variants.find(
					(v) => v.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase(),
				)
			}
			if (targetVariant && this.activeVariant !== targetVariant.name) {
				this.activeVariant = targetVariant.name
				this.editableProps = { ...meta.defaultProps, ...targetVariant.props }
			}
		}
		this.requestUpdate()
	}

	_generateCode(meta) {
		const activeProps = Object.entries(this.editableProps).filter(
			([k, v]) => v !== undefined && v !== '' && v !== false,
		)

		if (this.codeFormat === 'yaml') {
			const contentKeys = new Set(['content', 'text', 'label'])
			const propsWithoutContent = activeProps.filter(([k]) => !contentKeys.has(k))
			const yamlContent =
				this.editableProps.content || this.editableProps.label || this.editableProps.text

			if (propsWithoutContent.length === 0 && !yamlContent) {
				return `- ${this.activeComponent}: true`
			}

			let res = `- ${this.activeComponent}:\n`

			for (const [k, v] of propsWithoutContent) {
				res += `      ${k}: ${typeof v === 'string' ? '"' + v + '"' : JSON.stringify(v)}\n`
			}
			if (yamlContent) {
				res += `      content: |\n        ${yamlContent.replace(/\n/g, '\n        ')}\n`
			}
			return res.trimEnd()
		}

		// NaN0 Spec — shorthand format: - Component: contentValue + $prop: val
		if (this.codeFormat === 'nan0') {
			const contentKeys = new Set(['content', 'text', 'label'])
			const propsWithoutContent = activeProps.filter(([k]) => !contentKeys.has(k))
			const nan0Content =
				this.editableProps.content || this.editableProps.label || this.editableProps.text

			if (propsWithoutContent.length === 0 && !nan0Content) {
				return `- ${this.activeComponent}: true`
			}

			// Element value = content (or label/text fallback)
			let res = nan0Content
				? `- ${this.activeComponent}: ${nan0Content.includes('\n') ? '|\n    ' + nan0Content.replace(/\n/g, '\n    ') : nan0Content}\n`
				: `- ${this.activeComponent}:\n`

			// $-prefixed props — bare values, no quotes
			for (const [k, v] of propsWithoutContent) {
				const val = typeof v === 'boolean' || typeof v === 'number' ? v : v
				res += `  \$${k}: ${val}\n`
			}
			return res.trimEnd()
		}

		// HTML
		const contentKeys = new Set(['content', 'text', 'label'])
		let attrs = activeProps
			.filter(([k]) => !contentKeys.has(k))
			.map(([k, v]) => {
				if (v === true) return k
				if (typeof v === 'object') return `.${k}='${JSON.stringify(v)}'`
				return `${k}="${v}"`
			})
			.join(' ')
		const htmlContent =
			this.editableProps.content || this.editableProps.label || this.editableProps.text || ''
		return `<${meta.tag}${attrs ? ' ' + attrs : ''}>${htmlContent ? '\n  ' + htmlContent.replace(/\n/g, '\n  ') + '\n' : ''}</${meta.tag}>`
	}

	_copyCode(code) {
		navigator.clipboard.writeText(code)
		alert('Код скопійовано!')
	}

	_renderPreview() {
		const meta = this._activeMeta
		if (!meta)
			return html`<div style="color: var(--ide-text-muted)">${this._t('selectComponent')}</div>`

		const el = document.createElement(meta.tag)
		for (const [k, v] of Object.entries(this.editableProps)) {
			// Map content → label for DOM (web components use label as their text prop)
			const prop = k === 'content' ? 'label' : k
			el[prop] = v
		}
		return html`${el}`
	}

	_renderPropEditor(key, value, typeDef) {
		const propType = typeDef || typeof value

		// Boolean
		if (propType === 'boolean' || typeof value === 'boolean') {
			return html` <div class="prop-group">
				<label class="prop-toggle">
					<input
						type="checkbox"
						.checked=${!!value}
						@change=${(e) => this._onPropChange(key, e.target.checked)}
					/>
					<span>${key}</span>
				</label>
			</div>`
		}
		// Enum (array of options)
		if (Array.isArray(typeDef)) {
			return html` <div class="prop-group">
				<div class="prop-label">${key}</div>
				<select class="prop-select" @change=${(e) => this._onPropChange(key, e.target.value)}>
					${typeDef.map(
						(opt) => html` <option value=${opt} ?selected=${value === opt}>${opt}</option> `,
					)}
				</select>
			</div>`
		}
		// Number
		if (propType === 'number' || typeof value === 'number') {
			return html` <div class="prop-group">
				<div class="prop-label">${key}</div>
				<input
					class="prop-input"
					type="number"
					.value=${String(value)}
					@input=${(e) => this._onPropChange(key, Number(e.target.value))}
				/>
			</div>`
		}
		// Array / Object / Models — show as JSON
		const isModel =
			typeof typeDef === 'string' &&
			(typeDef.endsWith('[]') ||
				typeDef.includes('Model') ||
				typeDef === 'array' ||
				typeDef === 'object')
		if (isModel || Array.isArray(value) || (typeof value === 'object' && value !== null)) {
			return html` <div class="prop-group">
				<div class="prop-label">${key}</div>
				<textarea
					class="prop-input"
					rows="3"
					.value=${JSON.stringify(value, null, 2)}
					@input=${(e) => {
						try {
							this._onPropChange(key, JSON.parse(e.target.value))
						} catch (_) {
							/* ignore parse errors while typing */
						}
					}}
					style="font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.75rem; resize: vertical;"
				></textarea>
			</div>`
		}
		// Textarea
		if (typeDef === 'text' || (typeof typeDef === 'string' && typeDef.startsWith('text/'))) {
			return html` <div class="prop-group">
				<div class="prop-label">${key}</div>
				<textarea
					class="prop-input"
					rows="4"
					.value=${value ?? ''}
					@input=${(e) => this._onPropChange(key, e.target.value)}
					style="resize: vertical;"
				></textarea>
			</div>`
		}
		// Color picker
		if (typeDef === 'color' || key.toLowerCase().includes('color')) {
			return html` <div class="prop-group">
				<div class="prop-label">${key}</div>
				<div style="display: flex; gap: 8px; align-items: center;">
					<input
						type="color"
						.value=${value || '#818cf8'}
						@input=${(e) => this._onPropChange(key, e.target.value)}
						style="width: 32px; height: 32px; padding: 0; border: none; border-radius: 4px; overflow: hidden; cursor: pointer;"
					/>
					<input
						class="prop-input"
						type="text"
						.value=${value ?? ''}
						@input=${(e) => this._onPropChange(key, e.target.value)}
						style="flex: 1;"
					/>
				</div>
			</div>`
		}

		// String (default)
		return html` <div class="prop-group">
			<div class="prop-label">${key}</div>
			<input
				class="prop-input"
				type="text"
				.value=${value ?? ''}
				@input=${(e) => this._onPropChange(key, e.target.value)}
			/>
		</div>`
	}

	render() {
		const meta = this._activeMeta
		const filtered = this._filteredComponents

		return html`
			<!-- Mobile sidebar toggle -->
			<button
				class="sidebar-toggle"
				@click=${() => (this.sidebarOpen = !this.sidebarOpen)}
				aria-label="Toggle sidebar"
			>
				☰
			</button>
			<div
				class="sidebar-backdrop ${this.sidebarOpen ? 'visible' : ''}"
				@click=${() => (this.sidebarOpen = false)}
			></div>

			<!-- Sidebar -->
			<aside class="sidebar ${this.sidebarOpen ? 'open' : ''}">
				<div class="sidebar-header">
					<div style="display: flex; align-items: center; gap: 8px;">
						<svg
							width="24"
							height="34"
							viewBox="0 0 90 129"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M76.4278 84.3649L45 52.6774L45 39L90 84.3719L45 129L45 115.533L76.4278 84.3649Z"
								fill="url(#paint0_linear_955_5)"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M13.5722 45.3649L45 13.6774L45 0L-4.63075e-07 45.3719L45 90L45 76.533L13.5722 45.3649Z"
								fill="url(#paint1_linear_955_5)"
							/>
							<defs>
								<linearGradient
									id="paint0_linear_955_5"
									x1="67.5"
									y1="39"
									x2="67.5"
									y2="129"
									gradientUnits="userSpaceOnUse"
								>
									<stop offset="0.27" stop-color="var(--ide-accent)" />
									<stop offset="1" stop-color="currentColor" />
								</linearGradient>
								<linearGradient
									id="paint1_linear_955_5"
									x1="22.5"
									y1="0"
									x2="22.5"
									y2="90"
									gradientUnits="userSpaceOnUse"
								>
									<stop stop-color="#FAFA09" />
									<stop offset="1" stop-color="#FF0000" />
								</linearGradient>
							</defs>
						</svg>
						<div>
							<div class="logo">NaN•Web</div>
							<div class="logo-sub">Master IDE</div>
						</div>
						<button
							class="reset-btn"
							title="${this._t('resetIde')}"
							@click=${async () => {
								const ok = await this._showConfirm(this._t('resetConfirm'))
								if (ok) window.location.href = window.location.pathname + '?reset=1'
							}}
						>
							↺
						</button>
					</div>
				</div>
				<div class="search-box">
					<input
						type="text"
						placeholder="Пошук компонентів..."
						.value=${this.searchQuery}
						@input=${(e) => {
							this.searchQuery = e.target.value
						}}
					/>
				</div>
				<div class="comp-list">
					${Object.entries(filtered).map(
						([app, manifest], idx) => html`
							<div
								class="app-section ${this._openSections.has(app) || this.searchQuery
									? 'expanded'
									: ''}"
							>
								<div class="app-title" @click=${() => this._toggleSection(app)}>
									${app}
									<span class="app-title-arr">▶</span>
								</div>
								<div class="app-items">
									${Object.entries(manifest).map(
										([name]) => html`
											<div
												class="comp-item ${this.activeApp === app && this.activeComponent === name
													? 'active'
													: ''}"
												@click=${() => this._selectComponent(app, name)}
											>
												<span class="comp-dot"></span>
												${name}
											</div>
										`,
									)}
								</div>
							</div>
						`,
					)}
				</div>
				<div class="comp-count">${this._totalCount} компонентів</div>
			</aside>

			<!-- Main -->
			<main class="main">
				<div class="toolbar">
					<h2>${this.activeComponent}</h2>
					${meta ? html`<span class="tag-name">&lt;${meta.tag}&gt;</span>` : ''}
					${meta ? html`<span class="desc">${meta.description}</span>` : ''}

					<!-- Toolbar Utilities -->
					<div style="display: flex; gap: 8px; align-items: center; margin-left: auto;">
						<ui-lang-select
							.langs=${[
								{ code: 'uk', title: 'Українська' },
								{ code: 'en', title: 'English' },
							]}
							locale=${this.lang}
							@locale-change=${(e) => {
								if (e.detail.locale !== this.lang) {
									this.lang = e.detail.locale
									const newUrl = `../../${this.lang}/${this.activeApp}/${this.activeComponent}.html`
									history.pushState(null, '', newUrl)
									this._syncFromUrl()
								}
							}}
						></ui-lang-select>
						<select class="theme-select" @change=${(e) => this._applyTheme(e.target.value)}>
							<option value="auto" ?selected=${this.theme === 'auto'}>Авто</option>
							<option value="dark" ?selected=${this.theme === 'dark'}>Темна</option>
							<option value="light" ?selected=${this.theme === 'light'}>Світла</option>
						</select>
					</div>
				</div>

				${meta
					? html`
							<div class="variants-list">
								${(meta.variants || []).map(
									(v) => html`
										<div
											class="variant-pill ${this.activeVariant === v.name ? 'active' : ''}"
											@click=${() => this._loadVariant(v.name, v.props)}
										>
											${v.name}
										</div>
									`,
								)}
								<div
									class="variant-pill add-btn"
									@click=${this._saveVariant}
									title="${this._t('addVariation')}"
								>
									+<span class="add-btn-text"> ${this._t('addVariation')}</span>
								</div>
							</div>
						`
					: ''}

				<div class="content">
					<!-- Live Preview -->
					<div class="preview-pane">
						<div class="pane-label">${this._t('preview')}</div>
						<div class="preview-area">
							<div class="preview-canvas">${this._renderPreview()}</div>
						</div>
						${meta
							? html`
									<div class="code-pane">
										<div class="code-tabs">
											<button
												class="code-tab ${this.codeFormat === 'html' ? 'active' : ''}"
												@click=${() => {
													this.codeFormat = 'html'
													localStorage.setItem('ui-code-format', 'html')
												}}
											>
												HTML
											</button>
											<button
												class="code-tab ${this.codeFormat === 'yaml' ? 'active' : ''}"
												@click=${() => {
													this.codeFormat = 'yaml'
													localStorage.setItem('ui-code-format', 'yaml')
												}}
											>
												YAML Spec
											</button>
											<button
												class="code-tab ${this.codeFormat === 'nan0' ? 'active' : ''}"
												@click=${() => {
													this.codeFormat = 'nan0'
													localStorage.setItem('ui-code-format', 'nan0')
												}}
											>
												NaN0 Spec
											</button>
											<button
												class="code-copy"
												@click=${() => this._copyCode(this._generateCode(meta))}
											>
												${this._t('copyCode')}
											</button>
										</div>
										<pre class="code-content">${this._generateCode(meta)}</pre>
									</div>
								`
							: ''}
					</div>

					<!-- Props Editor -->
					<div class="props-pane">
						<div
							class="pane-label"
							style="display: flex; justify-content: space-between; align-items: center;"
						>
							<span>${this._t('properties')}</span>
							${meta &&
							this.activeVariant &&
							!this._builtInVariantNames.get(this.activeComponent)?.has(this.activeVariant)
								? html`
										<div style="display: flex; gap: 12px; margin-right: 4px;">
											<button
												style="all: unset; cursor: pointer; color: var(--ide-text-muted); font-size: 0.8rem; transition: color 0.2s;"
												onmouseover="this.style.color='var(--ide-text)'"
												onmouseout="this.style.color='var(--ide-text-muted)'"
												@click=${() => this._renameVariant(this.activeVariant)}
												title="Перейменувати варіацію"
											>
												✎
											</button>
											<button
												style="all: unset; cursor: pointer; color: var(--ide-err, #f87171); font-size: 0.8rem; opacity: 0.7; transition: opacity 0.2s;"
												onmouseover="this.style.opacity=1"
												onmouseout="this.style.opacity=0.7"
												@click=${() => this._deleteVariant(this.activeVariant)}
												title="Видалити варіацію"
											>
												🗑
											</button>
										</div>
									`
								: ''}
						</div>
						<div class="props-scroll">
							${meta
								? Object.entries(this.editableProps).map(([key, value]) =>
										this._renderPropEditor(key, value, meta.propTypes?.[key]),
									)
								: html`<div
										style="color: var(--ide-text-muted); font-size: 0.82rem; padding: 8px 0;"
									>
										Компонент не обрано
									</div>`}
							${meta
								? html`<button
										class="btn-reset"
										@click=${this._resetProps}
										title="${this._t('resetToDefault')}"
									>
										↺ ${this._t('reset')}
									</button>`
								: ''}
						</div>
					</div>
				</div>
			</main>
		`
	}

	/** Emergency reset: ?reset=1 clears all IDE state */
	_checkReset() {
		const params = new URLSearchParams(window.location.search)
		if (params.get('reset') === '1') {
			localStorage.removeItem('ui-theme')
			localStorage.removeItem('ui-open-sections')
			localStorage.removeItem('ui-sidebar-expanded')
			indexedDB.deleteDatabase('master_ide')
			window.location.href = window.location.pathname
		}
	}

	/** Async modal prompt — returns string or null */
	_showModal(message, defaultValue = '') {
		return new Promise((resolve) => {
			const overlay = document.createElement('div')
			overlay.className = 'modal-overlay'
			overlay.innerHTML = `
				<div class="ide-modal">
					<p class="modal-message">${message}</p>
					<input class="modal-input" type="text" value="${defaultValue}" />
					<div class="modal-buttons">
						<button class="modal-cancel">Скасувати</button>
						<button class="modal-ok">Так</button>
					</div>
				</div>
			`
			const input = overlay.querySelector('.modal-input')
			const close = (val) => {
				overlay.remove()
				resolve(val)
			}
			overlay.querySelector('.modal-ok').onclick = () => close(input.value || null)
			overlay.querySelector('.modal-cancel').onclick = () => close(null)
			overlay.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') close(null)
				if (e.key === 'Enter') close(input.value || null)
			})
			this.shadowRoot.appendChild(overlay)
			setTimeout(() => input.focus(), 50)
		})
	}

	/** Async confirm — returns boolean */
	_showConfirm(message) {
		return new Promise((resolve) => {
			const overlay = document.createElement('div')
			overlay.className = 'modal-overlay'
			overlay.innerHTML = `
				<div class="ide-modal">
					<p class="modal-message">${message}</p>
					<div class="modal-buttons">
						<button class="modal-cancel">Скасувати</button>
						<button class="modal-ok modal-danger">Видалити</button>
					</div>
				</div>
			`
			const close = (val) => {
				overlay.remove()
				resolve(val)
			}
			overlay.querySelector('.modal-ok').onclick = () => close(true)
			overlay.querySelector('.modal-cancel').onclick = () => close(false)
			overlay.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') close(false)
				if (e.key === 'Enter') close(true)
			})
			this.shadowRoot.appendChild(overlay)
			setTimeout(() => overlay.querySelector('.modal-cancel').focus(), 50)
		})
	}
}

customElements.define('master-ide', MasterIDE)

import '@nan0web/ui-lit/theme'
import './ide.js'
import './form-color.js'
import './form-shadow.js'

const groups = {
	Actions: ['Button', 'Toggle'],
	Forms: ['Input', 'Select', 'Slider', 'Autocomplete', 'Color', 'Shadow'],
	Data: ['Accordion', 'Card', 'Sortable', 'Table', 'Tree', 'CodeBlock', 'Markdown', 'Badge'],
	Feedback: ['Alert', 'Confirm', 'Modal', 'ProgressBar', 'Spinner', 'Toast'],
	System: ['LangSelect', 'ThemeToggle'],
}

const allComponentNames = Object.values(groups).flat()

function getGroupFor(compName) {
	for (const [groupName, comps] of Object.entries(groups)) {
		if (comps.includes(compName)) return groupName
	}
	return 'Core'
}

function parseManifestFromData(compName, data) {
	const configKey = `$${compName}`
	const config = data[configKey] || {}

	const propTypes = {}
	const defaultProps = {}
	const searchTags = config.$search || ''

	for (const [key, val] of Object.entries(config)) {
		if (key.startsWith('$')) continue
		if (Array.isArray(val)) {
			propTypes[key] = val
			defaultProps[key] = val[0]
		} else {
			if (val.type) propTypes[key] = val.type
			if (val.default !== undefined) defaultProps[key] = val.default
		}
	}

	const seen = new Set()
	const variants = (data.content || []).map((v) => {
		let props = v[compName]
		if (props === true) props = {}
		let name = props.variant || props.content || props.label || 'Default'
		name = name.charAt(0).toUpperCase() + name.slice(1)
		if (seen.has(name) && (props.content || props.label)) {
			const fallback = props.content || props.label
			name = fallback.charAt(0).toUpperCase() + fallback.slice(1)
		}
		let finalName = name
		let suffix = 2
		while (seen.has(finalName)) {
			finalName = `${name} ${suffix++}`
		}
		seen.add(finalName)
		return { name: finalName, props }
	})

	return {
		tag: `ui-${compName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`,
		searchTags,
		propTypes,
		defaultProps,
		variants,
	}
}

/**
 * Fetch all component JSON files for a given language.
 * @param {string} lang
 * @returns {Promise<Record<string, Record<string, object>>>} grouped manifests
 */
async function _fetchManifest(lang) {
	const grouped = {}

	const results = await Promise.allSettled(
		allComponentNames.map(async (name) => {
			const url = `/data/${lang}/${name}.json`
			const res = await fetch(url)
			if (!res.ok) return null
			const data = await res.json()
			return { name, data }
		}),
	)

	for (const result of results) {
		if (result.status !== 'fulfilled' || !result.value) continue
		const { name, data } = result.value
		const group = getGroupFor(name)
		if (!grouped[group]) grouped[group] = {}
		grouped[group][name] = parseManifestFromData(name, data)
	}

	return grouped
}

export const uiLitApp = {
	componentsManifests: {},
	_currentLang: null,

	/** Load manifest for a specific language via fetch() */
	async _loadManifest(lang) {
		if (this._currentLang === lang) return
		this._currentLang = lang
		this.componentsManifests = await _fetchManifest(lang)
		window.dispatchEvent(
			new CustomEvent('manifest-updated', {
				detail: this.componentsManifests,
			}),
		)
	},

	registerApps(manifests = {}) {
		for (const [app, manifest] of Object.entries(manifests)) {
			if (!this.componentsManifests[app]) this.componentsManifests[app] = {}
			Object.assign(this.componentsManifests[app], manifest)
		}
		window.dispatchEvent(
			new CustomEvent('manifest-updated', {
				detail: this.componentsManifests,
			}),
		)
	},
}

window.uiLitApp = uiLitApp

// Detect initial lang from URL
const pathLang = window.location.pathname.startsWith('/en/')
	? 'en'
	: window.location.pathname.startsWith('/uk/')
		? 'uk'
		: localStorage.getItem('ui-docs-lang') || 'uk'

// Fetch manifest for detected lang
uiLitApp._loadManifest(pathLang)

// Re-fetch when IDE changes `lang` attribute
const observer = new MutationObserver((mutations) => {
	for (const m of mutations) {
		if (m.type === 'attributes' && m.attributeName === 'lang') {
			const newLang = m.target.getAttribute('lang')
			if (newLang) uiLitApp._loadManifest(newLang)
		}
	}
})

// Wait for master-ide element and observe it
requestAnimationFrame(() => {
	const ide = document.querySelector('master-ide')
	if (ide) {
		observer.observe(ide, { attributes: true, attributeFilter: ['lang'] })
	}
})

import '@nan0web/ui-lit/core'

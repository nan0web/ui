import '@nan0web/ui-lit/theme'
import './ide.js'

// Load all YAML schemas dynamically
const yamlModules = import.meta.glob('./data/**/*.yaml', { eager: true })

const coreManifest = {}

for (const path in yamlModules) {
	// path is like ./data/uk/Alert.yaml or ./data/en/Badge.yaml
	const match = path.match(/\.\/data\/([^/]+)\/([^/.]+)\.yaml$/)
	if (!match) continue

	const lang = match[1]
	const compName = match[2]

	if (lang.startsWith('_')) continue

	const data = yamlModules[path].default || yamlModules[path]
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
		// Determine variant display name — prefer variant, fallback to content or label
		let name = props.variant || props.content || props.label || 'Default'
		name = name.charAt(0).toUpperCase() + name.slice(1)
		// Deduplicate: if name is taken, try content/label; if still taken, append suffix
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

	if (!coreManifest[compName]) {
		coreManifest[compName] = {
			tag: `ui-${compName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`,
			description: `Компонент ${compName}`,
			searchTags,
			propTypes,
			defaultProps,
			variants,
		}
	}
}

const groups = {
	Actions: ['Button', 'Toggle'],
	Forms: ['Input', 'Select', 'Slider', 'Autocomplete'],
	Data: ['Accordion', 'Card', 'Sortable', 'Table', 'Tree', 'CodeBlock', 'Markdown', 'Badge'],
	Feedback: ['Alert', 'Confirm', 'Modal', 'ProgressBar', 'Spinner', 'Toast'],
	System: ['LangSelect', 'ThemeToggle'],
}

// Group the components
const groupedManifests = {}
for (const [compName, meta] of Object.entries(coreManifest)) {
	let assignedGroup = 'Core'
	for (const [groupName, comps] of Object.entries(groups)) {
		if (comps.includes(compName)) {
			assignedGroup = groupName
			break
		}
	}
	if (!groupedManifests[assignedGroup]) {
		groupedManifests[assignedGroup] = {}
	}
	groupedManifests[assignedGroup][compName] = meta
}

export const uiLitApp = {
	componentsManifests: groupedManifests,
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
uiLitApp.registerApps({})

import '@nan0web/ui-lit/core'

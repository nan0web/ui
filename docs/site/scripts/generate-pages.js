import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteDir = path.resolve(__dirname, '..')
const dataDir = path.join(siteDir, 'src/data')
const indexHtmlTemplate = fs.readFileSync(path.join(siteDir, 'index.html'), 'utf-8')

// Category mapping — mirrors main.js groups
const groups = {
	Actions: ['Button', 'Toggle'],
	Forms: ['Input', 'Select', 'Slider', 'Autocomplete'],
	Data: ['Accordion', 'Card', 'Sortable', 'Table', 'Tree', 'CodeBlock', 'Markdown', 'Badge'],
	Feedback: ['Alert', 'Confirm', 'Modal', 'ProgressBar', 'Spinner', 'Toast'],
	System: ['LangSelect', 'ThemeToggle'],
}

function getCategoryForComponent(componentName) {
	for (const [category, components] of Object.entries(groups)) {
		if (components.includes(componentName)) return category
	}
	return 'Core'
}

const langs = ['uk', 'en']

langs.forEach((lang) => {
	const langDir = path.join(dataDir, lang)
	if (!fs.existsSync(langDir)) return

	const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.yaml'))

	files.forEach((file) => {
		const componentName = file.replace('.yaml', '')
		const category = getCategoryForComponent(componentName)

		// Create category subdirectory: /{lang}/{Category}/
		const outputDir = path.join(siteDir, lang, category)
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

		const newHtmlPath = path.join(outputDir, `${componentName}.html`)

		let htmlContext = indexHtmlTemplate

		// Replace master-ide tag with lang, category, and active-component
		htmlContext = htmlContext.replace(
			'<master-ide></master-ide>',
			`<master-ide lang="${lang}" active-component="${componentName}"></master-ide>`,
		)

		// Adjust the script source: from /{lang}/{Category}/ up to site root = ../../
		htmlContext = htmlContext.replace(
			'<script type="module" src="./src/main.js"></script>',
			'<script type="module" src="../../src/main.js"></script>',
		)

		// Adjust document title
		htmlContext = htmlContext.replace(
			'<title>Master IDE — @nan0web/ui Sovereign Workbench</title>',
			`<title>${componentName} Component — NaN•Web UI (${lang})</title>`,
		)

		fs.writeFileSync(newHtmlPath, htmlContext)
		console.log(`Generated: ${lang}/${category}/${componentName}.html`)
	})
})

console.log('HTML pages generated successfully.')

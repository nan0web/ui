import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteDir = path.resolve(__dirname, '..')
const dataDir = path.resolve(__dirname, '../../data')
const indexHtmlTemplate = fs.readFileSync(path.join(siteDir, 'ide.html'), 'utf-8')

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

	// Also generate /{lang}/ide.html
	const ideHtmlPath = path.join(siteDir, lang, 'ide.html')
	let ideHtml = indexHtmlTemplate
	ideHtml = ideHtml.replace('<master-ide></master-ide>', `<master-ide lang="${lang}"></master-ide>`)
	ideHtml = ideHtml.replace(/src="\.\/src\/main\.js"/, 'src="../src/main.js"')
	fs.writeFileSync(ideHtmlPath, ideHtml)
	console.log(`Generated: ${lang}/ide.html`)
})

// ─── Generate redirect pages without lang prefix ───────────────
// e.g. /Data/Card.html → redirects to /uk/Data/Card.html (or saved lang)
const defaultLang = 'uk'
const generatedComponents = new Set()

// Collect unique components from the first lang directory
const firstLangDir = path.join(dataDir, defaultLang)
if (fs.existsSync(firstLangDir)) {
	const files = fs.readdirSync(firstLangDir).filter((f) => f.endsWith('.yaml'))
	for (const file of files) {
		const componentName = file.replace('.yaml', '')
		const category = getCategoryForComponent(componentName)

		// Create /{Category}/ directory (no lang prefix)
		const redirectDir = path.join(siteDir, category)
		if (!fs.existsSync(redirectDir)) fs.mkdirSync(redirectDir, { recursive: true })

		const redirectHtml = `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>${componentName} — NaN•Web UI</title>
	<script>
		var lang = localStorage.getItem('ui-docs-lang') || '${defaultLang}';
		var target = '/' + lang + '/${category}/${componentName}.html';
		location.replace(target);
	</script>
	<meta http-equiv="refresh" content="0;url=/${defaultLang}/${category}/${componentName}.html">
</head>
<body></body>
</html>`

		const redirectPath = path.join(redirectDir, `${componentName}.html`)
		fs.writeFileSync(redirectPath, redirectHtml)
		generatedComponents.add(`${category}/${componentName}`)
		console.log(
			`Redirect: ${category}/${componentName}.html → /${defaultLang}/${category}/${componentName}.html`,
		)
	}
}

console.log(`HTML pages generated successfully. (${generatedComponents.size} redirect pages)`)

// ─── Generate SEO landing pages (/uk/index.html, /en/index.html) ───
const landingTemplate = fs.readFileSync(path.join(siteDir, 'index.html'), 'utf-8')

const landingI18n = {
	uk: {
		title: '@nan0web/ui — Документація',
		desc: 'Універсальний UI-фреймворк: одна логіка застосунку, багато реалізацій.',
	},
	en: {
		title: '@nan0web/ui — Documentation',
		desc: 'Universal UI framework: one application logic, many interfaces.',
	},
}

for (const lang of langs) {
	const langDir = path.join(siteDir, lang)
	if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true })

	let landingHtml = landingTemplate

	// Set correct lang attribute
	landingHtml = landingHtml.replace(/<html lang="\w+"/, `<html lang="${lang}"`)

	// Update title and meta description
	const t = landingI18n[lang] || landingI18n.uk
	landingHtml = landingHtml.replace(/<title>[^<]+<\/title>/, `<title>${t.title}</title>`)
	landingHtml = landingHtml.replace(
		/<meta name="description" content="[^"]+"/,
		`<meta name="description" content="${t.desc}"`,
	)

	// Set default lang in script
	landingHtml = landingHtml.replace("localStorage.getItem('ui-docs-lang') || 'uk'", `'${lang}'`)

	// Adjust script/link paths (from /uk/ up to site root = ../)
	landingHtml = landingHtml.replace(/src="\.\/src\/main\.js"/g, 'src="../src/main.js"')

	const landingPath = path.join(langDir, 'index.html')
	fs.writeFileSync(landingPath, landingHtml)
	console.log(`SEO Landing: ${lang}/index.html`)
}

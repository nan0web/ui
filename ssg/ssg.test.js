/**
 * SSG Verification Tests — Static Site Generation
 *
 * Перевіряє що generate-pages.js коректно генерує всі HTML-файли:
 * - /{lang}/{Category}/{Component}.html — сторінки компонентів
 * - /{lang}/ide.html — IDE без прив'язки до компонента
 * - /{lang}/CSS.html — Theme Settings deep link
 * - /{lang}/index.html — SEO landing page
 * - /{Category}/{Component}.html — redirect (без lang prefix)
 *
 * Цей тест НЕ запускає generate-pages.js — він верифікує стан
 * вже згенерованих файлів (зазвичай після `pnpm docs:dev` або `pnpm docs:build`).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteDir = path.resolve(__dirname, '../docs/site')
const dataDir = path.resolve(__dirname, '../docs/data')

// ─── Source of truth: categories from generate-pages.js ──────
const groups = {
	Actions: ['Button', 'Toggle'],
	Forms: ['Input', 'Select', 'Slider', 'Autocomplete', 'Color', 'Shadow'],
	Data: ['Accordion', 'Card', 'Sortable', 'Table', 'Tree', 'CodeBlock', 'Markdown', 'Badge'],
	Feedback: ['Alert', 'Confirm', 'Modal', 'ProgressBar', 'Spinner', 'Toast'],
	System: ['LangSelect', 'ThemeToggle'],
}

const langs = ['uk', 'en']

/** All YAML components for a given lang */
function getYamlComponents(lang) {
	const langDir = path.join(dataDir, lang)
	if (!fs.existsSync(langDir)) return []
	return fs.readdirSync(langDir)
		.filter(f => f.endsWith('.yaml'))
		.map(f => f.replace('.yaml', ''))
}

/** Category lookup — mirrors generate-pages.js */
function getCategoryForComponent(name) {
	for (const [cat, comps] of Object.entries(groups)) {
		if (comps.includes(name)) return cat
	}
	return 'Core'
}

// ─── SSG: Component Pages ────────────────────────────────────

describe('SSG: Component Pages (/{lang}/{Category}/{Component}.html)', () => {
	for (const lang of langs) {
		const components = getYamlComponents(lang)

		it(`[${lang}] every YAML component has a generated HTML page`, () => {
			const missing = []
			for (const comp of components) {
				const cat = getCategoryForComponent(comp)
				const htmlPath = path.join(siteDir, lang, cat, `${comp}.html`)
				if (!fs.existsSync(htmlPath)) missing.push(`${lang}/${cat}/${comp}.html`)
			}
			assert.deepStrictEqual(missing, [], `Missing HTML pages: ${missing.join(', ')}`)
		})

		it(`[${lang}] generated pages have correct active-component attribute`, () => {
			for (const comp of components) {
				const cat = getCategoryForComponent(comp)
				const htmlPath = path.join(siteDir, lang, cat, `${comp}.html`)
				if (!fs.existsSync(htmlPath)) continue
				const html = fs.readFileSync(htmlPath, 'utf-8')
				assert.ok(
					html.includes(`active-component="${comp}"`),
					`${lang}/${cat}/${comp}.html must have active-component="${comp}"`,
				)
			}
		})

		it(`[${lang}] generated pages have correct lang attribute`, () => {
			for (const comp of components) {
				const cat = getCategoryForComponent(comp)
				const htmlPath = path.join(siteDir, lang, cat, `${comp}.html`)
				if (!fs.existsSync(htmlPath)) continue
				const html = fs.readFileSync(htmlPath, 'utf-8')
				assert.ok(
					html.includes(`lang="${lang}"`),
					`${lang}/${cat}/${comp}.html must have lang="${lang}"`,
				)
			}
		})

		it(`[${lang}] generated pages have relative script path ../../src/main.js`, () => {
			for (const comp of components) {
				const cat = getCategoryForComponent(comp)
				const htmlPath = path.join(siteDir, lang, cat, `${comp}.html`)
				if (!fs.existsSync(htmlPath)) continue
				const html = fs.readFileSync(htmlPath, 'utf-8')
				assert.ok(
					html.includes('src="../../src/main.js"'),
					`${lang}/${cat}/${comp}.html must have script src="../../src/main.js"`,
				)
			}
		})

		it(`[${lang}] generated pages have SEO <title> with component name`, () => {
			for (const comp of components) {
				const cat = getCategoryForComponent(comp)
				const htmlPath = path.join(siteDir, lang, cat, `${comp}.html`)
				if (!fs.existsSync(htmlPath)) continue
				const html = fs.readFileSync(htmlPath, 'utf-8')
				assert.ok(
					html.includes(`<title>${comp} Component`),
					`${lang}/${cat}/${comp}.html must have <title>${comp} Component...`,
				)
			}
		})
	}
})

// ─── SSG: IDE Pages ──────────────────────────────────────────

describe('SSG: IDE Pages (/{lang}/ide.html)', () => {
	for (const lang of langs) {
		it(`[${lang}] ide.html exists and has lang attribute`, () => {
			const htmlPath = path.join(siteDir, lang, 'ide.html')
			assert.ok(fs.existsSync(htmlPath), `${lang}/ide.html must exist`)
			const html = fs.readFileSync(htmlPath, 'utf-8')
			assert.ok(html.includes(`lang="${lang}"`), `${lang}/ide.html must have lang="${lang}"`)
		})

		it(`[${lang}] ide.html has relative script path ../src/main.js`, () => {
			const htmlPath = path.join(siteDir, lang, 'ide.html')
			if (!fs.existsSync(htmlPath)) return
			const html = fs.readFileSync(htmlPath, 'utf-8')
			assert.ok(
				html.includes('src="../src/main.js"'),
				`${lang}/ide.html must have script src="../src/main.js"`,
			)
		})
	}
})

// ─── SSG: CSS Theme Settings Pages ───────────────────────────

describe('SSG: CSS Pages (/{lang}/CSS.html)', () => {
	for (const lang of langs) {
		it(`[${lang}] CSS.html exists and has Theme Settings title`, () => {
			const htmlPath = path.join(siteDir, lang, 'CSS.html')
			assert.ok(fs.existsSync(htmlPath), `${lang}/CSS.html must exist`)
			const html = fs.readFileSync(htmlPath, 'utf-8')
			assert.ok(
				html.includes('Theme Settings (CSS)'),
				`${lang}/CSS.html must have "Theme Settings (CSS)" in title`,
			)
		})
	}
})

// ─── SSG: SEO Landing Pages ─────────────────────────────────

describe('SSG: SEO Landing Pages (/{lang}/index.html)', () => {
	for (const lang of langs) {
		it(`[${lang}] index.html exists and has correct <html lang>`, () => {
			const htmlPath = path.join(siteDir, lang, 'index.html')
			assert.ok(fs.existsSync(htmlPath), `${lang}/index.html must exist`)
			const html = fs.readFileSync(htmlPath, 'utf-8')
			assert.ok(
				html.includes(`<html lang="${lang}"`),
				`${lang}/index.html must have <html lang="${lang}">`,
			)
		})
	}

	it('[uk] landing has Ukrainian title', () => {
		const html = fs.readFileSync(path.join(siteDir, 'uk/index.html'), 'utf-8')
		assert.ok(html.includes('@nan0web/ui — Документація'), 'uk landing must have UA title')
	})

	it('[en] landing has English title', () => {
		const html = fs.readFileSync(path.join(siteDir, 'en/index.html'), 'utf-8')
		assert.ok(html.includes('@nan0web/ui — Documentation'), 'en landing must have EN title')
	})
})

// ─── SSG: Redirect Pages ────────────────────────────────────

describe('SSG: Redirect Pages (/{Category}/{Component}.html)', () => {
	const components = getYamlComponents('uk')

	it('every component has a redirect page (no lang prefix)', () => {
		const missing = []
		for (const comp of components) {
			const cat = getCategoryForComponent(comp)
			const redirectPath = path.join(siteDir, cat, `${comp}.html`)
			if (!fs.existsSync(redirectPath)) missing.push(`${cat}/${comp}.html`)
		}
		assert.deepStrictEqual(missing, [], `Missing redirect pages: ${missing.join(', ')}`)
	})

	it('redirect pages contain meta refresh to /uk/ by default', () => {
		for (const comp of components) {
			const cat = getCategoryForComponent(comp)
			const redirectPath = path.join(siteDir, cat, `${comp}.html`)
			if (!fs.existsSync(redirectPath)) continue
			const html = fs.readFileSync(redirectPath, 'utf-8')
			assert.ok(
				html.includes(`url=/uk/${cat}/${comp}.html`),
				`${cat}/${comp}.html redirect must point to /uk/${cat}/${comp}.html`,
			)
		}
	})

	it('redirect pages contain JS localStorage lang detection', () => {
		const comp = components[0]
		const cat = getCategoryForComponent(comp)
		const redirectPath = path.join(siteDir, cat, `${comp}.html`)
		if (!fs.existsSync(redirectPath)) return
		const html = fs.readFileSync(redirectPath, 'utf-8')
		assert.ok(
			html.includes("localStorage.getItem('ui-docs-lang')"),
			'Redirect page must support localStorage lang detection',
		)
	})
})

// ─── SSG: Category ↔ YAML Sync ──────────────────────────────

describe('SSG: Category ↔ YAML Consistency', () => {
	it('every YAML component is assigned to a known category (not "Core")', () => {
		const components = getYamlComponents('uk')
		const unmapped = components.filter(c => getCategoryForComponent(c) === 'Core')
		assert.deepStrictEqual(
			unmapped, [],
			`Components without a category mapping: ${unmapped.join(', ')}. ` +
			'Update groups{} in generate-pages.js and ssg.test.js.',
		)
	})

	it('category groups contain only components that exist as YAML files', () => {
		const yamlComponents = new Set(getYamlComponents('uk'))
		const phantoms = []
		for (const [cat, comps] of Object.entries(groups)) {
			for (const comp of comps) {
				if (!yamlComponents.has(comp)) phantoms.push(`${cat}/${comp}`)
			}
		}
		assert.deepStrictEqual(
			phantoms, [],
			`Phantom components (in groups but no YAML): ${phantoms.join(', ')}`,
		)
	})

	it('uk and en have identical component sets', () => {
		const uk = getYamlComponents('uk').sort()
		const en = getYamlComponents('en').sort()
		assert.deepStrictEqual(uk, en, 'uk and en must have the same component YAML files')
	})

	it(`total component count matches Architecture Map (${Object.values(groups).flat().length})`, () => {
		const components = getYamlComponents('uk')
		const expectedFromGroups = Object.values(groups).flat().length
		assert.strictEqual(
			components.length, expectedFromGroups,
			`YAML count (${components.length}) ≠ groups count (${expectedFromGroups}). ` +
			'Add missing components to groups{} or add YAML files.',
		)
	})
})

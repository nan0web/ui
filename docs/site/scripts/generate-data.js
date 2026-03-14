import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../../data')
const outDir = path.resolve(__dirname, '../public/data')

// Minimal YAML parser (handles our component YAML subset)
function parseYaml(text) {
	// Use dynamic import of js-yaml if available, else basic parse
	const lines = text.split('\n')
	const result = {}
	let currentKey = null
	let currentList = null
	let indent = 0

	for (const line of lines) {
		const trimmed = line.trimEnd()
		if (!trimmed || trimmed.startsWith('#')) continue

		const listMatch = trimmed.match(/^(\s*)- (.+)/)
		const keyValMatch = trimmed.match(/^(\s*)([\w$-]+):\s*(.*)/)

		if (listMatch) {
			const val = listMatch[2].trim()
			if (currentList) {
				// Parse nested object in list: "- Key: value"
				const nestedMatch = val.match(/^([\w$-]+):\s*(.*)/)
				if (nestedMatch) {
					const obj = {}
					obj[nestedMatch[1]] = parseValue(nestedMatch[2])
					currentList.push(obj)
				} else {
					currentList.push(parseValue(val))
				}
			}
		} else if (keyValMatch) {
			const key = keyValMatch[2]
			const val = keyValMatch[3].trim()
			const lineIndent = keyValMatch[1].length

			if (val === '') {
				// Start of nested object or list
				currentKey = key
				indent = lineIndent
				result[key] = {}
				currentList = null
			} else {
				if (currentKey && lineIndent > indent) {
					// Nested key-value
					if (typeof result[currentKey] !== 'object') result[currentKey] = {}
					result[currentKey][key] = parseValue(val)
				} else {
					result[key] = parseValue(val)
					currentKey = key
					indent = lineIndent
					currentList = null
				}
			}
		}

		// Detect list start
		if (keyValMatch && keyValMatch[3].trim() === '') {
			const nextLineIdx = lines.indexOf(line) + 1
			if (nextLineIdx < lines.length && lines[nextLineIdx].trimStart().startsWith('-')) {
				result[keyValMatch[2]] = []
				currentList = result[keyValMatch[2]]
				currentKey = keyValMatch[2]
			}
		}
	}

	return result
}

function parseValue(val) {
	if (val === 'true') return true
	if (val === 'false') return false
	if (val === 'null') return null
	if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val)
	// Remove quotes
	if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
		return val.slice(1, -1)
	}
	return val
}

// Use js-yaml if available (it's a dev dependency of vite)
async function loadYaml(filePath) {
	const text = fs.readFileSync(filePath, 'utf-8')
	try {
		const { default: yaml } = await import('js-yaml')
		return yaml.load(text)
	} catch {
		// Fallback to basic parser
		return parseYaml(text)
	}
}

const langs = fs.readdirSync(dataDir).filter((d) => {
	const stat = fs.statSync(path.join(dataDir, d))
	return stat.isDirectory() && d !== '_'
})

let totalFiles = 0

for (const lang of langs) {
	const langDir = path.join(dataDir, lang)
	const langOutDir = path.join(outDir, lang)
	if (!fs.existsSync(langOutDir)) fs.mkdirSync(langOutDir, { recursive: true })

	const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.yaml'))

	for (const file of files) {
		const data = await loadYaml(path.join(langDir, file))
		const jsonFile = path.join(langOutDir, file.replace('.yaml', '.json'))
		fs.writeFileSync(jsonFile, JSON.stringify(data, null, '\t'))
		totalFiles++
		console.log(`📦 ${lang}/${file} → ${file.replace('.yaml', '.json')}`)
	}
}

console.log(`\n✅ Generated ${totalFiles} JSON files for ${langs.length} languages.`)

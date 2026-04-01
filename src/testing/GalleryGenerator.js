import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import { LogicInspector } from './LogicInspector.js'
import { VisualAdapter } from './VisualAdapter.js'
import * as Models from '../domain/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../')
const dataDir = path.resolve(rootDir, 'docs/data')
const snapshotsDir = path.resolve(rootDir, 'snapshots/core')

// Clean before generation
if (fs.existsSync(snapshotsDir)) fs.rmSync(snapshotsDir, { recursive: true, force: true })
fs.mkdirSync(snapshotsDir, { recursive: true })

const groups = {
    Actions: ['Button', 'Toggle'],
    Forms: ['Input', 'Select', 'Slider', 'Autocomplete', 'Color', 'Shadow'],
    Data: ['Accordion', 'Card', 'Sortable', 'Table', 'Tree', 'CodeBlock', 'Markdown', 'Badge'],
    Feedback: ['Alert', 'Confirm', 'Modal', 'ProgressBar', 'Spinner', 'Toast'],
    System: ['LangSelect', 'ThemeToggle'],
}

function getCategory(comp) {
    for (const [cat, comps] of Object.entries(groups)) {
        if (comps.includes(comp)) return cat
    }
    return 'Other'
}

async function generate() {
    const langs = fs.readdirSync(dataDir).filter(d => fs.statSync(path.join(dataDir, d)).isDirectory() && d !== '_')

    for (const lang of langs) {
        const langDir = path.join(dataDir, lang)
        const components = fs.readdirSync(langDir).filter(f => f.endsWith('.yaml'))

        for (const file of components) {
            const compName = file.replace('.yaml', '')
            const category = getCategory(compName)
            const text = fs.readFileSync(path.join(langDir, file), 'utf-8')
            const data = yaml.load(text)

            // Variations are in data.content
            const variations = data.content || []
            
            for (let i = 0; i < variations.length; i++) {
                const varData = variations[i][compName] || variations[i]
                
                // Get variation name from 'content', 'title', 'message', or fallback to index
                let varName = varData.content || varData.title || varData.message || `var${i + 1}`
                if (typeof varName !== 'string') varName = `var${i + 1}`
                
                // Clean filename: allow Ukrainian, but replace spaces/special chars with single underscore
                const safeVarName = varName
                    .trim()
                    .toLowerCase()
                    .replace(/[./\\:]/g, '_') // Replace paths/dots
                    .replace(/\s+/g, '_')      // Replace spaces
                    .replace(/_{2,}/g, '_')   // No double underscores
                    .slice(0, 50)              // Max length

                // Logic Capture
                /** @type {() => AsyncGenerator<import('../core/Intent.js').Intent, import('../core/Intent.js').ResultIntent, any>} */
                const modelStream = async function* () {
                    yield { type: 'render', component: `ui-${compName.toLowerCase()}`, props: varData }
                    return { type: 'result', data: { ok: true } }
                }

                const intents = await LogicInspector.capture(modelStream())
                const snapshot = intents.map(it => VisualAdapter.render(it)).join('\n')

                const outPath = path.join(snapshotsDir, lang, category, compName)
                if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true })
                
                fs.writeFileSync(path.join(outPath, `${safeVarName}.txt`), snapshot)
                console.log(`📸 Generated snapshot for ${lang}/${category}/${compName}/${safeVarName}`)
            }
        }
    }
}

generate().catch(console.error)

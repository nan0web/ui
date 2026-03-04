import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import yaml from '@rollup/plugin-yaml'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uiLitRoot = path.resolve(__dirname, '../../../ui-lit')

// Find all HTML files recursively in docs/site (except node_modules)
function getHtmlEntries(dir, entries = {}) {
	const files = fs.readdirSync(dir)
	for (const file of files) {
		const fullPath = path.join(dir, file)
		if (fs.statSync(fullPath).isDirectory()) {
			if (file !== 'node_modules' && file !== 'dist') getHtmlEntries(fullPath, entries)
		} else if (file.endsWith('.html')) {
			let relative = path.relative(__dirname, fullPath)
			let name = relative.replace(/\.html$/, '').replace(/\\/g, '/')
			entries[name] = fullPath
		}
	}
	return entries
}

export default defineConfig({
	base: './',
	plugins: [yaml()],
	resolve: {
		alias: [
			{ find: /^@nan0web\/ui-lit\/(.+)/, replacement: path.join(uiLitRoot, 'packages/$1') },
			{ find: '@nan0web/ui-lit', replacement: path.join(uiLitRoot, 'packages/core/index.js') },
		],
	},
	server: {
		port: 4270,
		open: true,
	},
	build: {
		outDir: '../../dist/docs',
		emptyOutDir: true,
		rollupOptions: {
			input: getHtmlEntries(__dirname),
		},
	},
})

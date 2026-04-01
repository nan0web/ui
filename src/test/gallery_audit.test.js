import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SnapshotInspector } from '../testing/SnapshotInspector.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../')
const snapshotsDir = path.resolve(rootDir, 'snapshots/core')

function getAllTxtFiles(dir) {
	if (!fs.existsSync(dir)) return []
	const results = []
	const list = fs.readdirSync(dir)
	list.forEach((file) => {
		const filePath = path.join(dir, file)
		const stat = fs.statSync(filePath)
		if (stat && stat.isDirectory()) {
			results.push(...getAllTxtFiles(filePath))
		} else if (file.endsWith('.txt')) {
			results.push(filePath)
		}
	})
	return results
}

describe('Snapshot Auditor: Core Gallery Integrity', () => {
	const files = getAllTxtFiles(snapshotsDir)

	if (files.length === 0) {
		it('should have snapshots generated', () => {
			assert.fail('No snapshots found in snapshots/core. Run "npm run test:snapshots" first.')
		})
	}

	for (const file of files) {
		const relPath = path.relative(snapshotsDir, file)
		const locale = relPath.startsWith('uk') ? 'uk' : 'en'

		it(`Snapshot check: ${relPath}`, () => {
			const content = fs.readFileSync(file, 'utf-8')
			const audit = SnapshotInspector.inspect(content, locale, path.basename(file))

			if (audit.score < 100) {
				console.error(`Audit failed for ${relPath}:`, audit.errors)
				assert.strictEqual(audit.score, 100, `Audit failed for ${relPath}: ${audit.errors.join('; ')}`)
			}
		})
	}
})

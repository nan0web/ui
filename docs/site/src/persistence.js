/**
 * IndexedDB persistence layer for Master IDE variations.
 * Uses a standalone store (not @nan0web/db-browser) to avoid heavy dependency
 * in the docs site bundle. Follows the same BrowserStore pattern.
 *
 * Key schema: `variation:{component}:{variantName}`
 */

const DB_NAME = 'master_ide'
const STORE_NAME = 'variations'
const DB_VERSION = 1

/** @type {Promise<IDBDatabase> | null} */
let dbPromise = null

/**
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
	if (typeof window === 'undefined' || !window.indexedDB) {
		return Promise.reject(new Error('IndexedDB not available'))
	}
	if (dbPromise) return dbPromise
	dbPromise = new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DB_NAME, DB_VERSION)
		request.onupgradeneeded = () => {
			const db = request.result
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'key' })
			}
		}
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => {
			dbPromise = null
			reject(request.error)
		}
	})
	return dbPromise
}

/**
 * Save all custom variations for a component.
 * @param {string} componentName - e.g. 'Alert'
 * @param {Array<{name: string, props: object}>} variations
 * @returns {Promise<boolean>}
 */
export async function saveVariations(componentName, variations) {
	try {
		const db = await openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite')
			const store = tx.objectStore(STORE_NAME)
			const request = store.put({
				key: `variations:${componentName}`,
				componentName,
				variations,
				updatedAt: Date.now(),
			})
			request.onsuccess = () => resolve(true)
			request.onerror = () => reject(request.error)
		})
	} catch {
		return false
	}
}

/**
 * Load saved custom variations for a component.
 * @param {string} componentName
 * @returns {Promise<Array<{name: string, props: object}>>}
 */
export async function loadVariations(componentName) {
	try {
		const db = await openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readonly')
			const store = tx.objectStore(STORE_NAME)
			const request = store.get(`variations:${componentName}`)
			request.onsuccess = () => resolve(request.result?.variations || [])
			request.onerror = () => reject(request.error)
		})
	} catch {
		return []
	}
}

/**
 * Load all saved variations for all components.
 * @returns {Promise<Record<string, Array<{name: string, props: object}>>>}
 */
export async function loadAllVariations() {
	try {
		const db = await openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readonly')
			const store = tx.objectStore(STORE_NAME)
			const request = store.getAll()
			request.onsuccess = () => {
				const result = {}
				for (const row of request.result || []) {
					if (row.componentName && row.variations) {
						result[row.componentName] = row.variations
					}
				}
				resolve(result)
			}
			request.onerror = () => reject(request.error)
		})
	} catch {
		return {}
	}
}

/**
 * Delete saved variations for one component.
 * @param {string} componentName
 * @returns {Promise<boolean>}
 */
export async function deleteVariations(componentName) {
	try {
		const db = await openDB()
		return new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite')
			const store = tx.objectStore(STORE_NAME)
			const request = store.delete(`variations:${componentName}`)
			request.onsuccess = () => resolve(true)
			request.onerror = () => reject(request.error)
		})
	} catch {
		return false
	}
}

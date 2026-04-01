import fs from 'fs'
import path from 'path'

/**
 * SnapshotInspector
 * 
 * Рев'ювер для автоматичної перевірки Snapshot-зліпків на наявність артефактів,
 * неперекладених ключів та структурних помилок.
 * Реалізує правила "Zero-Hallucination Snapshot Validation".
 */
export class SnapshotInspector {
    /**
     * Перевіряє вміст одного снепшоту.
     * @param {string} content - Текстовий вміст .txt файлу галереї
     * @param {string} locale - Локаль (uk, en)
     * @param {string} [filename] - Ім'я файлу для перевірки на "глюки" (підкреслення)
     * @returns {object} { score, errors }
     */
    static inspect(content, locale = 'uk', filename = '') {
        const errors = []
        const lines = content.split('\n')

        // 0. Перевірка імені файлу (на прохання архітектора)
        if (filename) {
            if (/__|--/.test(filename)) {
                errors.push(`Filename "${filename}" has multiple consecutive separators (glitch detected).`)
            }
            if (filename.length < 3) {
                errors.push(`Filename "${filename}" is too short.`)
            }
        }

        lines.forEach((line, index) => {
            const lineNum = index + 1
            const trimmed = line.trim()

            // 1. Неперекладені i18n ключі (крапки в словах)
            // Виключаємо імена компонентів, атрибути RENDER-тегів, та числа з крапкою (версії, координати)
            const isAttribute = trimmed.includes('="')
            const isDotNumber = /^-?\d+\.\d+$/.test(trimmed)
            
            if (/\w+\.\w+/.test(line) && !line.includes('ui-') && !line.includes('http') && !isAttribute && !isDotNumber) {
                errors.push(`Line ${lineNum}: Possible untranslated key found: "${trimmed}"`)
            }

            // 2. Технічні артефакти
            if (line.includes('[object Object]')) {
                errors.push(`Line ${lineNum}: Critical artifact "[object Object]" found.`)
            }
            if (line.includes('undefined')) {
                errors.push(`Line ${lineNum}: Critical artifact "undefined" found.`)
            }
            if (line.includes('NaN')) {
                errors.push(`Line ${lineNum}: Critical artifact "NaN" found.`)
            }

            // 3. Англійські слова в українській локалі (базові)
            if (locale === 'uk') {
                const enWords = ['Back', 'Select', 'Cancel', 'Submit', 'Confirm', 'Delete', 'Information', 'Success', 'Warning', 'Error']
                enWords.forEach(word => {
                    const regex = new RegExp(`\\b${word}\\b`, 'i')
                    // Перевіряємо тільки якщо це не частина тегу <ui-...> або атрибут
                    if (regex.test(line)) {
                        const isTag = line.includes(`<ui-${word.toLowerCase()}`) || line.includes(`[RENDER] <ui-`)
                        const isAsk = line.includes(`[ASK] ${word}`)
                        if (!isTag && !isAsk && !isAttribute) {
                            errors.push(`Line ${lineNum}: English word "${word}" found in "uk" locale.`)
                        }
                    }
                })
            }
            
            // 4. Помилки роутингу
            if (line.includes('🚨 Path not found')) {
                errors.push(`Line ${lineNum}: Routing error "Path not found".`)
            }
        })

        return {
            score: errors.length === 0 ? 100 : Math.max(0, 100 - errors.length * 10),
            errors
        }
    }
}

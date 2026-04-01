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
    static inspect(content: string, locale?: string, filename?: string): object;
}

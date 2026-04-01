/**
 * VisualAdapter (Base)
 *
 * Базовий клас для візуальної трансформації інтенцій OLMUI.
 * Використовувана у @nan0web/ui як фундамент для спеціалізованих рендерерів.
 */
export class VisualAdapter {
    /**
     * Конвертує одну інтенцію у просте текстове представлення.
     * @param {object} intent - Intent entry from LogicInspector
     * @param {function} [t] - i18n translate function
     * @returns {string} Raw description
     */
    static render(intent: object, t?: Function): string;
}

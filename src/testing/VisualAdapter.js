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
    static render(intent, t = (k) => k) {
        switch (intent.type) {
            case 'ask':
                return `[ASK] ${intent.field}: ${intent.input !== undefined ? intent.input : '...'}`
            case 'progress':
                return `[PROGRESS] ${intent.message || ''}`
            case 'log':
                return `[LOG ${intent.level?.toUpperCase() || 'INFO'}] ${typeof intent.message === 'object' ? JSON.stringify(intent.message) : intent.message}`
            case 'render': {
                const { content, ...propsData } = intent.props || {}
                const props = Object.entries(propsData)
                    .map(([k, v]) => `  ${k}="${typeof v === 'object' ? JSON.stringify(v) : v}"`)
                    .join('\n')
                
                if (content) {
                    const attrs = props ? `\n${props}\n` : ' '
                    return `[RENDER] <${intent.component}${attrs}>${content}</${intent.component}>`
                }
                
                return `[RENDER] <${intent.component}${props ? '\n' + props + '\n' : ''}>`
            }
            case 'result':
                return `[RESULT] ${JSON.stringify(intent.data)}`
            default:
                return `[UNKNOWN: ${intent.type}] ${JSON.stringify(intent)}`
        }
    }
}

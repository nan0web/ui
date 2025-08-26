/**
 * Вхідне повідомлення з даними користувача
 */
export default class InputMessage extends UIMessage {
    static from(input: any): InputMessage;
    /**
     * @param {Object} input - Властивості вхідного повідомлення
     * @param {string} [input.body=""]
     * @param {string} [input.type=""]
     * @param {string} [input.id=""]
     * @param {string} [input.value=""] - Значення, що ввів користувач
     * @param {boolean} [input.waiting=false] - Чи очікуємо відповіді
     * @param {Array<string>} [input.options=[]] - Доступні варіанти вибору
     */
    constructor(input?: {
        body?: string | undefined;
        type?: string | undefined;
        id?: string | undefined;
        value?: string | undefined;
        waiting?: boolean | undefined;
        options?: string[] | undefined;
    });
    value: string;
    waiting: boolean;
    options: string[];
    get empty(): boolean;
    isValid(): boolean;
}
import UIMessage from "./Message.js";

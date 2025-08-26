/**
 * Plain model without any UI‑specific extensions.
 *
 * The form for this model will be generated automatically from its properties.
 */
export default class SimpleUser {
    /**
     * @param {Object} data
     * @param {string} [data.name]
     * @param {string} [data.email]
     * @param {number} [data.age]
     */
    constructor({ name, email, age }?: {
        name?: string | undefined;
        email?: string | undefined;
        age?: number | undefined;
    });
    name: string;
    email: string;
    age: number | null;
}

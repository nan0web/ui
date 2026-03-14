/**
 * Detects if a value is a Model-as-Schema class (has static fields with `help`).
 * @param {*} schema
 * @returns {boolean}
 */
export function isModelSchema(schema: any): boolean;
/**
 * Validates that an object is a well-formed Intent.
 * Throws ModelError if the intent is malformed (the "Judge").
 *
 * @param {*} intent
 * @returns {intent is Intent}
 */
export function validateIntent(intent: any): intent is Intent;
/**
 * @typedef {Object} FieldSchema
 * @property {string} help - Human-readable label / i18n key.
 * @property {*} default - Default value for the field.
 * @property {string} [type] - Field type hint ('text', 'number', 'text/markdown').
 * @property {Array<{value: *, label: string}>} [options] - Enum options for select.
 * @property {(val: *) => true | string} [validate] - Validator: true = ok, string = error key from Model.
 * @property {boolean} [hidden] - If true, field is excluded from UI forms.
 */
/**
 * Model needs data from the environment (user input, LLM extraction, test fixture).
 * Adapter MUST return an `AskResponse`.
 * @typedef {Object} AskIntent
 * @property {'ask'} type
 * @property {string} field - Property name on the model.
 * @property {FieldSchema | Function} schema - Field metadata or Model-as-Schema class constructor.
 * @property {true} [model] - When true, schema is a Model-as-Schema class (full form).
 */
/**
 * Model informs about a long-running operation. No response expected.
 * Message MUST come from the Model (i18n static field value).
 * @typedef {Object} ProgressIntent
 * @property {'progress'} type
 * @property {number} [value] - Progress value (0-1).
 * @property {string} [id] - Progress ID for tracking multiple parallel operations.
 * @property {string} message - Status message from Model (i18n static field value).
 */
/**
 * Model emits a log message. No response expected.
 * Message MUST come from the Model (i18n static field value).
 * @typedef {Object} LogIntent
 * @property {'log'} type
 * @property {'info' | 'warn' | 'error' | 'success'} level
 * @property {string} message - Log message from Model (i18n static field value).
 */
/**
 * Final return value from the generator.
 * @typedef {Object} ResultIntent
 * @property {'result'} type
 * @property {*} data - The raw result data (JSON-serializable).
 */
/**
 * Union of all possible yielded intents.
 * @typedef {AskIntent | ProgressIntent | LogIntent} Intent
 */
/**
 * Response to an AskIntent. Adapter provides the collected value.
 * The value MUST conform to the type described in the requested FieldSchema.
 * @typedef {Object} AskResponse
 * @property {*} value - The value matching schema.type (collected from user / LLM / test fixture).
 */
/**
 * Special response that Adapters can send to abort the generator.
 *
 * The `reason` is a KEY from the Model's static `abort` dictionary,
 * not a freeform message. This enables proper i18n translation:
 *
 *   Model defines:  static abort = { user_cancelled: 'Скасовано', timeout: 'Час вичерпано' }
 *   Adapter sends:  { abort: true, reason: 'user_cancelled' }
 *   UI translates:  t(Model.abort[reason])
 *
 * @typedef {Object} AbortResponse
 * @property {true} abort - Signal to the model that execution was cancelled.
 * @property {string} [reason] - Key from Model's static abort dictionary (not a freeform message).
 */
/**
 * Union of all possible responses an Adapter can send back via iterator.next().
 * @typedef {AskResponse | AbortResponse | undefined} IntentResponse
 */
export const INTENT_TYPES: readonly ["ask", "progress", "log"];
export function ask(field: string, schema: object | Function): AskIntent;
export function progress(message: any): {
    type: string;
    message: any;
};
export function log(level: any, message: any, data?: {}): {
    type: string;
    level: any;
    message: any;
};
export function result(data: any): {
    type: string;
    data: any;
};
export type FieldSchema = {
    /**
     * - Human-readable label / i18n key.
     */
    help: string;
    /**
     * - Default value for the field.
     */
    default: any;
    /**
     * - Field type hint ('text', 'number', 'text/markdown').
     */
    type?: string | undefined;
    /**
     * - Enum options for select.
     */
    options?: {
        value: any;
        label: string;
    }[] | undefined;
    /**
     * - Validator: true = ok, string = error key from Model.
     */
    validate?: ((val: any) => true | string) | undefined;
    /**
     * - If true, field is excluded from UI forms.
     */
    hidden?: boolean | undefined;
};
/**
 * Model needs data from the environment (user input, LLM extraction, test fixture).
 * Adapter MUST return an `AskResponse`.
 */
export type AskIntent = {
    type: "ask";
    /**
     * - Property name on the model.
     */
    field: string;
    /**
     * - Field metadata or Model-as-Schema class constructor.
     */
    schema: FieldSchema | Function;
    /**
     * - When true, schema is a Model-as-Schema class (full form).
     */
    model?: true | undefined;
};
/**
 * Model informs about a long-running operation. No response expected.
 * Message MUST come from the Model (i18n static field value).
 */
export type ProgressIntent = {
    type: "progress";
    /**
     * - Progress value (0-1).
     */
    value?: number | undefined;
    /**
     * - Progress ID for tracking multiple parallel operations.
     */
    id?: string | undefined;
    /**
     * - Status message from Model (i18n static field value).
     */
    message: string;
};
/**
 * Model emits a log message. No response expected.
 * Message MUST come from the Model (i18n static field value).
 */
export type LogIntent = {
    type: "log";
    level: "info" | "warn" | "error" | "success";
    /**
     * - Log message from Model (i18n static field value).
     */
    message: string;
};
/**
 * Final return value from the generator.
 */
export type ResultIntent = {
    type: "result";
    /**
     * - The raw result data (JSON-serializable).
     */
    data: any;
};
/**
 * Union of all possible yielded intents.
 */
export type Intent = AskIntent | ProgressIntent | LogIntent;
/**
 * Response to an AskIntent. Adapter provides the collected value.
 * The value MUST conform to the type described in the requested FieldSchema.
 */
export type AskResponse = {
    /**
     * - The value matching schema.type (collected from user / LLM / test fixture).
     */
    value: any;
};
/**
 * Special response that Adapters can send to abort the generator.
 *
 * The `reason` is a KEY from the Model's static `abort` dictionary,
 * not a freeform message. This enables proper i18n translation:
 *
 *   Model defines:  static abort = { user_cancelled: 'Скасовано', timeout: 'Час вичерпано' }
 *   Adapter sends:  { abort: true, reason: 'user_cancelled' }
 *   UI translates:  t(Model.abort[reason])
 */
export type AbortResponse = {
    /**
     * - Signal to the model that execution was cancelled.
     */
    abort: true;
    /**
     * - Key from Model's static abort dictionary (not a freeform message).
     */
    reason?: string | undefined;
};
/**
 * Union of all possible responses an Adapter can send back via iterator.next().
 */
export type IntentResponse = AskResponse | AbortResponse | undefined;

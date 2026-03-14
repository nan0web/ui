/**
 * @file Intent — Yield Contract Types for OLMUI Generators.
 *
 * Defines the strict set of intent types that a Model generator can yield,
 * and the response shapes that Adapters must return.
 *
 * These types serve as the "welding contract" between Domain Models
 * and UI Adapters (CLI, Lit, React, Chat, Test).
 */

import { IntentErrorModel } from './IntentErrorModel.js'

// ─── Intent Types (Model → Adapter) ───

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

// ─── Response Types (Adapter → Model) ───

/**
 * Response to an AskIntent. Adapter provides the collected value.
 * The value MUST conform to the type described in the requested FieldSchema.
 * @typedef {Object} AskResponse
 * @property {*} value - The value matching schema.type (collected from user / LLM / test fixture).
 */

// ─── Abort Support ───

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

export const INTENT_TYPES = /** @type {const} */ (['ask', 'progress', 'log'])

/**
 * Detects if a value is a Model-as-Schema class (has static fields with `help`).
 * @param {*} schema
 * @returns {boolean}
 */
export function isModelSchema(schema) {
	if (typeof schema !== 'function') return false
	return Object.keys(schema).some((key) => {
		const meta = schema[key]
		return meta && typeof meta === 'object' && 'help' in meta
	})
}

/**
 * Validates that an object is a well-formed Intent.
 * Throws ModelError if the intent is malformed (the "Judge").
 *
 * @param {*} intent
 * @returns {intent is Intent}
 */
export function validateIntent(intent) {
	if (!intent || typeof intent !== 'object') {
		throw IntentErrorModel.error('intent_not_object', { actual: typeof intent })
	}
	if (!INTENT_TYPES.includes(intent.type) && intent.type !== 'result') {
		throw IntentErrorModel.error('intent_unknown_type', {
			type: intent.type,
			allowed: INTENT_TYPES.join(', ') + ', result',
		})
	}
	if (intent.type === 'ask') {
		if (typeof intent.field !== 'string' || !intent.field) {
			throw IntentErrorModel.error('ask_missing_field')
		}
		// Accept both: plain schema {help: '...'} and Model-as-Schema class
		const isModel = intent.model === true
		if (!isModel && (!intent.schema || typeof intent.schema !== 'object' || !('help' in intent.schema))) {
			throw IntentErrorModel.error('ask_missing_schema_help')
		}
	}
	if (intent.type === 'progress' || intent.type === 'log') {
		if (typeof intent.message !== 'string') {
			throw IntentErrorModel.error('intent_missing_message', { type: intent.type })
		}
	}
	return true
}

/**
 * Create an ask intent.
 *
 * Two modes:
 *   ask('amount', { help: 'Enter amount', type: 'number' })  → single field
 *   ask('transfer', TransferMoneyModel)                       → full Model form
 *
 * @param {string} field - Field name or form name.
 * @param {object | Function} schema - Field descriptor or Model-as-Schema class.
 * @returns {AskIntent}
 */
export const ask = (field, schema) => {
	if (isModelSchema(schema)) {
		return { type: 'ask', field, schema, model: true }
	}
	return { type: 'ask', field, schema }
}

export const progress = (message) => ({ type: 'progress', message })
export const log = (level, message, data = {}) => ({ type: 'log', level, message, ...data })
export const result = (data) => ({ type: 'result', data })

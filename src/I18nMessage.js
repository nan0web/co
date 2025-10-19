import Message from "./Message.js"

/** @typedef {(key: string, params?: Record<string, any>) => string} TranslateFunction */

/**
 * Internationalized Message class
 * Extends base Message with translation support
 */
export default class I18nMessage extends Message {
	/**
	 * Default replacer function for translation parameters
	 * @param {string} key - Translation key with placeholders like {{name}}
	 * @param {Record<string, any>} [params] - Parameters to replace placeholders
	 * @returns {string} - Translated string with replaced parameters
	 */
	static Replacer = (key, params = {}) => Object.entries(params).reduce(
		(str, [k, v]) => str.replaceAll(`{{${k}}}`, v),
		key
	)

	/** @type {TranslateFunction} */
	#t

	/**
	 * Create a new I18nMessage instance
	 * @param {object} input - Input configuration
	 * @param {any} [input.body] - Message body.
	 * @param {Date} [input.time] - Created at time.
	 * @param {TranslateFunction} [input.t] - Function for translations in current locale.
	 */
	constructor(input = {}) {
		super(input)

		const {
			t = (key, params) => /** @type {typeof I18nMessage} */ (this.constructor).Replacer(key, params)
		} = input
		this.#t = t
	}

	/**
	 * Translate a key with given parameters
	 * @param {string} key - Translation key
	 * @param {Record<string, any>} [params] - Parameters for placeholder replacement
	 * @returns {string} - Translated and formatted message
	 */
	t(key, params = {}) {
		return this.#t(key, params)
	}

	/**
	 * Create I18nMessage from various inputs
	 * @param {any} input - Input to create message from
	 * @returns {I18nMessage} - I18nMessage instance
	 */
	static from(input) {
		if (input instanceof I18nMessage) return input
		if ("object" !== typeof input) {
			return new I18nMessage({ body: input })
		}
		return new I18nMessage(input)
	}
}

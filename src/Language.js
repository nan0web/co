/**
 * Language class for handling localization data
 * Stores language information including name, icon, code, and locale
 */
export default class Language {
	/** @type {string} */
	name = ""

	/** @type {string} */
	icon = ""

	/** @type {string} */
	code = ""

	/** @type {string} */
	locale = ""

	/**
	 * Create a new Language instance
	 * @param {object} [input={}] - Language properties
	 * @param {string} [input.name=""] - Language name
	 * @param {string} [input.icon=""] - Language icon identifier
	 * @param {string} [input.code=""] - ISO 639-1 language code (e.g. "en", "uk")
	 * @param {string} [input.locale=""] - Locale identifier (e.g. "en-US", "uk-UA")
	 */
	constructor(input = {}) {
		const {
			name = this.name,
			icon = this.icon,
			code = this.code,
			locale = this.locale,
		} = input
		this.name = String(name)
		this.icon = String(icon)
		this.code = String(code)
		this.locale = String(locale)
	}

	/**
	 * The stringified version of the language.
	 * @returns {string}
	 */
	toString() {
		return [this.name, this.icon].filter(Boolean).join(" ")
	}

	/**
	 * Factory method to create Language instance
	 * @param {any} input - Language instance or data for constructor
	 * @returns {Language} - Language instance
	 */
	static from(input) {
		if (input instanceof Language) return input
		return new Language(input)
	}
}

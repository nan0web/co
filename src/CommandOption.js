import CommandError from "./CommandError.js"

/**
 * Command option class
 * Represents a single command option (flag, option, or argument)
 */
class CommandOption {
	/** @type {string} */
	name

	/** @type {Function|Array} */
	type

	/** @type {any} */
	defaultValue

	/** @type {string} */
	help

	/** @type {object} */
	meta

	/**
	 * Create a new CommandOption instance
	 * @param {object} config - Command option configuration
	 * @param {string} config.name - Option name
	 * @param {Function|Array} config.type - Option type
	 * @param {any} config.defaultValue - Default value for the option
	 * @param {string} config.help - Option help
	 * @param {object} [config.meta={}] - Additional metadata
	 */
	constructor(config = {}) {
		if (Array.isArray(config)) {
			const helpIndex = config.length - 1
			const metaIndex = config.length - 2
			const typeInfo = CommandOption.getTypeFrom(config[1] || "")
			
			// Check if the last element is an object (meta) or just help text
			let meta = {}
			let help = ""
			
			if (typeof config[helpIndex] === 'object' && config[helpIndex] !== null) {
				meta = config[helpIndex] || {}
				help = config[helpIndex - 1] || ""
			} else {
				help = config[helpIndex] || ""
				if (typeof config[metaIndex] === 'object' && config[metaIndex] !== null) {
					meta = config[metaIndex] || {}
				}
			}
			
			config = {
				name: config[0] || "",
				type: typeInfo.type,
				defaultValue: ('default' in meta) ? meta.default : typeInfo.value,
				help: help,
				meta: meta
			}
		}
		const {
			name = "",
			type = String,
			defaultValue = null,
			help = "",
			meta = {}
		} = config

		this.name = name
		this.type = type
		this.defaultValue = defaultValue
		this.help = help
		this.meta = meta
	}

	/**
	 * Convert option to object representation
	 * @returns {object} - Object with all option properties
	 */
	toObject() {
		return {
			name: this.name,
			type: this.type,
			defaultValue: this.defaultValue,
			help: this.help,
			meta: this.meta
		}
	}

	/**
	 * @param {object} input
	 * @returns {CommandOption}
	 */
	static from(input) {
		if (input instanceof CommandOption) return input
		return new CommandOption(input)
	}

	/**
	 * Get type information from a value
	 * @param {any} value - The value to analyze
	 * @returns {object} - Object with type and value properties
	 */
	static getTypeFrom(value) {
		if (String === value) {
			return { type: String, value: "" }
		}
		else if (Boolean === value) {
			return { type: Boolean, value: false }
		}
		else if (Number === value) {
			return { type: Number, value: 0 }
		}
		else if ("boolean" === typeof value) {
			return { type: Boolean, value }
		}
		else if ("number" === typeof value) {
			return { type: Number, value }
		}
		else if ("string" === typeof value) {
			return { type: String, value }
		}
		else if ("object" === typeof value) {
			if (null === value) {
				return { type: Object, value: null }
			}
			if (Array.isArray(value)) {
				return { type: Array, value }
			}
			return { type: value.constructor, value }
		}
		else if ("function" === typeof value) {
			return { type: value, value: undefined }
		} else {
			throw new CommandError("Cannot detect a type from a value", value)
		}
	}
}

export default CommandOption
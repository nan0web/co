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
	def

	/** @type {string} */
	help

	/** @type {string} */
	alias

	/** @type {boolean} */
	required

	/**
	 * Create a new CommandOption instance
	 * @param {object} config - Option configuration
	 * @param {string} [config.name] - Option name
	 * @param {Function|Array} [config.type] - Option type
	 * @param {any} [config.def] - Default value
	 * @param {string} [config.help] - Help text
	 * @param {string} [config.alias] - Short alias
	 * @param {boolean} [config.required] - Is argument required
	 */
	constructor(config = {}) {
		const {
			name = "",
			type = String,
			def = null,
			help = "",
			alias = "",
			required = false
		} = config

		this.name = name
		this.type = type
		this.def = def
		this.help = help
		this.alias = alias
		this.required = required
	}

	/**
	 * Get default value for the option
	 * @returns {any} - Default value
	 */
	getDefault() {
		return this.def
	}

	/**
	 * Check if argument is optional
	 * @returns {boolean}
	 */
	isOptional() {
		return this.def !== null || this.required === false
	}

	/**
	 * Convert option to object representation
	 * @returns {object} - Object with option properties
	 */
	toObject() {
		const typeInfo = Array.isArray(this.type)
			? this.type.join('|')
			: this.type.name || typeof this.type

		const defaultText = this.def !== null
			? ` (default: ${this.def})`
			: ''

		return {
			name: this.name,
			type: this.type,
			typeInfo,
			def: this.def,
			defaultText,
			help: this.help,
			alias: this.alias
		}
	}

	/**
	 * Create CommandOption from various input formats
	 * @param {string|Array|object} input - Input to create option from
	 * @returns {CommandOption} - CommandOption instance
	 */
	static from(input) {
		if (input instanceof CommandOption) return input

		if (typeof input === "string") {
			return new CommandOption({ name: input, type: String, def: "", help: "" })
		}

		if (Array.isArray(input)) {
			const [name, type, def, help, alias] = input
			return new CommandOption({ name, type, def, help, alias })
		}

		if (typeof input === "object" && input !== null) {
			return new CommandOption(input)
		}

		throw new Error(`Invalid input for CommandOption.from(): ${input}`)
	}
}

export default CommandOption

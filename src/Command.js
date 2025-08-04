import CommandMessage from "./CommandMessage.js"
import CommandError from "./CommandError.js"
import CommandOption from "./CommandOption.js"

/**
 * @typedef {Object} CommandConfig
 * @property {string} [name] - Command name
 * @property {string} [help] - Command help
 * @property {object} [options] - Command options
 * @property {object} [arguments] - Command arguments
 */

/**
 * Base Command class
 * Provides a simple CLI command interface similar to Python's click
 */
class Command {
	/** @type {string} */
	name

	/** @type {string} */
	help

	/** @type {Map<string, CommandOption>} */
	options

	/** @type {Map<string, CommandOption>} */
	arguments

	/**
	 * Create a new Command instance
	 * @param {CommandConfig} config - Command configuration or name
	 */
	constructor(config = {}) {
		// Handle constructor with name and help as separate arguments
		if (typeof config === "string") {
			this.name = config
			this.help = ""
			this.options = new Map()
			this.arguments = new Map()
			return
		}

		const {
			name = "",
			help = "",
			options = {},
			arguments: args = {},
		} = config

		this.name = name
		this.help = help
		this.options = new Map()
		this.arguments = new Map()

		// Convert options configuration to CommandOption instances
		Object.entries(options).forEach(([name, optConfig]) => {
			if (Array.isArray(optConfig)) {
				optConfig.unshift(name)
			} else if (typeof optConfig === 'object' && optConfig !== null) {
				optConfig.name = name
			}
			this.options.set(name, CommandOption.from(optConfig))
		})

		// Convert arguments configuration to CommandOption instances
		Object.entries(args).forEach(([name, argConfig]) => {
			if (Array.isArray(argConfig)) {
				argConfig.unshift(name)
			} else if (typeof argConfig === 'object' && argConfig !== null) {
				argConfig.name = name
			}
			this.arguments.set(name, CommandOption.from(argConfig))
		})
	}

	/**
	 * Add an option to the command
	 * @param {string} name - Option name
	 * @param {Function} type - Option type
	 * @param {any} defaultValue - Default value for the option
	 * @param {string} help - Option help
	 * @returns {Command} - This command instance
	 */
	addOption(name, type, defaultValue = null, help = "") {
		this.options.set(name, new CommandOption({
			name,
			type,
			defaultValue,
			help: help
		}))
		return this
	}

	getOption(name) {
		return this.options.get(name)
	}

	/**
	 * Add an argument to the command
	 * @param {string} name - Argument name
	 * @param {Function} type - Argument type
	 * @param {any} defaultValue - Default value for the argument
	 * @param {string} help - Argument help
	 * @returns {Command} - This command instance
	 */
	addArgument(name, type, defaultValue = null, help = "") {
		this.arguments.set(name, new CommandOption({
			name,
			type,
			defaultValue,
			help: help
		}))
		return this
	}

	/**
	 * Parse arguments and populate options
	 * @param {string[] | string} argv - Command line arguments
	 * @returns {CommandMessage} - Parsed command message
	 */
	parse(argv) {
		const msg = CommandMessage.parse(argv)

		// Process options with type conversion
		const opts = { ...msg.opts }
		this.options.forEach((option, name) => {
			if (!(name in opts)) {
				// Check if defaultValue is in meta object
				if (option.meta && 'default' in option.meta) {
					opts[name] = option.meta.default
				} else {
					opts[name] = option.defaultValue
				}
			} else {
				// Perform type conversion
				opts[name] = this.convertValue(opts[name], option.type, name)
			}
		})

		// Process arguments with type conversion
		const args = []
		const argEntries = [...this.arguments.entries()]

		argEntries.forEach(([argName, arg], index) => {
			if (msg.args.length > index) {
				args[index] = this.convertValue(msg.args[index], arg.type, argName)
			} else if (argName === "*") {
				// Rest arguments
				args.push(...msg.args.slice(index))
			} else {
				// Check if defaultValue is in meta object
				if (arg.meta && 'default' in arg.meta) {
					args[index] = arg.meta.default
				} else {
					args[index] = arg.defaultValue
				}
			}
		})

		return new CommandMessage({
			args: args.filter(arg => arg !== undefined),
			opts
		})
	}

	/**
	 * Convert a value to the specified type
	 * @param {any} value - Value to convert
	 * @param {Function|Array} type - Target type (Function constructor, Array for enum)
	 * @param {string} name - Name for error reporting
	 * @returns {any} - Converted value
	 */
	convertValue(value, type, name) {
		if (type === Boolean) {
			return value !== "false" && value !== false
		} else if (type === Number) {
			return Number(value)
		} else if (type === String) {
			return String(value)
		} else if (Array.isArray(type)) {
			// Enum validation
			if (!type.includes(value)) {
				throw new CommandError(`Invalid value for ${name}: ${value}`, {
					validValues: type,
					providedValue: value
				})
			}
			return value
		} else if (typeof type === 'function' && type.name) {
			// Custom class conversion
			if (type.from) {
				try {
					return type.from(value)
				} catch (err) {
					throw new CommandError(`Failed to parse ${name}: ${err.message}`, {
						value,
						type: type.name,
						error: err.message
					})
				}
			} else if (type.fromString) {
				try {
					return type.fromString(value)
				} catch (err) {
					throw new CommandError(`Failed to parse ${name}: ${err.message}`, {
						value,
						type: type.name,
						error: err.message
					})
				}
			} else {
				return new type(value)
			}
		}
		return value
	}

	/**
	 * Show help information
	 * @returns {string} - Help text
	 */
	generateHelp() {
		const lines = []

		if (this.help) {
			lines.push(this.help)
			lines.push("")
		}

		if (this.options.size > 0) {
			lines.push("Options:")
			this.options.forEach(option => {
				const typeInfo = this.getTypeInfo(option.type)
				// Check if defaultValue is in meta object
				let defaultValue = option.defaultValue
				if (option.meta && 'default' in option.meta) {
					defaultValue = option.meta.default
				}
				const defaultValueText = defaultValue !== null ? ` (default: ${defaultValue})` : ""
				lines.push(`  --${option.name} <${typeInfo}>  ${option.help}${defaultValueText}`)
			})
			lines.push("")
		}

		if (this.arguments.size > 0) {
			lines.push("Arguments:")
			this.arguments.forEach(arg => {
				if (arg.name === "*") {
					const typeInfo = this.getTypeInfo(arg.type)
					lines.push(`  [${arg.name}] <${typeInfo}>  ${arg.help}`)
				} else {
					const typeInfo = this.getTypeInfo(arg.type)
					// Check if defaultValue is in meta object
					let defaultValue = arg.defaultValue
					if (arg.meta && 'default' in arg.meta) {
						defaultValue = arg.meta.default
					}
					const defaultValueText = defaultValue !== null ? ` (default: ${defaultValue})` : ""
					lines.push(`  <${arg.name}> <${typeInfo}>  ${arg.help}${defaultValueText}`)
				}
			})
			lines.push("")
		}

		return lines.join("\n")
	}

	/**
	 * Get type information for display
	 * @param {Function|Array} type - Type to get info for
	 * @returns {string} - Type information string
	 */
	getTypeInfo(type) {
		if (Array.isArray(type)) {
			return "enum"
		} else if (typeof type === 'function') {
			return type.name || typeof type
		}
		return typeof type
	}
}

export default Command
import CommandMessage from "./CommandMessage.js"
import CommandError from "./CommandError.js"
import CommandOption from "./CommandOption.js"
import Logger from "@nan0web/log"

/**
 * @typedef {Object} CommandConfig
 * @property {string} [name] - Command name
 * @property {string} [help] - Command help
 * @property {object} [options] - Command options
 * @property {object} [arguments] - Command arguments
 * @property {Array<Command>} [subcommands] - Subcommands
 * @property {string} [usage] - Custom usage string
 */

/**
 * Base Command class
 * Provides a robust CLI command interface following best practices
 */
class Command {
	/** @type {string} */
	name

	/** @type {string} */
	help

	/** @type {string} */
	usage

	/** @type {Map<string, CommandOption>} */
	options

	/** @type {Map<string, CommandOption>} */
	arguments

	/** @type {Map<string, Command>} */
	subcommands

	/** @type {Map<string, string>} */
	aliases

	/**
	 * Create a new Command instance
	 * @param {CommandConfig} config - Command configuration
	 */
	constructor(config = {}) {
		const {
			name = "",
			help = "",
			usage = "",
			options = {},
			arguments: args = {},
			subcommands = []
		} = config

		this.name = name
		this.help = help
		this.usage = usage
		this.options = new Map()
		this.arguments = new Map()
		this.subcommands = new Map()
		this.aliases = new Map()

		// Convert options configuration to CommandOption instances
		Object.entries(options).forEach(([name, optConfig]) => {
			if (Array.isArray(optConfig)) {
				optConfig.unshift(name)
			} else if ("object" === typeof optConfig && optConfig !== null) {
				optConfig.name = name
			}
			const option = CommandOption.from(optConfig)
			this.options.set(name, option)

			// Handle aliases
			if (option.alias) {
				this.aliases.set(option.alias, name)
			}
		})

		// Convert arguments configuration to CommandOption instances
		Object.entries(args).forEach(([name, argConfig]) => {
			if (Array.isArray(argConfig)) {
				argConfig.unshift(name)
			} else if ("object" === typeof argConfig && argConfig !== null) {
				argConfig.name = name
			}
			this.arguments.set(name, CommandOption.from(argConfig))
		})

		// Add subcommands
		subcommands.forEach(subcmd => this.addSubcommand(subcmd))

		this.init()
	}

	init() {
		// Add built-in help flag
		if (!this.options.has("help")) {
			this.addOption("help", Boolean, false, "Show help", "h")
		}
		// Add built-in version flag (assuming version exists)
		if (!this.options.has("version")) {
			this.addOption("version", Boolean, false, "Show version", "V")
		}
	}

	/**
	 * Add an option to the command
	 * @param {string} name - Option name
	 * @param {Function} type - Option type
	 * @param {any} def - Default value for the option
	 * @param {string} help - Option help
	 * @param {string} [alias] - Short alias for the option
	 * @returns {Command} - This command instance
	 */
	addOption(name, type, def = null, help = "", alias = "") {
		this.options.set(name, new CommandOption({
			name,
			type,
			def,
			help,
			alias
		}))
		if (alias) {
			this.aliases.set(alias, name)
		}
		return this
	}

	/**
	 * Returns the option by its name.
	 * @param {string} name
	 * @returns {CommandOption | undefined}
	 */
	getOption(name) {
		return this.options.get(name)
	}

	/**
	 * Add an argument to the command
	 * @param {string} name - Argument name
	 * @param {Function} type - Argument type
	 * @param {any} def - Default value for the argument
	 * @param {string} help - Argument help
	 * @returns {Command} - This command instance
	 */
	addArgument(name, type, def = null, help = "") {
		this.arguments.set(name, new CommandOption({
			name,
			type,
			def,
			help
		}))
		return this
	}

	/**
	 * Add a subcommand to the command
	 * @param {Command} subcommand - Subcommand instance
	 * @returns {Command} - This command instance
	 */
	addSubcommand(subcommand) {
		this.subcommands.set(subcommand.name, subcommand)
		return this
	}

	/**
	 * Parse arguments and populate options
	 * @param {string[] | string} argv - Command line arguments
	 * @returns {CommandMessage} - Parsed command message
	 */
	parse(argv) {
		const msg = CommandMessage.parse(argv)

		// Check for subcommands first
		if (msg.args.length > 0 && this.subcommands.has(msg.args[0])) {
			const subcmdName = msg.args[0]
			if (this.subcommands.has(subcmdName)) {
				const subcmd = this.subcommands.get(subcmdName)
				// @ts-ignore
				return subcmd.parse(msg.args.slice(1))
			}
		}

		// Process options with type conversion and defaults
		const opts = { ...msg.opts }

		// Resolve aliases
		Object.keys(opts).forEach(key => {
			if (this.aliases.has(key)) {
				const realName = String(this.aliases.get(key))
				opts[realName] = opts[key]
				delete opts[key]
			}
		})

		this.options.forEach((option, name) => {
			if (!(name in opts)) {
				opts[name] = option.getDefault()
			} else {
				// Perform type conversion
				opts[name] = this.convertValue(opts[name], option.type, name)
			}
		})

		// Process arguments with type conversion and validation
		const args = []
		const argEntries = [...this.arguments.entries()]
		const requiredArgs = argEntries.filter(([_, arg]) => !arg.isOptional())

		// Validate required arguments
		if (msg.args.length < requiredArgs.length) {
			throw new CommandError(`Missing required arguments. Expected: ${requiredArgs.length}, Got: ${msg.args.length}`)
		}

		argEntries.forEach(([argName, arg], index) => {
			if (msg.args.length > index) {
				args[index] = this.convertValue(msg.args[index], arg.type, argName)
			} else if (argName === "*") {
				// Rest arguments – copy any remaining raw values
				args.push(...msg.args.slice(index))
			} else {
				args[index] = arg.getDefault()
			}
		})

		return new CommandMessage({
			args: args.filter(arg => arg !== undefined),
			opts
		})
	}

	/**
	 * Run the built-in help logic.
	 * Returns the help string; callers may print it or otherwise use it.
	 * @returns {string}
	 */
	runHelp() {
		return this.generateHelp()
	}

	/**
	 * Determine whether a function can be used as a constructor.
	 * @param {Function} fn - Function to test.
	 * @returns {boolean} True if callable with `new`, false otherwise.
	 */
	isConstructible(fn) {
		// Classes and constructor functions have a non-empty prototype.
		return typeof fn === "function" && fn.prototype && fn.prototype !== Object.prototype
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
			// Handle explicit false values
			return value !== "false" && value !== false
		} else if (type === Number) {
			const num = Number(value)
			if (Number.isNaN(num)) {
				throw new CommandError(`Invalid number for ${name}: ${value}`, {
					providedValue: value
				})
			}
			return num
		} else if (type === String) {
			return String(value)
		} else if (Array.isArray(type)) {
			// Enum validation
			if (!type.includes(value)) {
				throw new CommandError(`Invalid value for ${name}: ${value}\nValid values: ${type.join(', ')}`, {
					validValues: type,
					providedValue: value
				})
			}
			return value
		} else if (typeof type === "function" && type.name) {
			// Custom class conversion
			// @ts-ignore
			if (typeof type.from === "function") {
				try {
					// @ts-ignore
					return type.from(value)
				} catch (err) {
					throw new CommandError(`Failed to parse ${name}: ${err instanceof Error ? err.message : String(err)}`, {
						value,
						type: type.name,
						error: err instanceof Error ? err.message : String(err)
					})
				}
				// @ts-ignore
			} else if (typeof type.fromString === "function") {
				try {
					// @ts-ignore
					return type.fromString(value)
				} catch (err) {
					throw new CommandError(`Failed to parse ${name}: ${err instanceof Error ? err.message : String(err)}`, {
						value,
						type: type.name,
						error: err instanceof Error ? err.message : String(err)
					})
				}
			} else {
				// If the function is a constructor, instantiate it, otherwise invoke it.
				if (this.isConstructible(type)) {
					// @ts-ignore
					return new type(value)
				}
				return type(value)
			}
		}
		return value
	}

	/**
	 * Show help information
	 * @returns {string}
	 */
	generateHelp() {
		const rows = []

		// Usage line
		if (this.usage) {
			rows.push(`Usage: ${this.usage}`)
		} else {
			let usageStr = this.name
			// Add options
			this.options.forEach(opt => {
				if (opt.def !== false) { // Don't show boolean flags with false default
					usageStr += ` [--${opt.name}]`
				} else {
					usageStr += ` [--${opt.name}]`
				}
			})
			// Add arguments
			this.arguments.forEach(arg => {
				if (arg.isOptional()) {
					usageStr += ` [${arg.name}]`
				} else {
					usageStr += ` <${arg.name}>`
				}
			})
			rows.push(`Usage: ${usageStr}`)
		}

		rows.push("")

		// Description
		if (this.help) {
			rows.push(this.help)
			rows.push("")
		}

		// Arguments section
		if (this.arguments.size > 0) {
			rows.push("Arguments:")
			const arr = []
			this.arguments.forEach(arg => {
				const argObj = arg.toObject()
				arr.push([
					`  ${arg.isOptional() ? '[' : '<'}${argObj.name}${arg.isOptional() ? ']' : '>'}`,
					argObj.help + argObj.defaultText
				])
				// rows.push(`  ${arg.isOptional() ? '[' : '<'}${argObj.name}${arg.isOptional() ? ']' : '>'} ${argObj.help}${argObj.defaultText}`)
			})
			const logger = new Logger()
			rows.push(...logger.table(arr, [], { padding: 3 }))
			rows.push("")
		}

		// Options section
		if (this.options.size > 0) {
			rows.push("Options:")
			const arr = []
			this.options.forEach(opt => {
				const optObj = opt.toObject()
				let flagStr = `  --${optObj.name}`
				if (optObj.alias) {
					flagStr += `, -${optObj.alias}`
				}
				arr.push([flagStr, optObj.help + optObj.defaultText])
				// rows.push(`${flagStr} ${optObj.help}${optObj.defaultText}`)
			})
			const logger = new Logger()
			rows.push(...logger.table(arr, [], { padding: 3 }))
			rows.push("")
		}

		// Subcommands section
		if (this.subcommands.size > 0) {
			rows.push("Subcommands:")
			const arr = []
			this.subcommands.forEach(subcmd => {
				arr.push([`  ${subcmd.name}`, ` - ${subcmd.help || 'No description'}`])
				// rows.push(`  ${subcmd.name} - ${subcmd.help || 'No description'}`)
			})
			const logger = new Logger()
			rows.push(...logger.table(arr, [], { padding: 3 }))
			rows.push("")
		}

		return rows.join("\n")
	}

	toString() {
		return [
			this.constructor.name,
			this.generateHelp(),
		].join("\n")
	}
}

export default Command

import Message from "../Message.js"

/**
 * Command message class
 * Enhanced to handle equals syntax and validate inputs
 */
class CommandMessage extends Message {
	/** @type {string} */
	name

	/** @type {string[]} */
	args

	/** @type {object} */
	opts

	/** @type {CommandMessage[]} */
	children

	/**
	 * Create a new CommandMessage instance
	 * @param {object} input - Command message properties
	 * @param {*} [input.body] - Message body, used only to store original input if it is string
	 * @param {string} [input.name] - Command name
	 * @param {string[]} [input.args] - Command arguments
	 * @param {object} [input.opts] - Command options
	 * @param {object[]} [input.children] - Subcommands in their messages, usually it is only one or zero.
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			const msg = CommandMessage.parse(input)
			input = {
				body: input,
				name: msg.name,
				args: msg.args,
				opts: msg.opts,
			}
		}
		const {
			name = "",
			args = [],
			opts = {},
			children = [],
		} = input
		super(input)
		this.name = String(name)
		this.args = args.map(String)
		this.opts = opts
		this.children = children.map(c => CommandMessage.from(c))
	}

	/**
	 * @returns {string} Sub command name if exists otherwise empty string.
	 */
	get subCommand() {
		return this.children[0]?.name || ""
	}

	/**
	 * @returns {CommandMessage} Sub command message.
	 */
	get subCommandMessage() {
		return this.children[0] || ""
	}

	/**
	 * @param {any} msg
	 */
	add(msg) {
		this.children.push(CommandMessage.from(msg))
	}

	/**
	 * Convert command message to string
	 * @returns {string} - String representation
	 */
	toString() {
		const optsStr = Object.entries(this.opts)
			.map(([key, value]) => {
				if (value === true) {
					return `--${key}`
				} else {
					// Quote string values that contain spaces
					const valStr = String(value).includes(' ') ? `"${value}"` : value
					return `--${key} ${valStr}`
				}
			})
			.join(" ")

		const argsStr = this.args.map(arg => {
			// Quote string arguments that contain spaces
			const argStr = String(arg)
			return argStr.includes(' ') ? `"${argStr}"` : argStr
		}).join(" ")

		return `${optsStr} ${argsStr}`.trim()
	}
	/**
	 * Create CommandMessage instance from body
	 * @param {any} input - body to create message from
	 * @returns {CommandMessage} - Message instance
	 */
	static from(input) {
		if (input instanceof CommandMessage) return input
		return new CommandMessage(input)
	}
	/**
	 * Parse command line arguments into CommandMessage
	 * @param {string[] | string} argv - Command line arguments or a command string
	 * @returns {CommandMessage} - Parsed command message
	 */
	static parse(argv = []) {
		if ("string" === typeof argv) {
			// Handle quoted strings properly using more robust parsing
			const parts = []
			let i = 0
			const str = argv.trim()

			while (i < str.length) {
				// Skip whitespace
				while (i < str.length && str[i] === ' ') i++
				if (i >= str.length) break

				// Check for quotes
				if (str[i] === '"' || str[i] === "'") {
					const quote = str[i]
					i++
					let start = i
					while (i < str.length && str[i] !== quote) i++
					if (i < str.length) {
						parts.push(str.slice(start, i))
						i++
					} else {
						throw new Error(`Unmatched quote in argument: ${argv}`)
					}
				} else {
					// Regular argument
					let start = i
					while (i < str.length && str[i] !== ' ') i++
					parts.push(str.slice(start, i))
				}
			}

			argv = parts
		}

		/**
		 * @type {{args: string[], opts: Record<string, *>}}
		 */
		const result = { args: [], opts: {} }
		let i = 0

		const setOption = (key, value) => {
			if (undefined === result.opts[key]) {
				result.opts[key] = value
			}
			else {
				if (!Array.isArray(result.opts[key])) {
					result.opts[key] = [result.opts[key]]
				}
				result.opts[key].push(value)
			}
		}

		while (i < argv.length) {
			const curr = argv[i]

			if (curr.startsWith('--')) {
				const eqIndex = curr.indexOf('=')
				if (eqIndex > -1) {
					// Handle --option=value syntax
					const key = curr.slice(2, eqIndex)
					const value = curr.slice(eqIndex + 1)
					setOption(key, value)
					i++
				} else {
					const key = curr.slice(2)
					// Check if next argument is a value (not another flag)
					if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
						setOption(key, argv[i + 1])
						i += 2
					} else {
						setOption(key, true)
						i++
					}
				}
			} else if (curr.startsWith('-')) {
				// Handle short options like -v, -abc, -o value
				const key = curr.slice(1)

				// Check if it's a combined boolean flag like -abc
				if (key.length > 1) {
					// Split into individual flags
					for (const char of key) {
						setOption(char, true)
					}
					i++
				} else {
					// Single short flag
					if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
						setOption(key, argv[i + 1])
						i += 2
					} else {
						setOption(key, true)
						i++
					}
				}
			} else {
				result.args.push(curr)
				i++
			}
		}

		return new CommandMessage(result)
	}
}

export default CommandMessage

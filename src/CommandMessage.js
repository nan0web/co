import Message from "./Message.js"

/**
 * Command message class
 * Enhanced to handle equals syntax and validate inputs
 */
class CommandMessage extends Message {
	/** @type {string[]} */
	args

	/** @type {object} */
	opts

	/**
	 * Create a new CommandMessage instance
	 * @param {object} input - Command message properties
	 * @param {*} [input.body] - Message body, used only to store original input if it is string
	 * @param {string[]} [input.args] - Command arguments
	 * @param {object} [input.opts] - Command options
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			const msg = CommandMessage.parse(input)
			input = {
				body: input,
				args: msg.args,
				opts: msg.opts,
			}
		}
		const {
			args = [],
			opts = {},
		} = input
		super(input)
		this.args = args.map(String)
		this.opts = opts
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

		while (i < argv.length) {
			const curr = argv[i]

			if (curr.startsWith('--')) {
				const eqIndex = curr.indexOf('=')
				if (eqIndex > -1) {
					// Handle --option=value syntax
					const key = curr.slice(2, eqIndex)
					const value = curr.slice(eqIndex + 1)
					result.opts[key] = value
					i++
				} else {
					const key = curr.slice(2)
					// Check if next argument is a value (not another flag)
					if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
						result.opts[key] = argv[i + 1]
						i += 2
					} else {
						result.opts[key] = true
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
						result.opts[char] = true
					}
					i++
				} else {
					// Single short flag
					if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
						result.opts[key] = argv[i + 1]
						i += 2
					} else {
						result.opts[key] = true
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
}

export default CommandMessage

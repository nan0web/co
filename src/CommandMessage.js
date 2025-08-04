import Message from "./Message.js"

/**
 * Command message class
 */
class CommandMessage extends Message {
	/** @type {string[]} */
	args

	/** @type {object} */
	opts

	/**
	 * Create a new CommandMessage instance
	 * @param {object | string} input - Command message properties
	 * @param {string[]} input.args - Command arguments
	 * @param {object} input.opts - Command options
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
			const str = argv
			
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

		const result = { args: [], opts: {} }
		let i = 0

		while (i < argv.length) {
			const curr = argv[i]

			if (curr.startsWith('--')) {
				const key = curr.slice(2)
				// Check if next argument is a value (not another flag)
				if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
					result.opts[key] = argv[i + 1]
					i += 2
				} else {
					result.opts[key] = true
					i++
				}
			} else if (curr.startsWith('-')) {
				const key = curr.slice(1)
				// Check if next argument is a value (not another flag)
				if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
					result.opts[key] = argv[i + 1]
					i += 2
				} else {
					result.opts[key] = true
					i++
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
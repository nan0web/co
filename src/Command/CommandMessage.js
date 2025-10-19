import Message from "../Message.js"
import { str2argv } from "../utils/parse.js"

/**
 * Command message class
 * Enhanced to handle equals syntax and validate inputs
 */
export default class CommandMessage extends Message {
	/** @type {string} */
	#name = ""

	/** @type {string[]} */
	#argv = []

	/** @type {object} */
	#opts = {}

	/** @type {CommandMessage[]} */
	#children = []

	/**
	 * Create a new CommandMessage instance
	 * @param {object} input - Command message properties
	 * @param {*} [input.body] - Message body, used only to store original input if it is string
	 * @param {string} [input.name] - Command name
	 * @param {string[]} [input.argv] - Command arguments
	 * @param {object} [input.opts] - Command options
	 * @param {object[]} [input.children] - Subcommands in their messages, usually it is only one or zero.
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			const msg = CommandMessage.parse(input)
			input = {
				body: msg.body,
				name: msg.name,
				argv: msg.argv,
				opts: msg.opts,
				children: msg.children,
			}
		}
		const {
			name = "",
			argv = [],
			opts = {},
			children = [],
		} = input
		super(input)
		if (this.body) {
			const { name, argv, opts } = CommandMessage.parse(this.body)
			this.name = name
			this.argv = argv
			this.opts = opts
		}
		else {
			this.name = String(name)
			this.argv = argv.map(String)
			this.opts = opts
			this.children = children.map(c => CommandMessage.from(c))
		}
		this.updateBody()
	}

	/**
	 * @returns {string} Command name
	 */
	get name() {
		return this.#name
	}

	/**
	 * @param {string} value - Command name
	 */
	set name(value) {
		this.#name = String(value)
		this.updateBody()
	}

	/**
	 * @returns {string[]} Command arguments incuding name
	 */
	get args() {
		return [this.name, ...this.#argv].filter(Boolean)
	}

	/**
	 * @returns {string[]} Command arguments without name (first argument)
	 */
	get argv() {
		return this.#argv
	}

	/**
	 * @param {string[]} value - Command arguments
	 */
	set argv(value) {
		this.#argv = value.map(String)
		this.updateBody()
	}

	/**
	 * @returns {object} Command options
	 */
	get opts() {
		return this.#opts
	}

	/**
	 * @param {object} value - Command options
	 */
	set opts(value) {
		this.#opts = value
		this.updateBody()
	}

	/**
	 * @returns {CommandMessage[]} Subcommands
	 */
	get children() {
		return this.#children
	}

	/**
	 * @param {CommandMessage[]} value - Subcommands
	 */
	set children(value) {
		this.#children = value.map(c => CommandMessage.from(c))
		this.updateBody()
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
	 * Update message body based on current name, args and opts
	 * @returns {void}
	 */
	updateBody() {
		this.body = this.toString()
	}

	/**
	 * Convert command message to string
	 * @returns {string} - String representation
	 */
	toString() {
		const optsStr = Object.entries(this.opts ?? {})
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

		const argsStr = this.argv.map(arg => {
			// Quote string arguments that contain spaces
			const argStr = String(arg)
			return argStr.includes(' ') ? `"${argStr}"` : argStr
		}).join(" ")

		const tab = "  "

		return [
			`${this.name} ${argsStr} ${optsStr}`.trim(),
			...this.children.map(s => `${tab}${s}`),
		].join("\n")
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
			argv = str2argv(argv)
		}

		/**
		 * @type {{name: string, argv: string[], opts: Record<string, *>}}
		 */
		const result = { name: "", argv: [], opts: {} }
		if (argv.length > 0 && !argv[0].startsWith("-")) {
			result.name = argv[0]
		}
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
				if ("" !== curr && result.name !== curr) {
					result.argv.push(curr)
				}
				i++
			}
		}

		return new CommandMessage(result)
	}
}

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

			const parts = argv.match(/(?:[^\s"]+|"[^"]*"|'[^']*')+/g) || []
			argv = parts.map(part => part.replace(/^["']|["']$/g, ''))
		}
		const result = { args: [], opts: {} }
		let i = 0

		for (i = 0; i < argv.length; i++) {
			const curr = argv[i]

			if (curr.startsWith('--')) {
				result.opts[curr.slice(2)] = true
			} else if (curr.startsWith('-')) {
				if (i + 1 < argv.length && !argv[i + 1].startsWith('-')) {
					result.opts[curr.slice(1)] = argv[i + 1]
					i++
				} else {
					result.opts[curr.slice(1)] = true
				}
			} else {
				result.args.push(curr)
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
			.map(([key, value]) => value === true ? `--${key}` : `-${key} ${value}`)
			.join(" ")

		return `${optsStr} ${this.args.join(" ")}`
	}
}

export default CommandMessage

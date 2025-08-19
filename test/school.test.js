import { describe, it } from "node:test"
import assert from "node:assert/strict"
import CommandMessage from "../src/Command/CommandMessage.js"
import CommandOption from "../src/Command/CommandOption.js"
import Command from "../src/Command/Command.js"

/**
 * This is a test from the certificates drawer.
 */
class CLIAppCommandOptions {
	lesson = new CommandOption({
		name: "lesson", alias: "l", type: "", def: "", alias: "l", help: "Provide lesson to work with, use command list to show all"
	})
	force = new CommandOption({
		name: "force", alias: "f", type: !0, def: false, help: "Force flag to send emails more than once or draw certificate if it exists already"
	})
	provider = new CommandOption({
		name: "provider", alias: "p", type: "", def: "", help: "Select mailing provider"
	})
	to = new CommandOption({
		name: "to", type: "", def: "", help: "Specific recipient(s) separated by comma. Match with email, tel, certificate no."
	})
	cc = new CommandOption({
		name: "cc", type: "", def: "", help: "CC recipient(s) separated by comma. Match with email, tel, certificate no."
	})
	bcc = new CommandOption({
		name: "bcc", type: "", def: "", help: "BCC recipient(s) separated by comma. Match with email, tel, certificate no."
	})
	help = new CommandOption({
		name: "help", alias: "h", type: Boolean, def: !1, help: "Show help",
	})
	version = new CommandOption({
		name: "version", alias: "v", type: Boolean, def: !1, help: "Show version"
	})
}

class CLIAppCommandOpts {
	lesson = ""
	force = false
	provider = ""
	to = ""
	cc = ""
	bcc = ""
	help = false
	version = false
	constructor(input = {}) {
		const {
			lesson = "",
			force = false,
			provider = "",
			to = "",
			cc = "",
			bcc = "",
			help = false,
			version = false,
		} = input
		this.lesson = String(lesson)
		this.force = Boolean(force)
		this.provider = String(provider)
		this.to = String(to)
		this.cc = String(cc)
		this.bcc = String(bcc)
		this.help = Boolean(help)
		this.version = Boolean(version)
	}
	static from(input) {
		if (input instanceof CLIAppCommandOpts) return input
		return new CLIAppCommandOpts(input)
	}
}

class CLIAppCommandArguments {
	list = new CommandOption({
		type: String, help: "Show lessons and providers available to work with"
	})
	draw = new CommandOption({
		type: String, help: "Command to draw certificates"
	})
	send = new CommandOption({
		type: String, help: "Command to send emails"
	})
	ui = new CommandOption({
		type: String, help: "Use terminal application with UI"
	})
}

class CLIAppCommandMessage extends CommandMessage {
	/** @type {CLIAppCommandOpts} */
	opts
	/**
	 * Create a new CommandMessage instance
	 * @param {object} input - Command message properties
	 * @param {*} [input.body] - Message body, used only to store original input if it is string
	 * @param {string[]} [input.args] - Command arguments
	 * @param {object} [input.opts] - Command options
	 */
	constructor(input) {
		super(input)
		const {
			opts
		} = input
		this.opts = CLIAppCommandOpts.from(opts)
	}
}

class App extends Command {
	constructor() {
		const config = {
			options: new CLIAppCommandOptions(),
			arguments: new CLIAppCommandArguments()
		}
		super(config)
	}
	/**
	 * Parse arguments and populate options
	 * @param {string[] | string} argv - Command line arguments
	 * @returns {CLIAppCommandMessage} - Parsed command message
	 */
	parse(argv) {
		const msg = super.parse(argv)
		return new CLIAppCommandMessage(msg)
	}
}

describe("Certificates short command bug", () => {
	it("should process short aliases", () => {
		const app = new App()
		const msg = app.parse("send -l 250516 --to email@example.com -p eml --bcc another@example.com")
		assert.equal(msg.opts.lesson, "250516")
		assert.equal(msg.opts.to, "email@example.com")
		assert.equal(msg.opts.provider, "eml")
		assert.equal(msg.opts.bcc, "another@example.com")
	})
})

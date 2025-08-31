import { describe, it } from "node:test"
import assert from "node:assert"
import Command from "./Command.js"
import CommandMessage from "./CommandMessage.js"

/**
 * Custom CommandMessage subclass for testing
 */
class CustomCommandMessage extends CommandMessage {
	/** @type {string} */
	customField = "default"

	constructor(input = {}) {
		const { customField = "default", ...rest } = input
		super(rest)
		this.customField = String(customField)
	}

	static from(input) {
		if (input instanceof CustomCommandMessage) return input
		return new CustomCommandMessage(input)
	}
}

/**
 * Custom Command subclass that uses CustomCommandMessage
 */
class CustomCommand extends Command {
	static Message = CustomCommandMessage

	constructor() {
		super({
			name: "custom",
			help: "A custom command for testing"
		})
		this.addOption("test", Boolean, false, "Test option")
	}
}

describe("Command custom message type", () => {
	it("should use custom message type when parsing", () => {
		const cmd = new CustomCommand()
		const msg = cmd.parse(["custom", "--test"])

		assert.ok(msg instanceof CustomCommandMessage)
		assert.strictEqual(msg.customField, "default")
		assert.strictEqual(msg.opts.test, true)
	})

	it("should preserve custom message type in subcommands", () => {
		const mainCmd = new Command({ name: "main" })
		const customCmd = new CustomCommand()
		mainCmd.addSubcommand(customCmd)

		const msg = mainCmd.parse(["custom", "--test"])
		const subMsg = msg.children[0]

		assert.ok(subMsg instanceof CustomCommandMessage)
		assert.strictEqual(subMsg.opts.test, true)
		assert.strictEqual(subMsg.customField, "default")
	})
})

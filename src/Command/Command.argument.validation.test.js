import { describe, it } from "node:test"
import assert from "node:assert"
import Command from "./Command.js"
import CommandError from "./CommandError.js"

describe("Command argument strict validation", () => {
	it("throws CommandError for invalid number argument", () => {
		const cmd = new Command({
			name: "test",
			arguments: {
				count: [Number, null, "Number of items"]
			}
		})

		try {
			cmd.parse(["test", "not-a-number"])
			assert.fail("Expected CommandError")
		} catch (err) {
			assert.ok(err instanceof CommandError)
			assert.ok(err.message.includes("Invalid number for count"))
		}
	})

	it("throws CommandError for missing required arguments", () => {
		const cmd = new Command({
			name: "test",
			help: "Test command",
			arguments: {
				requiredArg: {
					type: String, def: "", help: "A required argument", required: true
				}
			}
		})

		try {
			cmd.parse(["test"])
			assert.fail("Expected CommandError")
		} catch (err) {
			assert.ok(err instanceof CommandError)
			assert.ok(err.message.includes("Missing required arguments"))
		}
	})

	it("correctly parses valid arguments", () => {
		const processCmd = new Command({
			name: "process",
			help: "Process items",
			arguments: {
				"*": { help: "Files to process" }
			},
		})
		const watchCmd = new Command({
			name: "watch",
			help: "Watch for items",
			arguments: {
				"*": { help: "Files to watch for" }
			},
		})
		const cmd = new Command({
			name: "test",
			help: "Test command",
			arguments: {
				"*": { help: "Files to process or watch" }
			},
			subcommands: [processCmd, watchCmd],
		})

		const msg = cmd.parse(["watch", "20", "input.txt"])
		const sub = msg.children[0]
		assert.strictEqual(sub.args[0], "20")
		assert.strictEqual(sub.args[1], "input.txt")
	})

	it.todo("handles complex argument types properly", () => {
		class Complex {
			value
			count

			constructor(input = {}) {
				const { value = "", count = 0 } = input
				this.value = String(value)
				this.count = Number(count)
			}

			toString() {
				return [this.count, this.value].join("\n")
			}

			static fromString(str) {
				const [count, ...value] = String(str).split("\n")
				return new Complex({ count: Number(count), value: value.join("\n") })
			}
		}

		const cmd = new Command({
			name: "test",
			help: "Test command with complex arguments",
			arguments: {
				complex: [Complex, new Complex(), "Complex config"]
			}
		})

		const complexValue = new Complex({ value: "test", count: 5 })
		const argv = ["test", "5\ntest"]
		const msg = cmd.parse(argv)

		assert.ok(msg.args[0] instanceof Complex)
		assert.strictEqual(msg.args[0].count, 5)
		assert.strictEqual(msg.args[0].value, "test")
	})
})

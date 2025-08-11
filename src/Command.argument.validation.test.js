import { describe, it } from "node:test"
import assert from "node:assert"
import Command from "./Command.js"
import CommandError from "./CommandError.js"

describe("Command argument strict validation", () => {
	it("throws CommandError for invalid number argument", () => {
		const cmd = new Command({
			arguments: {
				count: [Number, "Number of items"]
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
})

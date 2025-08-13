import { describe, it } from "node:test"
import assert from "node:assert"
import CommandError from "./CommandError.js"

describe("CommandError class", () => {
	it("should create instance with default values", () => {
		const error = new CommandError()
		assert.strictEqual(error.message, "")
		assert.strictEqual(error.data, null)
	})

	it("should create instance with provided values", () => {
		const message = "Test error"
		const data = { test: "value" }
		const error = new CommandError(message, data)
		
		assert.strictEqual(error.message, message)
		assert.strictEqual(error.data, data)
	})

	it("should convert to string representation", () => {
		const message = "Test error"
		const data = { test: "value" }
		const error = new CommandError(message, data)
		const str = error.toString()
		
		assert.ok(str.startsWith(message))
		assert.ok(str.includes(JSON.stringify(data, null, 2)))
	})
})
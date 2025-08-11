import { describe, it } from "node:test"
import assert from "node:assert"
import CommandMessage from "./CommandMessage.js"

describe("CommandMessage class", () => {
	it("should create instance with default values", () => {
		const cmd = new CommandMessage()
		assert.deepStrictEqual(cmd.args, [])
		assert.deepStrictEqual(cmd.opts, {})
		assert.strictEqual(cmd.body, "")
	})

	it("should create instance with provided values", () => {
		const args = ["arg1", "arg2"]
		const opts = { option1: "value1", option2: true }
		const body = "command with args"
		const cmd = new CommandMessage({ args, opts, body })

		assert.deepStrictEqual(cmd.args, args)
		assert.deepStrictEqual(cmd.opts, opts)
		assert.strictEqual(cmd.body, body)
	})

	it("should parse command with only arguments", () => {
		const argv = ["cmd", "arg1", "arg2"]
		const cmd = CommandMessage.parse(argv)

		assert.deepStrictEqual(cmd.args, ["cmd", "arg1", "arg2"])
		assert.deepStrictEqual(cmd.opts, {})
	})

	it("should parse command with long options", () => {
		const argv = ["cmd", "--help", "--version"]
		const cmd = CommandMessage.parse(argv)

		assert.deepStrictEqual(cmd.args, ["cmd"])
		assert.deepStrictEqual(cmd.opts, { help: true, version: true })
	})

	it("should parse command with short options and values", () => {
		const argv = ["cmd", "-f", "file.txt", "-v"]
		const cmd = CommandMessage.parse(argv)

		assert.deepStrictEqual(cmd.args, ["cmd"])
		assert.deepStrictEqual(cmd.opts, { f: "file.txt", v: true })
	})

	it("should convert to string representation", () => {
		const cmd = new CommandMessage({
			body: "test",
			args: ["arg1", "arg2"],
			opts: { flag: true, file: "test.txt" }
		})
		const str = cmd.toString()

		assert.ok(str.includes("test"))
		assert.ok(str.includes("--flag"))
		assert.ok(str.includes("--file test.txt"))
		assert.ok(str.includes("arg1 arg2"))
	})

	it("should handle string input in constructor", () => {
		const input = "simple command"
		const cmd = new CommandMessage(input)

		assert.deepStrictEqual(cmd.args, ["simple", "command"])
		assert.deepStrictEqual(cmd.opts, {})
		assert.strictEqual(cmd.body, input)
	})

	it("should handle complex command string input in constructor", () => {
		const input = 'complex --ignore-rules "some operators and" -v values --but --with --no -eol'
		const cmd = new CommandMessage(input)

		assert.deepStrictEqual(cmd.args, ["complex"])
		assert.deepStrictEqual(cmd.opts, {
			"ignore-rules": "some operators and",
			v: "values",
			but: true,
			with: true,
			no: true,
			// -eol === -e -o -l
			e: true, o: true, l: true,
		})
	})
})

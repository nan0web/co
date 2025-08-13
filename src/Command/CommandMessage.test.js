import { describe, it, before, after } from "node:test"
import assert from "node:assert"
import { to } from "@nan0web/types"
import { NoLogger } from "@nan0web/log"
import CommandMessage from "./CommandMessage.js"

describe("CommandMessage class", () => {
	let originalConsole
	before(() => {
		originalConsole = console
		console = new NoLogger({ level: NoLogger.LEVELS.debug })
	})
	after(() => {
		console = originalConsole
	})
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
	/**
	 * @docs
	 * ## Usage
	 * ### Command Message
	 */
	it("Create and parse a CommandMessage", () => {
		// import { CommandMessage } from '@nan0web/co'

		const cmd = new CommandMessage('git commit -m "Initial commit" --verbose')
		console.log(cmd.args) // ['git', 'commit', 'Initial commit']
		console.log(cmd.opts) // { m: 'Initial commit', verbose: true }
		assert.deepEqual(cmd.args, ["git", "commit"])
		assert.deepEqual(cmd.opts, { m: "Initial commit", verbose: true })
	})
	/**
	 * @docs
	 * ## Usage
	 * ### Command Message
	 */
	it("Using a custom CommandOption for better IDE autocompletion", () => {
		// import { CommandMessage, CommandOption } from '@nan0web/co'
		class AppCommandOpts {
			/** @type {string} */
			m = ""
			/** @type {boolean} */
			verbose = false
			/**
			 * @param {object} input
			 * @param {string} [input.m=""]
			 * @param {boolean} [input.verbose=false]
			 */
			constructor(input = {}) {
				const { m = "", verbose = false } = input
				this.m = String(m)
				this.verbose = Boolean(verbose)
			}
			/**
			 * @param {object} input
			 * @returns {AppCommandOpts}
			 */
			static from(input) {
				if (input instanceof AppCommandOpts) return input
				return new AppCommandOpts(input)
			}
		}
		class AppCommandMessage extends CommandMessage {
			/** @type {AppCommandOpts} */
			opts
			constructor(input) {
				if ("string" === typeof input || Array.isArray(input)) {
					input = CommandMessage.parse(input)
				}
				super(input)
				const { opts = {} } = input
				this.opts = AppCommandOpts.from(opts)
			}
			/**
			 * @param {object} input
			 * @returns {AppCommandMessage}
			 */
			static from(input) {
				if (input instanceof AppCommandMessage) return input
				return new AppCommandMessage(input)
			}
		}

		const msg = new AppCommandMessage('git commit -m "Initial commit" --verbose')
		console.log(msg.args) // ['git', 'commit', 'Initial commit']
		// // Autocomplete for msg.opts should have { m, verbose } now.
		console.log(msg.opts) // AppCommandOpts({ m: 'Initial commit', verbose: true })
		console.log(msg.opts instanceof AppCommandOpts) // true
		assert.deepEqual(msg.args, ["git", "commit"])
		assert.deepEqual(to(Object)(msg.opts), { m: "Initial commit", verbose: true })
		assert.ok(msg.opts instanceof AppCommandOpts)
	})
})

import { describe, it, before, after } from "node:test"
import assert from "node:assert"
import Message from "./Message.js"
import { NoLogger } from "@nan0web/log"

describe("Message class", () => {
	let originalConsole
	before(() => {
		originalConsole = console
		console = new NoLogger({ level: NoLogger.LEVELS.debug })
	})
	after(() => {
		console = originalConsole
	})
	it("should create instance with default values", () => {
		const msg = new Message()
		assert.strictEqual(msg.body, "")
		assert.ok(msg.time > 0)
	})

	it("should create instance with provided values", () => {
		const body = "Hello world"
		const time = 1700000000000
		const msg = new Message({ body, time })

		assert.strictEqual(msg.body, body)
		assert.strictEqual(msg.time.getTime(), time)
	})

	it("should convert to object", () => {
		const body = "Test message"
		const time = 1700000000000
		const msg = new Message({ body, time })
		const obj = msg.toObject()

		assert.deepStrictEqual(obj, { body, time })
	})

	it("should convert to string", () => {
		const body = "Test message"
		const time = 1700000000000
		const msg = new Message({ body, time })
		const str = msg.toString()

		assert.ok(str.startsWith("2023-11-14T22:13:20"))
		assert.ok(str.endsWith(body))
	})

	it("should create from string input", () => {
		const body = "Direct string input"
		const msg = Message.from(body)

		assert.ok(msg instanceof Message)
		assert.strictEqual(msg.body, body)
	})

	it("should return same instance when from receives Message", () => {
		const original = new Message({ body: "test" })
		const returned = Message.from(original)

		assert.strictEqual(original, returned)
	})
	/**
	 * @docs
	 * ## Usage
	 * ### Basic Message
	 */
	it("Messages contain body and time when they were created", () => {
		// import { Message } from '@nan0web/co'

		const msg = new Message('Hello world')
		console.log(String(msg)) // 2023-04-01T10:00:00 Hello world
		assert.equal(String(msg), msg.time.toISOString().split(".")[0] + " Hello world")
	})
})

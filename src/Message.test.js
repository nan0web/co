import { describe, it, before, after } from "node:test"
import assert from "node:assert"
import { NoLogger } from "@nan0web/log"
import Message from "./Message.js"

class ParseBody {
	static help = {
		help: "Show help"
	}
	/** @type {boolean} */
	help = false
	static fail = {
		help: "Filter only failed tests",
		alias: "f"
	}
	/** @type {boolean} */
	fail = false
	static skip = {
		help: "Filter only skipped tests",
		alias: "s"
	}
	/** @type {boolean} */
	skip = false
	static todo = {
		help: "Filter only todo tests",
		alias: "d"
	}
	/** @type {boolean} */
	todo = false
	static format = {
		help: "Output format: txt, md, html",
		options: ["txt", "md", "html"],
		defaultValue: "txt"
	}
	/**
	 * Todo output format.
	 * One of txt, md, html.
	 * @type {string}
	 */
	format
	constructor(input = {}) {
		const {
			help = this.help,
			fail = this.fail,
			skip = this.skip,
			todo = this.todo,
			format = this.format,
		} = Message.parseBody(input, ParseBody)
		this.help = Boolean(help)
		this.fail = Boolean(fail)
		this.skip = Boolean(skip)
		this.todo = Boolean(todo)
		this.format = String(format)
	}
	/**
	 * @param {Partial<ParseBody>} input
	 * @returns {ParseBody}
	 */
	static from(input) {
		if (input instanceof ParseBody) return input
		return new ParseBody(input)
	}
}

class ParseMessage extends Message {
	static Body = ParseBody
	/** @type {ParseBody} */
	body
	constructor(input = {}) {
		super(input)
		this.body = ParseBody.from(input.body ?? {})
	}
}

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
		assert.strictEqual(msg.body, undefined)
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
	it("should contain body and time when they were created", () => {
		const msg = Message.from('Hello world')
		console.log(String(msg)) // 2023-04-01T10:00:00 Hello world
		assert.equal(String(msg), msg.time.toISOString() + " Hello world")
	})
	it("should show errors for invalid schema", () => {
		class Body {
			/** @type {string} */
			name
			static birthday = {
				/**
				 * @param {Date} b
				 * @returns {string | true}
				 */
				validation: (b) => new Date(b).getFullYear() < 1930 ? "Too old" : true,
			}
			/** @type {Date} */
			birthday
			/**
			 * @param {Patial<Schema>} input
			 */
			constructor(input = {}) {
				const {
					name = "",
					birthday = new Date(),
				} = input
				this.name = String(name)
				this.birthday = new Date(birthday)
			}
			/**
			 * @param {string} name
			 * @returns {string[] | true}
			 */
			static nameValidation(name) {
				if (name.length < 3) {
					return "Too short"
				}
				return true
			}
		}
		class ValidMessage extends Message {
			static Body = Body
			/** @type {Schema} */
			body
			/**
			 * @param {Partial<ValidMessage>} input
			 */
			constructor(input = {}) {
				super(input)
				this.body = new Body(input.body ?? {})
			}
		}
		const msg = new ValidMessage({ body: { name: "I" } })
		const errors = msg.getErrors()
		assert.deepStrictEqual(errors, { name: [ "Too short" ] })
		assert.equal(msg.isValid, false)

		const old = new ValidMessage({ body: { name: "John", birthday: "1910-10-01" } })
		const errors2 = old.getErrors()
		assert.deepStrictEqual(errors2, { birthday: [ "Too old" ] })
		assert.equal(old.isValid, false)
	})

	it("should parse body by default", () => {
		const msg = new ParseMessage({ body: { skip: 1 } })
		assert.deepStrictEqual({ ...msg.body }, {
			format: "txt",
			fail: false,
			help: false,
			skip: true,
			todo: false,
		})
	})

	it("should throw a message on invalid input", () => {
		assert.throws(() => {
			new ParseMessage({ body: { skip: 1, format: "invalid" } })
		}, new TypeError("Enumeration must have one value of\n- txt\n- md\n- html\nbut provided\ninvalid"))
	})
})

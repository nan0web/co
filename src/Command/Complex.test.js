import { describe, it } from "node:test"
import assert from "node:assert"
import CommandError from "./CommandError.js"

class Complex {
	value
	count
	constructor(input = {}) {
		const {
			value = "",
			count = 0,
		} = input
		this.value = String(value)
		this.count = Number(count)
	}
	toString() {
		return [this.count, this.value].join("\n")
	}
	static fromString(str) {
		const [count, ...value] = String(str).split("\n")
		return new Complex({ count, value: value.join("\n") })
	}
	static from(input) {
		if (input instanceof Complex) return input
		return new Complex(input)
	}
}

class ComplexWithValidation extends Complex {
	constructor(input = {}) {
		super(input)
		if (this.count <= 0) {
			throw new CommandError("Count must be greater than zero", this)
		}
	}
}

describe("Complex class", () => {
	it("should create instance with default values", () => {
		const complex = new Complex()
		assert.strictEqual(complex.value, "")
		assert.strictEqual(complex.count, 0)
	})

	it("should create instance with provided values", () => {
		const complex = new Complex({ value: "test", count: 5 })
		assert.strictEqual(complex.value, "test")
		assert.strictEqual(complex.count, 5)
	})

	it("should convert to string", () => {
		const complex = new Complex({ value: "test", count: 5 })
		const str = complex.toString()
		assert.strictEqual(str, "5\ntest")
	})

	it("should create from string", () => {
		const complex = Complex.fromString("5\ntest\nvalue")
		assert.strictEqual(complex.count, 5)
		assert.strictEqual(complex.value, "test\nvalue")
	})

	it("should handle from with Complex instance", () => {
		const original = new Complex({ value: "test", count: 5 })
		const returned = Complex.from(original)
		assert.strictEqual(original, returned)
	})

	it("should handle from with object", () => {
		const input = { value: "test", count: 5 }
		const complex = Complex.from(input)
		assert.ok(complex instanceof Complex)
		assert.strictEqual(complex.value, "test")
		assert.strictEqual(complex.count, 5)
	})
})

describe("ComplexWithValidation class", () => {
	it("should create instance with positive count", () => {
		const complex = new ComplexWithValidation({ value: "test", count: 5 })
		assert.strictEqual(complex.value, "test")
		assert.strictEqual(complex.count, 5)
	})

	it("should throw error with negative count", () => {
		try {
			new ComplexWithValidation({ value: "test", count: -1 })
			assert.fail("Should have thrown CommandError")
		} catch (err) {
			assert.ok(err instanceof CommandError)
			assert.ok(err.message.includes("Count must be greater than zero"))
		}
	})

	it("should throw error with zero count", () => {
		try {
			new ComplexWithValidation({ value: "test", count: 0 })
			assert.fail("Should have thrown CommandError")
		} catch (err) {
			assert.ok(err instanceof CommandError)
			assert.ok(err.message.includes("Count must be greater than zero"))
		}
	})
})

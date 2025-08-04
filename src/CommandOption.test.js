import { describe, it } from 'node:test'
import assert from 'node:assert'
import CommandOption from './CommandOption.js'
import CommandError from './CommandError.js'

// Mock Complex classes for testing
class Complex {
	value
	count

	constructor(input = {}) {
		const { value = '', count = 0 } = input
		this.value = String(value)
		this.count = Number(count)
		if (isNaN(this.count)) {
			throw new CommandError("Count must be a number")
		}
	}

	toString() {
		return [this.count, this.value].join('\n')
	}

	static fromString(str) {
		const [count, ...value] = String(str).split('\n')
		return new Complex({ count, value: value.join('\n') })
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
			throw new CommandError('Count must be greater than zero', this)
		}
	}
	static fromString(str) {
		return new ComplexWithValidation(super.fromString(str))
	}
	static from(input) {
		if (input instanceof ComplexWithValidation) return input
		return new ComplexWithValidation(input)
	}
}

describe('CommandOption class', () => {
	describe('constructor', () => {
		it('should create instance with default config', () => {
			const option = new CommandOption()
			assert.strictEqual(option.name, '')
			assert.strictEqual(option.type, String)
			assert.strictEqual(option.defaultValue, null)
			assert.strictEqual(option.help, '')
			assert.deepStrictEqual(option.meta, {})
		})

		it('should create instance from array config', () => {
			const option = new CommandOption(['test', 42, 'Help text'])
			assert.strictEqual(option.name, 'test')
			assert.strictEqual(option.type, Number)
			assert.strictEqual(option.defaultValue, 42)
			assert.strictEqual(option.help, 'Help text')
			assert.deepStrictEqual(option.meta, {})
		})

		it('should create instance from object config', () => {
			const config = {
				name: 'verbose',
				type: Boolean,
				defaultValue: false,
				help: 'Enable verbose output',
				meta: { required: true }
			}
			const option = new CommandOption(config)
			assert.strictEqual(option.name, 'verbose')
			assert.strictEqual(option.type, Boolean)
			assert.strictEqual(option.defaultValue, false)
			assert.strictEqual(option.help, 'Enable verbose output')
			assert.deepStrictEqual(option.meta, { required: true })
		})

		it('should handle Complex type in constructor', () => {
			const config = {
				name: 'complex',
				type: Complex,
				defaultValue: new Complex({ value: 'default', count: 1 }),
				help: 'A complex value'
			}
			const option = new CommandOption(config)
			assert.strictEqual(option.name, 'complex')
			assert.strictEqual(option.type, Complex)
			assert.ok(option.defaultValue instanceof Complex)
			assert.strictEqual(option.defaultValue.value, 'default')
			assert.strictEqual(option.defaultValue.count, 1)
			assert.strictEqual(option.help, 'A complex value')
		})

		it('should handle ComplexWithValidation type in constructor', () => {
			const config = {
				name: 'validatedComplex',
				type: ComplexWithValidation,
				defaultValue: new ComplexWithValidation({ value: 'validated', count: 5 }),
				help: 'A validated complex value'
			}
			const option = new CommandOption(config)
			assert.strictEqual(option.name, 'validatedComplex')
			assert.strictEqual(option.type, ComplexWithValidation)
			assert.ok(option.defaultValue instanceof ComplexWithValidation)
			assert.strictEqual(option.defaultValue.value, 'validated')
			assert.strictEqual(option.defaultValue.count, 5)
			assert.strictEqual(option.help, 'A validated complex value')
		})
	})

	describe('toObject method', () => {
		it('should return object representation of option', () => {
			const config = {
				name: 'output',
				type: String,
				defaultValue: 'stdout',
				help: 'Output destination',
				meta: { alias: 'o' }
			}
			const option = new CommandOption(config)
			const obj = option.toObject()

			assert.deepStrictEqual(obj, {
				name: 'output',
				type: String,
				defaultValue: 'stdout',
				help: 'Output destination',
				meta: { alias: 'o' }
			})
		})

		it('should return object with Complex type', () => {
			const complexValue = new Complex({ value: 'test', count: 3 })
			const option = new CommandOption({
				name: 'data',
				type: Complex,
				defaultValue: complexValue,
				help: 'Complex data structure'
			})

			const obj = option.toObject()
			assert.strictEqual(obj.name, 'data')
			assert.strictEqual(obj.type, Complex)
			assert.strictEqual(obj.defaultValue, complexValue)
			assert.strictEqual(obj.help, 'Complex data structure')
			assert.deepStrictEqual(obj.meta, {})
		})
	})

	describe('from static method', () => {
		it('should return same instance if already CommandOption', () => {
			const original = new CommandOption({ name: 'test' })
			const returned = CommandOption.from(original)
			assert.strictEqual(original, returned)
		})

		it('should create new instance from object config', () => {
			const config = {
				name: 'input',
				type: String,
				defaultValue: '',
				help: 'Input file path'
			}
			const option = CommandOption.from(config)
			assert.ok(option instanceof CommandOption)
			assert.strictEqual(option.name, 'input')
			assert.strictEqual(option.type, String)
			assert.strictEqual(option.defaultValue, '')
			assert.strictEqual(option.help, 'Input file path')
		})

		it('should create new instance from array config', () => {
			const option = CommandOption.from(['mode', 'development', 'Application mode'])
			assert.ok(option instanceof CommandOption)
			assert.strictEqual(option.name, 'mode')
			assert.strictEqual(option.type, String)
			assert.strictEqual(option.defaultValue, 'development')
			assert.strictEqual(option.help, 'Application mode')
		})

		it('should handle Complex type in from method', () => {
			const complexConfig = {
				name: 'complexData',
				type: Complex,
				defaultValue: new Complex({ value: 'data', count: 10 }),
				help: 'Complex data with string and count'
			}
			const option = CommandOption.from(complexConfig)
			assert.ok(option instanceof CommandOption)
			assert.strictEqual(option.name, 'complexData')
			assert.strictEqual(option.type, Complex)
			assert.ok(option.defaultValue instanceof Complex)
			assert.strictEqual(option.defaultValue.value, 'data')
			assert.strictEqual(option.defaultValue.count, 10)
			assert.strictEqual(option.help, 'Complex data with string and count')
		})

		it('should handle ComplexWithValidation type in from method', () => {
			const validatedComplexConfig = {
				name: 'validatedData',
				type: ComplexWithValidation,
				defaultValue: new ComplexWithValidation({ value: 'secure', count: 7 }),
				help: 'Validated complex data'
			}
			const option = CommandOption.from(validatedComplexConfig)
			assert.ok(option instanceof CommandOption)
			assert.strictEqual(option.name, 'validatedData')
			assert.strictEqual(option.type, ComplexWithValidation)
			assert.ok(option.defaultValue instanceof ComplexWithValidation)
			assert.strictEqual(option.defaultValue.value, 'secure')
			assert.strictEqual(option.defaultValue.count, 7)
			assert.strictEqual(option.help, 'Validated complex data')
		})

		it('should preserve meta object when creating from config', () => {
			const configWithMeta = {
				name: 'config',
				type: Object,
				defaultValue: { debug: true },
				help: 'Configuration object',
				meta: {
					alias: 'c',
					required: false,
					hidden: true
				}
			}
			const option = CommandOption.from(configWithMeta)
			assert.ok(option instanceof CommandOption)
			assert.deepStrictEqual(option.meta, {
				alias: 'c',
				required: false,
				hidden: true
			})
		})
	})

	describe('type handling', () => {
		it('should correctly assign function types', () => {
			const option = new CommandOption({
				name: 'count',
				type: Number,
				defaultValue: 0
			})
			assert.strictEqual(option.type, Number)
		})

		it('should correctly assign array types', () => {
			const option = new CommandOption({
				name: 'items',
				type: Array,
				defaultValue: []
			})
			assert.strictEqual(option.type, Array)
		})

		it('should correctly assign custom class types', () => {
			const option = new CommandOption({
				name: 'complex',
				type: Complex,
				defaultValue: new Complex()
			})
			assert.strictEqual(option.type, Complex)
		})

		it('should correctly assign validated custom class types', () => {
			const option = new CommandOption({
				name: 'validated',
				type: ComplexWithValidation,
				defaultValue: new ComplexWithValidation({ count: 1 })
			})
			assert.strictEqual(option.type, ComplexWithValidation)
		})
	})

	describe('ComplexWithValidation parsing from argv string', () => {
		it('should parse valid complex string value', () => {
			// Simulate parsing from argv: "5\nsample value"
			const argvString = '5\nsample value'
			const parsedValue = ComplexWithValidation.fromString(argvString)

			assert.ok(parsedValue instanceof ComplexWithValidation)
			assert.strictEqual(parsedValue.count, 5)
			assert.strictEqual(parsedValue.value, 'sample value')
		})

		it('should throw CommandError when parsing invalid complex string with zero count', () => {
			// Simulate parsing from argv: "0\nsample value" (invalid because count is zero)
			const argvString = '0\nsample value'

			try {
				ComplexWithValidation.fromString(argvString)
				assert.fail('Should have thrown CommandError')
			} catch (err) {
				assert.ok(err instanceof CommandError)
				assert.ok(err.message.includes('Count must be greater than zero'))
			}
		})

		it('should throw CommandError when parsing invalid complex string with negative count', () => {
			// Simulate parsing from argv: "-3\nsample value" (invalid because count is negative)
			const argvString = '-3\nsample value'

			try {
				ComplexWithValidation.fromString(argvString)
				assert.fail('Should have thrown CommandError')
			} catch (err) {
				assert.ok(err instanceof CommandError)
				assert.ok(err.message.includes('Count must be greater than zero'))
			}
		})

		it('should throw CommandError when parsing invalid complex string with non-numeric count', () => {
			// Simulate parsing from argv: "invalid\nsample value" (invalid because count is not numeric)
			const argvString = 'invalid\nsample value'

			try {
				// This will result in NaN when converted to Number, which is <= 0
				ComplexWithValidation.fromString(argvString)
				assert.fail('Should have thrown CommandError')
			} catch (err) {
				assert.ok(err instanceof CommandError)
				assert.ok(err.message.includes('Count must be a number'))
			}
		})

		it('should handle multi-line complex values from argv string', () => {
			// Simulate parsing from argv with multiple newlines in value part
			const argvString = '10\nline one\nline two\nline three'
			const parsedValue = ComplexWithValidation.fromString(argvString)

			assert.ok(parsedValue instanceof ComplexWithValidation)
			assert.strictEqual(parsedValue.count, 10)
			assert.strictEqual(parsedValue.value, 'line one\nline two\nline three')
		})
	})
})

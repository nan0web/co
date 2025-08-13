import { describe, it } from "node:test"
import assert from "node:assert"
import Command from "./Command.js"
import CommandError from "./CommandError.js"
import CommandMessage from "./CommandMessage.js"
import CommandOption from "./CommandOption.js"

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
	static fromString(str) {
		const complex = Complex.fromString(str)
		return new ComplexWithValidation(complex)
	}
}

describe("Command class", () => {
	it("should create instance with default values", () => {
		const cmd = new Command()
		assert.strictEqual(cmd.name, "")
		assert.strictEqual(cmd.help, "")
		assert.ok(cmd.options instanceof Map)
		assert.ok(cmd.arguments instanceof Map)
	})

	it("should create instance with provided values", () => {
		const name = "test"
		const help = "Test command"
		const cmd = new Command({ name, help })

		assert.strictEqual(cmd.name, name)
		assert.strictEqual(cmd.help, help)
	})

	it("should add boolean options as flags", () => {
		const cmd = new Command()
		cmd.addOption("help", Boolean, false, "Show help")
		cmd.addOption("verbose", Boolean, true, "Enable verbose output")

		const helpFlag = cmd.getOption("help")
		const verboseFlag = cmd.getOption("verbose")

		assert.strictEqual(helpFlag.type, Boolean)
		assert.strictEqual(helpFlag.def, false)
		assert.strictEqual(helpFlag.help, "Show help")

		assert.strictEqual(verboseFlag.type, Boolean)
		assert.strictEqual(verboseFlag.def, true)
		assert.strictEqual(verboseFlag.help, "Enable verbose output")
	})

	it("should add non-boolean options correctly", () => {
		const cmd = new Command()
		cmd.addOption("file", String, "default.txt", "Input file")
		cmd.addOption("count", Number, 10, "Number of items")

		// 2 + default help & version
		assert.strictEqual(cmd.options.size, 4)
		assert.ok(cmd.options.has("file"))
		assert.ok(cmd.options.has("count"))

		const fileOption = cmd.getOption("file")
		const countOption = cmd.getOption("count")

		assert.strictEqual(fileOption.type, String)
		assert.strictEqual(fileOption.def, "default.txt")
		assert.strictEqual(fileOption.help, "Input file")

		assert.strictEqual(countOption.type, Number)
		assert.strictEqual(countOption.def, 10)
		assert.strictEqual(countOption.help, "Number of items")
	})

	it("should parse arguments and set defaults", () => {
		const cmd = new Command({
			name: "parse",
			help: "Parse with defaults",
			options: {
				help: new CommandOption(
					{ name: "help", alias: "h", def: false, type: !0, help: "Show help" }
				),
				verbose: new CommandOption(
					{ name: "verbose", alias: "v", def: true, type: !0, help: "Enable verbose output" }
				),
				file: new CommandOption(
					{ name: "file", alias: "f", def: "default.txt", type: "", help: "Input file" }
				),
				count: new CommandOption(
					{ name: "count", alias: "c", def: 10, type: 0, help: "Number of items" }
				),
			},
			arguments: { "*": new CommandOption({ name: "Files", type: "", help: "Files to process" }) }
		})

		const msg = cmd.parse(["test", "--help", "--file", "input.txt"])

		assert.ok(msg instanceof CommandMessage)
		assert.deepStrictEqual(msg.args, ["test"])
		assert.deepStrictEqual(msg.opts, {
			help: true,
			verbose: true,
			version: false,
			file: "input.txt",
			count: 10,
		})
	})

	it("should generate help text", () => {
		const cmd = new Command({
			name: "test",
			help: "Test command"
		})
		cmd.addOption("help", Boolean, false, "Show help")
		cmd.addOption("file", String, "default.txt", "Input file")

		const helpText = cmd.generateHelp()
		const lines = helpText.split("\n")

		assert.ok(lines[0].includes("Usage: test"))
		assert.ok(lines[2].includes("Test command"))
		assert.ok(lines.some(line => line.includes("Options:")))
		assert.ok(lines.some(line => line.includes("--help")))
		assert.ok(lines.some(line => line.includes("--file")))
	})

	it.todo("should handle complex argument types", () => {
		const command = new Command({
			name: "test",
			help: "Test command with complex arguments",
			options: {
				debug: [Boolean, false, "Show debugging logs"],
				"input-file": [String, "default.txt", "Input file", { alias: "i" }],
			},
			arguments: {
				complex: [Complex, new Complex(), "Complex config, provide path to file with a config or its string encoded value"],
				"*": [String, "Files to process"]
			}
		})

		// Test parsing with complex type
		const complexValue = new Complex({ value: "test", count: 5 })
		const argv = ["test", complexValue.toString(), "file1.txt", "file2.txt"]
		const msg = command.parse(argv)

		assert.ok(msg instanceof CommandMessage)
		assert.ok(msg.args[0] instanceof Complex)
		assert.strictEqual(msg.args[0].count, 5)
		assert.strictEqual(msg.args[0].value, "test")
		assert.deepStrictEqual(msg.args.slice(1), ["file1.txt", "file2.txt"])
		assert.deepStrictEqual(msg.opts, {
			debug: false,
			"input-file": "default.txt",
			help: false,
			version: false
		})
	})

	it("should handle subcommands", () => {
		const subCommand = new Command({
			name: "sub",
			help: "Subcommand",
			options: {
				"help": new CommandOption({
					name: "help", type: Boolean, def: false, help: "Show help",
				})
			}
		})

		const mainCommand = new Command({
			name: "main",
			help: "Main command",
			subcommands: [subCommand],
			options: {
				"help": new CommandOption({
					name: "help", type: Boolean, def: false, help: "Show main help",
				})
			}
		})

		const msg = mainCommand.parse(["sub", "--help"])
		assert.ok(msg instanceof CommandMessage)
		assert.ok(msg.children[0] instanceof CommandMessage)
		const sub = msg.children[0]
		assert.deepStrictEqual(msg.args, [])
		assert.deepStrictEqual(sub.args, [])
		assert.deepStrictEqual(msg.opts, { help: true, version: false })
	})
})

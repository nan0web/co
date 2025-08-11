import { describe, it } from "node:test"
import assert from "node:assert"
import Command from "./Command.js"

describe("Command built‑in help flag", () => {
	it("adds a default help option when none is defined", () => {
		const cmd = new Command({ name: "mycmd" })
		const helpOpt = cmd.getOption("help")
		assert.ok(helpOpt)
		assert.strictEqual(helpOpt.type, Boolean)
		assert.strictEqual(helpOpt.def, false)
	})

	it("runHelp returns the help string", () => {
		const cmd = new Command({
			name: "demo",
			help: "Demo command",
			options: {
				verbose: [Boolean, false, "Verbose output"]
			}
		})
		const helpText = cmd.runHelp()
		assert.ok(typeof helpText === "string")
		assert.ok(helpText.includes("Demo command"))
		assert.ok(helpText.includes("--verbose"))
		assert.ok(helpText.includes("  --verbose       Verbose output (default: false)   "))
		assert.ok(helpText.includes("  --help, -h      Show help (default: false)        "))
		assert.ok(helpText.includes("  --version, -V   Show version (default: false)     "))
	})
})

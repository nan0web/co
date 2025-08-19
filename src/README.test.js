import { describe, it } from "node:test"
import assert from "node:assert"
import { Command, CommandError, CommandMessage, Message, Contact } from "../src/index.js"

/**
 * @docs
 * # @nan0web/co
 *
 * Communication starts here with a simple Message.
 *
 * ## Description
 *
 * The `@nan0web/co` package provides a minimal yet powerful foundation for message-based communication systems and contact handling.
 * Core classes:
 *
 * - `Message` — a base class for representing generic messages with timestamps.
 * - `CommandMessage` — an extension of `Message`, designed for handling command-line-style messages with arguments and options.
 * - `Command` — a class for defining CLI commands with options and arguments, similar to Python's `click`.
 * - `CommandOption` — represents individual options or arguments for a command.
 * - `CommandError` — custom error class for command-related errors.
 * - `Contact` — parses and represents contact information with specific URI schemes.
 *
 * These classes are perfect for building parsers, CLI tools, communication protocols, message validation layers, and contact data management.
 *
 * ## Installation
 *
 * ```bash
 * npm install @nan0web/co
 * ```
 *
 * ## Usage
 */

describe("README examples", () => {
	/**
	 * @docs
	 * ### Basic Message
	 *
	 * ```js
	 * import { Message } from '@nan0web/co'
	 *
	 * const msg = new Message('Hello world')
	 * console.log(msg.toString()) // 2023-04-01T10:00:00 Hello world
	 * ```
	 */
	it("Basic Message", () => {
		const msg = new Message('Hello world')
		console.log(msg.toString()) // 2023-04-01T10:00:00 Hello world
		assert.ok(msg instanceof Message)
		assert.strictEqual(msg.body, 'Hello world')
		assert.ok(msg.time instanceof Date)
	})

	/**
	 * @docs
	 * ### Command Message
	 *
	 * ```js
	 * import { CommandMessage } from '@nan0web/co'
	 *
	 * const cmd = new CommandMessage('git commit -m "Initial commit" --verbose')
	 * console.log(cmd.args) // ['git', 'commit', 'Initial commit']
	 * console.log(cmd.opts) // { m: 'Initial commit', verbose: true }
	 * ```
	 */
	it("Command Message", () => {
		const cmd = new CommandMessage('git commit -m "Initial commit" --verbose')
		console.log(cmd.args) // ['git', 'commit', 'Initial commit']
		console.log(cmd.opts) // { m: 'Initial commit', verbose: true }
		assert.ok(cmd instanceof CommandMessage)
		assert.deepStrictEqual(cmd.args, ['git', 'commit'])
		assert.deepStrictEqual(cmd.opts, { m: 'Initial commit', verbose: true })
	})

	/**
	 * @docs
	 * ### Command with Options and Arguments
	 *
	 * ```js
	 * import { Command } from '@nan0web/co'
	 *
	 * const cmd = new Command({
	 *   name: 'example',
	 *   help: 'An example command',
	 *   options: {
	 *     verbose: [Boolean, false, 'Enable verbose output', { alias: 'v' }],
	 *     file: [String, 'input.txt', 'Input file path', { alias: 'f' }]
	 *   },
	 *   arguments: {
	 *     name: [String, '', 'Name of the item to process'],
	 *     '*': [String, 'Additional items']
	 *   }
	 * })
	 *
	 * // Parse command line arguments
	 * const parsed = cmd.parse(['--verbose', '--file', 'config.json', 'item1', 'item2'])
	 * console.log(parsed.opts.verbose) // true
	 * console.log(parsed.opts.file)    // 'config.json'
	 * console.log(parsed.args)         // ['item1', 'item2']
	 * ```
	 */
	it("Command with Options and Arguments", () => {
		const cmd = new Command({
			name: 'example',
			help: 'An example command',
			options: {
				verbose: [Boolean, false, 'Enable verbose output', 'v'],
				file: [String, 'input.txt', 'Input file path', 'f']
			},
			arguments: {
				name: [String, '', 'Name of the item to process'],
				'*': [String, 'Additional items']
			}
		})

		// Parse command line arguments
		const parsed = cmd.parse(['--verbose', '--file', 'config.json', 'item1', 'item2'])
		console.log(parsed.opts.verbose) // true
		console.log(parsed.opts.file)    // 'config.json'
		console.log(parsed.args)         // ['item1', 'item2']

		assert.ok(parsed instanceof CommandMessage)
		assert.strictEqual(parsed.opts.verbose, true)
		assert.strictEqual(parsed.opts.file, 'config.json')
		assert.deepStrictEqual(parsed.args, ['item1', 'item2'])
	})

	/**
	 * @docs
	 * ### Contact Handling
	 *
	 * ```js
	 * import { Contact } from '@nan0web/co'
	 *
	 * // Create direct instances
	 * const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
	 * const phone = Contact.from("+123456") // Auto-detected as telephone
	 * const address = Contact.parse("123")  // Auto-detected as address
	 *
	 * // Parse types
	 * console.log(email.toString()) // "mailto:test@example.com"
	 * console.log(phone.toString()) // "tel:+123456"
	 * console.log(address.toString()) // "address:123"
	 *
	 * // Auto-detect from strings
	 * const github = Contact.parse("https://github.com") // Auto-detected as URL
	 * github // { type: Contact.URL, value: "https://github.com" }
	 * ```
	 */
	it("Contact Handling", () => {
		// Create direct instances
		const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
		const phone = Contact.from("+123456") // Auto-detected as telephone
		const address = Contact.parse("123")  // Auto-detected as address

		// Parse types
		console.log(email.toString()) // "mailto:test@example.com"
		console.log(phone.toString()) // "tel:+123456"
		console.log(address.toString()) // "address:123"

		assert.strictEqual(email.toString(), "mailto:test@example.com")
		assert.strictEqual(phone.toString(), "tel:+123456")
		assert.strictEqual(address.toString(), "address:123")

		// Auto-detect from strings
		const github = Contact.parse("https://github.com") // Auto-detected as URL
		github // { type: Contact.URL, value: "https://github.com" }

		assert.strictEqual(github.type, Contact.URL)
		assert.strictEqual(github.value, "https://github.com")
	})

	/**
	 * @docs
	 * ### Subcommands
	 *
	 * Commands can have subcommands for building hierarchical CLI tools:
	 *
	 * ```js
	 * import { Command } from '@nan0web/co'
	 *
	 * const initCmd = new Command({
	 *   name: 'init',
	 *   help: 'Initialize a new project',
	 *   options: {
	 *     name: "version", alias: "V", type: Boolean, def: false, help: "Show version"
	 *   }
	 * })
	 *
	 * const mainCmd = new Command({
	 *   name: 'mycli',
	 *   help: 'My CLI tool',
	 *   subcommands: [initCmd]
	 * })
	 *
	 * // Parse with subcommand
	 * const msg = mainCmd.parse(['init', '-V'])
	 * const sub = msg.children[0]
	 * if (sub) {
	 *   sub.opts // { version: true }
	 *   sub.args // ["init"]
	 * }
	 * ```
	 */
	it("Subcommands", () => {
		const initCmd = new Command({
			name: 'init',
			help: 'Initialize a new project',
		})
		initCmd.addOption("version", Boolean, false, "Show version", "V")

		const mainCmd = new Command({
			name: 'mycli',
			help: 'My CLI tool',
			subcommands: [initCmd]
		})

		// Parse with subcommand
		const msg = mainCmd.parse(['init', '-V'])
		const sub = msg.children[0]
		if (sub) {
			sub.opts // { version: true }
			sub.args // ["init"]
			assert.strictEqual(sub.opts.version, true)
			assert.deepStrictEqual(sub.args, [])
		}
	})

	/**
	 * @docs
	 * ### Errors
	 *
	 * All parsing and conversion errors are thrown as `CommandError`. The error contains a `data` field with additional context, e.g.:
	 *
	 * ```js
	 * try {
	 *   cmd.parse(['example', '--count', '-1'])
	 * } catch (err) {
	 *   if (err instanceof CommandError) {
	 *     console.error(err.message)   // "Invalid value for count: -1"
	 *     console.error(err.data)      // { validValues: [...], providedValue: '-1' }
	 *   }
	 * }
	 * ```
	 */
	it("Errors", () => {
		const cmd = new Command({
			name: 'example',
			help: 'An example command',
			options: {
				count: [Number, 0, 'Count value']
			}
		})

		try {
			cmd.parse(['example', '--count', 'not-a-number'])
			assert.fail("Should have thrown CommandError")
		} catch (err) {
			if (err instanceof CommandError) {
				console.error(err.message)   // "Invalid value for count: -1"
				console.error(err.data)      // { validValues: [...], providedValue: '-1' }
				assert.ok(err instanceof CommandError)
				assert.ok(err.message.includes("Invalid number for count"))
			}
		}
	})
})

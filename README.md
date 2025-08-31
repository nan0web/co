# @nan0web/co

Communication starts here with a simple Message.

|Package name|[Status](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Documentation|Test coverage|Features|Npm version|
|---|---|---|---|---|---|
 |[@nan0web/co](https://github.com/nan0web/@nan0web/co/) |🟢 `98.3%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/@nan0web/co/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/@nan0web/co/blob/main/docs/uk/README.md) |🟢 `91.5%` |✅ d.ts 📜 system.md 🕹️ playground |— |

## Description

The `@nan0web/co` package provides a minimal yet powerful foundation for message-based communication systems and contact handling.
Core classes:

- `Message` — a base class for representing generic messages with timestamps.
- `Chat` — represents chat messages and chains.
- `Contact` — parses and represents contact information with specific URI schemes.
- `Language` — handles localization data including name, icon, code, and locale.
- `Command` — a class for defining CLI commands with options and arguments.
- `CommandMessage` — an extension of `Message`, designed for handling command-line-style messages.
- `CommandOption` — represents individual options or arguments for a command.
- `CommandError` — custom error class for command-related errors.

These classes are perfect for building parsers,
CLI tools, communication protocols, message validation layers,
and contact or language data management.

This document is available in other languages:
- [Ukrainian 🇺🇦](./docs/uk/README.md)

## Installation

How to install with npm?
```bash
npm install @nan0web/co
```

How to install with pnpm?
```bash
pnpm add @nan0web/co
```

How to install with yarn?
```bash
yarn add @nan0web/co
```

## Usage

### Basic Message

Messages contain body and time when they were created

How to create a Message instance from string?
```js
import { Message } from '@nan0web/co'
const msg = Message.from("Hello world")
console.info(String(msg)) // 2023-04-01T10:00:00 Hello world
```

How to create a Message instance from object?
```js
import { Message } from '@nan0web/co'
const msg = Message.from({ body: "Hello 2000", time: new Date("2000-01-01") })
console.info(String(msg)) // 2000-01-01T00:00:00.000Z Hello 2000
```
### Chat Messages

Chat creates a message chain with authors

How to create a message chain with authors in a chat?
```js
const alice = Contact.from("alice@example.com")
const bob = Contact.from("bob@example.com")

const chat = new Chat({
	author: alice,
	body: "Hi Bob!",
	next: new Chat({
		author: bob,
		body: "Hello Alice!"
	})
})

const str = String(chat)
console.info(str)
```
### Contact Handling

Contact handles different URIs and string inputs properly

How to create contact with different URIs and string inputs properly?
```js
// Create direct instances
const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
const phone = Contact.from("+123456") // Auto-detected as telephone
const address = Contact.parse("123 Main St")  // Auto-detected as address

// Parse types
console.info(email.toString()) // "mailto:test@example.com"
console.info(phone.toString()) // "tel:+123456"
console.info(address.toString()) // "address:123 Main St"

// Auto-detect from strings
const website = Contact.parse("https://example.com") // Auto-detected as URL
console.info(website) // "https://example.com"
```
### Language Handling

Language handles ISO codes and string conversion

How to create a Language instance?
```js
const lang = new Language({
	name: "English",
	icon: "🇬🇧",
	code: "en",
	locale: "en-US"
})

console.info(String(lang))
```
### Command with Options and Arguments

Command can be configured with options and arguments

How to create a Command configured with options and arguments?
```js
const cmd = new Command({
	name: "example",
	help: "An example command",
	options: {
		verbose: [Boolean, false, "Enable verbose output", "v"],
		file: [String, "input.txt", "Input file path", "f"]
	},
	arguments: {
		name: [String, "", "Name of the item to process"],
		"*": [String, "Additional items"]
	}
})

const parsed = cmd.parse(["--verbose", "--file", "config.json", "item1", "item2"])
console.info(parsed.opts.verbose)
console.info(parsed.opts.file)
console.info(parsed.args)

```
### Subcommands

Command supports subcommands

How to add sub-commands to main Command instance?
```js
const initCmd = new Command({
	name: "init",
	help: "Initialize a new project"
})
initCmd.addOption("version", Boolean, false, "Show version", "V")

const mainCmd = new Command({
	name: "mycli",
	help: "My CLI tool",
	subcommands: [initCmd]
})

const msg = mainCmd.parse(["init", "-V"])
console.info(msg.subCommandMessage.opts.version)
console.info(msg.subCommandMessage.args)

```
### Errors

CommandError provides detailed error messages for command validation

How to handle errors in Commands?
```js
try {
	const cmd = new Command({
		name: "example",
		options: {
			count: [Number, 0, "Count value"]
		}
	})
	const msg = cmd.parse(["example", "--count", "invalid"])
	console.info(String(msg)) // ← no output because of thrown error
} catch (err) {
	if (err instanceof CommandError) {
		console.error(err.message) // ← Invalid number for count: invalid
		console.error(JSON.stringify(err.data)) // ← {"providedValue":"invalid"}
	}
}
```
## API

### Message

* **Properties**
  * `body` – the actual content of the message.
  * `time` – timestamp of creation.

* **Methods**
  * `toObject()` – returns `{ body, time }`.
  * `toString()` – formats timestamp and body as a string.
  * `static from(input)` – instantiates from string or object.

### Chat

Extends `Message`.

* **Properties**
  * `author` – the contact object representing the message sender.
  * `next` – the next chat message in the chain (nullable).

* **Methods**
  * `get size` – returns the chain length.
  * `get recent` – returns the last chat message in the chain.
  * `toString()` – formats the entire chat chain.
  * `static from(input)` – builds a chat chain from array-like input.

### Contact

* **Static URI prefixes**
  * `Contact.ADDRESS` – `"address:"`
  * `Contact.EMAIL` – `"mailto:"`
  * `Contact.TELEPHONE` – `"tel:"`
  * `Contact.URL` – `"//"`
  * Social links: FACEBOOK, INSTAGRAM, LINKEDIN, SIGNAL, SKYPE, TELEGRAM, VIBER, WHATSAPP, X

* **Methods**
  * `toString()` – converts to a URI string.
  * `static parse(string)` – detects a URI scheme or uses heuristics to deduce the type.
  * `static from(input)` – returns a Contact instance if one already exists or creates a new one.

### Language

* **Properties**
  * `name` – language name in its native form.
  * `icon` – flag emoji.
  * `code` – ISO 639-1 language code.
  * `locale` – specific locale identifier.

* **Methods**
  * `toString()` – combines `name` and `icon`.
  * `static from(input)` – creates or returns a Language instance.

### Command

* **Properties**
  * `name` – command name for usage.
  * `help` – command description.
  * `options` – map of command options.
  * `arguments` – map of expected arguments.
  * `subcommands` – nested commands map.
  * `aliases` – shortcut aliases for flags.

* **Methods**
  * `addOption(name, type, def, help?, alias?)` – adds a command option.
  * `addArgument(name, type, def, help?, required?)` – adds a command argument.
  * `addSubcommand(subcommand)` – adds a subcommand.
  * `parse(argv)` – parses input args and returns CommandMessage.
  * `runHelp()` – generates and returns help output.
  * `generateHelp()` – returns formatted help text.

### CommandMessage

Extends `Message`.

* **Properties**
  * `name` – used by subcommands.
  * `args` – command arguments.
  * `opts` – parsed flag values.
  * `children` – nested subcommand messages.

* **Methods**
  * `get subCommand` – returns the name of the first subcommand, if any.
  * `add(message)` – appends a child message.
  * `toString()` – rebuilds full command input string.
  * `static parse(args)` – parses args into a CommandMessage.
  * `static from(input)` – returns unchanged or creates new instance.

### CommandOption

* **Properties**
  * `name` – option identifier.
  * `type` – expected value type (Number, String, Boolean, Array or Class).
  * `def` – default value if not provided.
  * `help` – documentation text.
  * `alias` – short flag alias.
  * `required` – if true, the argument is mandatory.

* **Methods**
  * `getDefault()` – returns `def`.
  * `isOptional()` – returns true if default is set or required is false.
  * `toObject()` – formats option into a readable object for help generation.
  * `static from()` – accepts raw config in multiple formats and creates an instance.

### CommandError

Extends `Error`.

* **Properties**
  * `message` – error description.
  * `data` – additional error context for programmatic analysis.

* **Methods**
  * `toString()` – returns formatted error with message and JSON data.

All exported classes should pass basic test to ensure API examples work

## Java•Script

Uses `d.ts` files for autocompletion

## CLI Playground

How to run playground script?
```bash
# Clone the repository and run the CLI playground
git clone https://github.com/nan0web/co.git
cd i18n
npm install
npm run playground
```

## Contributing

How to contribute? - [check here](./CONTRIBUTING.md)

## License

How to license ISC? - [check here](./LICENSE)

# @nan0web/co

Communication starts here with a simple Message.

## International Documentation 

Available translations:
- [Українська](./docs/README.uk.md)
- [Ελληνικά](./docs/README.el.md)

## Description

The `@nan0web/co` package provides a minimal yet powerful foundation for message-based communication systems and contact handling.  
Core classes:

- `Message` — a base class for representing generic messages with timestamps.
- `CommandMessage` — an extension of `Message`, designed for handling command-line-style messages with arguments and options.
- `Command` — a class for defining CLI commands with options and arguments, similar to Python's `click`.
- `CommandOption` — represents individual options or arguments for a command.
- `CommandError` — custom error class for command-related errors.
- `Contact` — parses and represents contact information with specific URI schemes.

These classes are perfect for building parsers, CLI tools, communication protocols, message validation layers, and contact data management.

## Philosophy of Communication

True communication begins with understanding and resonating with others. 

Inspired by ancient wisdom:
- **Ra** (Sun, Light) — represents the energy and clarity we bring
- **Zoom** (movement, change) — reflects the dynamic nature of exchange
- **Om** (universal sound, unity) — embodies harmony in communication

This trinity forms the foundation of meaningful interaction:
1. Send a clear message (**Ra** - light)
2. Allow space for response (**Zoom** - movement)  
3. Listen with openness (**Om** - unity)

Every conversation can create either resonance (harmony, understanding) or dissonance (conflict, misunderstanding). Choose resonance and open infinite universe of creation.

## Installation

```bash
npm install @nan0web/co
```

## Usage

### Basic Message

```js
import { Message } from '@nan0web/co'

const msg = new Message('Hello world')
console.log(msg.toString()) // 2023-04-01T10:00:00 Hello world
```

### Command Message

```js
import { CommandMessage } from '@nan0web/co'

const cmd = new CommandMessage('git commit -m "Initial commit" --verbose')
console.log(cmd.args) // ['git', 'commit', 'Initial commit']
console.log(cmd.opts) // { m: 'Initial commit', verbose: true }
```

### Command with Options and Arguments

```js
import { Command } from '@nan0web/co'

const cmd = new Command({
  name: 'example',
  help: 'An example command',
  options: {
    verbose: [Boolean, false, 'Enable verbose output', { alias: 'v' }],
    file: [String, 'input.txt', 'Input file path', { alias: 'f' }]
  },
  arguments: {
    name: [String, '', 'Name of the item to process'],
    '*': [String, 'Additional items']
  }
})

// Parse command line arguments
const parsed = cmd.parse(['example', '--verbose', '--file', 'config.json', 'item1', 'item2'])
console.log(parsed.opts.verbose) // true 
console.log(parsed.opts.file)    // 'config.json'
console.log(parsed.args)         // ['item1', 'item2']
```

### Contact Handling

```js
import { Contact } from '@nan0web/co'

// Create direct instances
const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
const phone = Contact.from("+123456") // Auto-detected as telephone
const address = Contact.parse("123")  // Auto-detected as address

// Parse types
console.log(email.toString()) // "mailto:test@example.com"
console.log(phone.toString()) // "tel:+123456"
console.log(address.toString()) // "address:123"

// Auto-detect from strings
const github = Contact.parse("https://github.com") // Auto-detected as URL
github // { type: Contact.URL, value: "https://github.com" }
```

### Advanced Option Definition

`CommandOption` can be created from:

* **Array syntax** – `[name, type, defaultValue, help, alias?]`  
* **Object syntax** – `{ name, type, defaultValue, help, alias }`

Both syntaxes are automatically transformed into a `CommandOption` instance.

### Subcommands

Commands can have subcommands for building hierarchical CLI tools:

```js
import { Command } from '@nan0web/co'

const initCmd = new Command({
  name: 'init',
  help: 'Initialize a new project',  
  arguments: {
    project: [String, '', 'Project name']
  }
})

const mainCmd = new Command({
  name: 'mycli',
  help: 'My CLI tool',
  subcommands: [initCmd]
})  

// Parse with subcommand
const msg = mainCmd.parse(['init', 'my-project'])
console.log(msg.children[0].args) // ['my-project']
```

### Errors

All parsing and conversion errors are thrown as `CommandError`. The error contains a `data` field with additional context, e.g.:

```js
try {
  cmd.parse(['example', '--count', 'abc']) 
} catch (err) {
  if (err instanceof CommandError) {
    console.error(err.message) // "Invalid number for count: abc"  
    console.error(err.data)    // { providedValue: 'abc' }
  }
}
```

## Built-in Features

### Command System

- `--help` / `-h` to display help
- `--version` / `-V` to display version  
- Native support for complex data types in arguments (via static `fromString` method)
- Automatic argument validation and error handling

### Contact Parsing 

- Email auto-detection and normalization (e.g. `test@example.com` → `mailto:test@example.com`)
- Telephone number detection (e.g. `+1234567890`) 
- Social media contact parsing (Facebook, Instagram, LinkedIn, Signal, Skype, Telegram, Viber, WhatsApp, X)
- URL detection and normalization
- Postal address parsing as fallback
## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

ISC — see [LICENSE](./LICENSE)

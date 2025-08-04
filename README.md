# @nan0web/co

Communication starts here with a simple Message.

## Description

The `@nan0web/co` package provides a minimal yet powerful foundation for message-based communication systems.  
It includes two core classes:

- `Message` — a base class for representing generic messages with timestamps.
- `CommandMessage` — an extension of `Message`, designed for handling command-line-style messages with arguments and options.

These classes are perfect for building parsers, CLI tools, communication protocols, or message validation layers.

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

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

ISC — see [LICENSE](./LICENSE)

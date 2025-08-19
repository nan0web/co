# @nan0web/co

Комунікація починається тут із простого Повідомлення.

## Міжнародна документація

Доступні переклади:
- [English](../README.md)
- [Ελληνικά](./README.el.md)

## Опис

Пакет `@nan0web/co` забезпечує мінімальний, але потужний фундамент для систем комунікації на основі повідомлень та обробки контактів.
Основні класи:

- `Message` — базовий клас для представлення загальних повідомлень із часовими мітками.
- `CommandMessage` — розширення `Message`, призначене для обробки повідомлень у стилі командного рядка з аргументами та опціями.
- `Command` — клас для визначення CLI-команд з опціями та аргументами, подібно до Python `click`.
- `CommandOption` — представляє окремі опції або аргументи команди.
- `CommandError` — спеціальний клас помилок для командних помилок.
- `Contact` — аналізує і представляє контактну інформацію з конкретними URI схемами.

Ці класи ідеально підходять для побудови аналізаторів, CLI інструментів, комунікаційних протоколів, рівнів валідації повідомлень та керування контактними даними.

## Філософія комунікації

Справжня комунікація починається з розуміння і резонансу з іншими.

Натхненна давньою мудрістю:
- **Ra** (Сонце, Світло) — представляє енергію та ясність, яку ми додаємо
- **Zoom** (рух, зміна) — відображає динамічну природу обміну
- **Om** (універсальний звук, єдність) — являє собою гармонію в комунікації

Ця трійця формує основу змістовної взаємодії:
1. Відправити чітке повідомлення (**Ra** - світло)
2. Дати простір для відповіді (**Zoom** - рух)
3. Слухати з відкритістю (**Om** - єдність)

Кожна розмова може створити резонанс (гармонію, розуміння) або дисонанс (конфлікт, нерозуміння). Обирайте резонанс і відкрийте нескінченний Всесвіт творіння.

## Встановлення

```bash
npm install @nan0web/co
```

## Використання

### Базове повідомлення

```js
import { Message } from '@nan0web/co'

const msg = new Message('Привіт світ')
console.log(msg.toString()) // 2023-04-01T10:00:00 Привіт світ
```

### Командне повідомлення

```js
import { CommandMessage } from '@nan0web/co'

const cmd = new CommandMessage('git commit -m "Початковий коміт" --verbose')
console.log(cmd.args) // ['git', 'commit']
console.log(cmd.opts) // { m: 'Початковий коміт', verbose: true }
```

### Команда з опціями та аргументами

```js
import { Command } from '@nan0web/co'

const cmd = new Command({
  name: 'приклад',
  help: 'Приклад команди',
  options: {
    verbose: [Boolean, false, 'Увімкнути докладний вивід', { alias: 'v' }],
    file: [String, 'input.txt', 'Шлях до вхідного файлу', { alias: 'f' }]
  },
  arguments: {
    name: [String, '', 'Назва елемента для обробки'],
    '*': [String, 'Додаткові елементи']
  }
})

// Аналіз аргументів командного рядка
const parsed = cmd.parse(['приклад', '--verbose', '--file', 'config.json', 'елемент1', 'елемент2'])
console.log(parsed.opts.verbose) // true
console.log(parsed.opts.file)    // 'config.json'
console.log(parsed.args)         // ['елемент1', 'елемент2']
```

### Обробка контактів

```js
import { Contact } from '@nan0web/co'

// Створення прямих екземплярів
const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
const phone = Contact.from("+123456") // Автоматично визначено як телефон
const address = Contact.parse("123")  // Автоматично визначено як адресу

// Аналіз типів
console.log(email.toString()) // "mailto:test@example.com"
console.log(phone.toString()) // "tel:+123456"
console.log(address.toString()) // "address:123"

// Автоматичне визначення з рядків
const github = Contact.parse("https://github.com") // Автоматично визначено як URL
github // { type: Contact.URL, value: "https://github.com" }
```

### Розширена визначення опцій

`CommandOption` можна створити з:

* **Синтаксис масиву** – `[name, type, defaultValue, help, alias?]`
* **Синтаксис об'єкту** – `{ name, type, defaultValue, help, alias }`

Обидва синтаксиси автоматично трансформуються у екземпляр `CommandOption`.

### Підкоманди

Команди можуть мати вкладені команди для побудови ієрархічних CLI інструментів:

```js
import { Command } from '@nan0web/co'

const initCmd = new Command({
  name: 'init',
  help: 'Ініціалізувати новий проект',
  arguments: {
    project: [String, '', 'ім\'я проекту']
  }
})

const mainCmd = new Command({
  name: 'mycli',
  help: 'Мій CLI інструмент',
  subcommands: [initCmd]
})

// Аналіз з підкомандою
const msg = mainCmd.parse(['init', 'мій-проект'])
console.log(msg.children[0].args) // ['мій-проект']
```

### Помилки

Усі помилки аналізу і перетворення викидаються як `CommandError`. Помилка містить поле `data` з додатковим контекстом, наприклад:

```js
try {
  cmd.parse(['приклад', '--count', 'abc'])
} catch (err) {
  if (err instanceof CommandError) {
    console.error(err.message) // "Недійсне число для count: abc"
    console.error(err.data)    // { providedValue: 'abc' }
  }
}
```

## Вбудовані функції

### Командна система

- `--help` / `-h` для показу допомоги
- `--version` / `-V` для показу версії
- Рідна підтримка складних типів даних у аргументах (через статичний метод `fromString`)
- Автоматична валідація аргументів і обробка помилок

### Аналіз контактів

- Автоматичне визначення і нормалізація електронної пошти (наприклад, `test@example.com` → `mailto:test@example.com`)
- Виявлення номера телефону (наприклад `+1234567890`)
- Аналіз контактів соціальних мереж (Facebook, Instagram, LinkedIn, Signal, Skype, Telegram, Viber, WhatsApp, X)
- Виявлення та нормалізація URL-адрес
- Аналіз поштових адрес як резервний варіант

## Сприяння

Прийняти участь у розробці проєкту: [CONTRIBUTING.md](../CONTRIBUTING.md)

## Ліцензія

ISC — дивись [LICENSE](../LICENSE)

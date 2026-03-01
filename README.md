![Dachshund Mascot](https://raw.githubusercontent.com/AQ/dachshund/main/assets/mascot-sit.svg)

# Dachshund

**A Gleam i18n library inspired by Paraglide — Translations as Code**

Dachshund is a type-safe internationalization (i18n) library for Gleam. It treats translations as first-class Gleam code, giving you compile-time safety, autocomplete, and refactoring support for your multilingual applications.

## Features

- 🚀 **Zero Dependencies** — Nothing. Not even a leash. Pure Gleam all the way down.
- 🎯 **Strategy-Based Detection** — Cookie, localStorage, URL, browser language — all in Gleam.
- 🔒 **Type Safety** — The compiler catches bugs before your users do.

## Installation

```bash
gleam add dachshund
```

## Usage

### 1. Write Translations

Create translation modules for each locale:

```gleam
// translations/en.gleam
pub const welcome = "Welcome to Dachshund!"
pub const goodbye = "Goodbye"

// translations/de.gleam
pub const welcome = "Willkommen bei Dachshund!"
pub const goodbye = "Auf Wiedersehen"

// translations/zh_cn.gleam
pub const welcome = "欢迎使用 Dachshund!"
pub const goodbye = "再见"
```

### 2. Detect Locale

Use strategies to detect the user's preferred language:

```gleam
import dachshund/strategy

const my_strategy = [
  strategy.local_storage("locale"),
  strategy.preferred_language(),
  strategy.base_locale(translations.En),
]
```

### 3. Import & Use

Import the correct module based on locale and use like any value:

```gleam
import translations/en as t

pub fn render() -> String {
  t.welcome  // "Welcome to Dachshund!"
}
```

## Why Dachshund?

- **No runtime lookups** — Translations are compiled into your code
- **No missing keys** — The compiler ensures all translations exist
- **No typos** — Use Gleam's type system, not string keys
- **IDE support** — Get autocomplete and go-to-definition for free

## License

MIT

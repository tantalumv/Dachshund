import dachshund/ffi
import dachshund/locale
import gleam/list
import gleam/string

pub type Strategy {
  Cookie(String)
  LocalStorage(String)
  Url(UrlPattern)
  PreferredLanguage
  BaseLocale(locale.Locale)
  DocumentLang
}

pub type UrlPattern {
  UrlPattern(
    locales: List(locale.Locale),
    base_locale: locale.Locale,
    prefix: String,
  )
}

pub fn url_pattern(
  locales locales: List(locale.Locale),
  base_locale base_locale: locale.Locale,
  prefix prefix: String,
) -> UrlPattern {
  UrlPattern(locales: locales, base_locale: base_locale, prefix: prefix)
}

pub type StrategyResult {
  StrategyResult(locale: locale.Locale, source: String)
}

pub fn cookie(name: String) -> Strategy {
  Cookie(name)
}

pub fn local_storage(key: String) -> Strategy {
  LocalStorage(key)
}

pub fn url(locales: List(locale.Locale), base_locale: locale.Locale) -> Strategy {
  Url(UrlPattern(locales: locales, base_locale: base_locale, prefix: ""))
}

pub fn url_with_prefix(
  locales: List(locale.Locale),
  base_locale: locale.Locale,
  prefix: String,
) -> Strategy {
  Url(UrlPattern(locales: locales, base_locale: base_locale, prefix: prefix))
}

pub fn preferred_language() -> Strategy {
  PreferredLanguage
}

pub fn base_locale(base: locale.Locale) -> Strategy {
  BaseLocale(base)
}

pub fn document_lang() -> Strategy {
  DocumentLang
}

pub fn evaluate(
  strategies: List(Strategy),
  fallback: locale.Locale,
) -> StrategyResult {
  case strategies {
    [] -> StrategyResult(locale: fallback, source: "baseLocale")
    [strategy, ..rest] ->
      case evaluate_single(strategy) {
        Ok(result) -> result
        Error(_) -> evaluate(rest, fallback)
      }
  }
}

fn evaluate_single(strategy: Strategy) -> Result(StrategyResult, Nil) {
  case strategy {
    Cookie(name) ->
      case ffi.get_cookie(name) {
        Ok(value) ->
          Ok(StrategyResult(
            locale: locale.from_string_or_default(value),
            source: "cookie",
          ))
        Error(_) -> Error(Nil)
      }

    LocalStorage(key) ->
      case ffi.get_local_storage(key) {
        Ok(value) ->
          Ok(StrategyResult(
            locale: locale.from_string_or_default(value),
            source: "localStorage",
          ))
        Error(_) -> Error(Nil)
      }

    Url(pattern) -> evaluate_url(pattern)

    PreferredLanguage -> evaluate_preferred_language()

    BaseLocale(base) -> Ok(StrategyResult(locale: base, source: "baseLocale"))

    DocumentLang ->
      Ok(StrategyResult(
        locale: locale.from_string_loose_or_default(ffi.get_document_lang()),
        source: "documentLang",
      ))
  }
}

fn evaluate_url(pattern: UrlPattern) -> Result(StrategyResult, Nil) {
  let path = ffi.get_pathname()
  let _locales = pattern.locales
  let base = pattern.base_locale

  case path {
    "" -> Ok(StrategyResult(locale: base, source: "url"))
    _ ->
      case string.split(path, "/") {
        ["", "", locale_code, ..] -> {
          let detected = locale.from_string_or_default(locale_code)
          Ok(StrategyResult(locale: detected, source: "url"))
        }
        ["", locale_code] -> {
          let detected = locale.from_string_or_default(locale_code)
          Ok(StrategyResult(locale: detected, source: "url"))
        }
        _ -> Ok(StrategyResult(locale: base, source: "url"))
      }
  }
}

fn evaluate_preferred_language() -> Result(StrategyResult, Nil) {
  let languages = ffi.get_preferred_languages()

  case languages {
    [] -> Error(Nil)
    _ -> find_first_supported_language(languages, [])
  }
}

fn find_first_supported_language(
  preferred: List(String),
  tried: List(String),
) -> Result(StrategyResult, Nil) {
  case preferred {
    [] -> Error(Nil)
    [lang, ..rest] ->
      case list.contains(tried, lang) {
        True -> find_first_supported_language(rest, tried)
        False ->
          Ok(StrategyResult(
            locale: locale.from_string_loose_or_default(lang),
            source: "preferredLanguage",
          ))
      }
  }
}

pub fn url_patterns_for(locales: List(locale.Locale)) -> UrlPattern {
  case locales {
    [base, ..] -> UrlPattern(locales: locales, base_locale: base, prefix: "")
    [] -> UrlPattern(locales: [], base_locale: locale.En, prefix: "")
  }
}

pub const default_strategy: List(Strategy) = [
  Url(UrlPattern(locales: [], base_locale: locale.En, prefix: "")),
  BaseLocale(locale.En),
]

pub const user_preference_strategy: List(Strategy) = [
  LocalStorage("locale"),
  Url(UrlPattern(locales: [], base_locale: locale.En, prefix: "")),
  PreferredLanguage,
  BaseLocale(locale.En),
]

pub const auto_detect_strategy: List(Strategy) = [
  LocalStorage("locale"),
  PreferredLanguage,
  Url(UrlPattern(locales: [], base_locale: locale.En, prefix: "")),
  BaseLocale(locale.En),
]

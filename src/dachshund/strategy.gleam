//// Strategies for detecting the user's preferred locale.
////
//// Dachshund evaluates strategies in order, using the first successful result.
//// This allows fallback chains like: cookie → URL → browser language → default.
////
//// ## Basic Usage
////
//// ```gleam
//// import dachshund/strategy
//// import dachshund/locale
////
//// // Create a custom strategy chain
//// let my_strategy = [
////   strategy.cookie("locale"),
////   strategy.preferred_language(),
////   strategy.base_locale(locale.En),
//// ]
////
//// // Evaluate to get the user's locale
//// strategy.evaluate(my_strategy, locale.En)
//// // -> StrategyResult(locale: En, source: "baseLocale")
//// ```
////
//// ## Pre-built Strategies
////
//// Dachshund provides common strategy combinations:
////
//// - [`default_strategy`](#default_strategy) - URL or default
//// - [`user_preference_strategy`](#user_preference_strategy) - User saved preference, then URL, then browser, then default
//// - [`auto_detect_strategy`](#auto_detect_strategy) - Auto-detect from multiple sources

import dachshund/ffi
import dachshund/locale
import gleam/list
import gleam/string

/// A locale detection strategy.
///
/// Strategies are evaluated in order until one succeeds.
/// Each strategy type checks a different source for locale information.
pub type Strategy {
  /// Check a cookie for the locale value.
  /// The cookie should contain a locale code like `"en"` or `"de"`.
  Cookie(String)
  /// Check localStorage for the locale value.
  /// The key should contain a locale code like `"en"` or `"de"`.
  LocalStorage(String)
  /// Extract locale from the URL path (e.g., `/en/`, `/de/products`).
  /// Uses the first path segment after the domain.
  Url(UrlPattern)
  /// Use the browser's language preferences from `navigator.languages`.
  PreferredLanguage
  /// Always return a fixed locale as the final fallback.
  BaseLocale(locale.Locale)
  /// Use the `lang` attribute from the `<html>` document element.
  DocumentLang
}

/// Configuration for URL-based locale detection.
///
/// Defines which locales are valid in the URL and what to use as fallback.
pub type UrlPattern {
  UrlPattern(
    locales: List(locale.Locale),
    base_locale: locale.Locale,
    prefix: String,
  )
}

/// Create a URL pattern configuration.
///
/// ## Parameters
///
/// - `locales`: List of supported locales to match in URLs
/// - `base_locale`: Fallback locale when URL doesn't contain a locale
/// - `prefix`: Optional prefix before the locale in URL (e.g., `"lang"`)
pub fn url_pattern(
  locales locales: List(locale.Locale),
  base_locale base_locale: locale.Locale,
  prefix prefix: String,
) -> UrlPattern {
  UrlPattern(locales: locales, base_locale: base_locale, prefix: prefix)
}

/// The result of evaluating a strategy chain.
///
/// Contains the detected locale and which strategy provided it.
pub type StrategyResult {
  StrategyResult(locale: locale.Locale, source: String)
}

/// Create a cookie-based strategy.
///
/// The cookie value should be a locale code like `"en"` or `"de"`.
///
/// ## Example
///
/// ```gleam
/// strategy.cookie("myapp_locale")
/// ```
pub fn cookie(name: String) -> Strategy {
  Cookie(name)
}

/// Create a localStorage-based strategy.
///
/// The stored value should be a locale code like `"en"` or `"de"`.
///
/// ## Example
///
/// ```gleam
/// strategy.local_storage("locale")
/// ```
pub fn local_storage(key: String) -> Strategy {
  LocalStorage(key)
}

/// Create a URL-based strategy for path locales.
///
/// Extracts locale from the URL path (e.g., `/en/`, `/de/about`).
/// Uses the first path segment after the domain.
///
/// ## Example
///
/// ```gleam
/// // Matches /en/, /de/, /fr/ in the URL
/// strategy.url([locale.En, locale.De, locale.Fr], locale.En)
/// ```
pub fn url(locales: List(locale.Locale), base_locale: locale.Locale) -> Strategy {
  Url(UrlPattern(locales: locales, base_locale: base_locale, prefix: ""))
}

/// Create a URL-based strategy with a prefix.
///
/// ## Example
///
/// ```gleam
/// // Matches /lang/en/, /lang/de/ in the URL
/// strategy.url_with_prefix([locale.En, locale.De], locale.En, "lang")
/// ```
pub fn url_with_prefix(
  locales: List(locale.Locale),
  base_locale: locale.Locale,
  prefix: String,
) -> Strategy {
  Url(UrlPattern(locales: locales, base_locale: base_locale, prefix: prefix))
}

/// Create a browser language preference strategy.
///
/// Uses `navigator.languages` to get the user's preferred languages
/// and selects the first one that Dachshund supports.
///
/// ## Example
///
/// ```gleam
/// strategy.preferred_language()
/// ```
pub fn preferred_language() -> Strategy {
  PreferredLanguage
}

/// Create a fixed fallback locale strategy.
///
/// Use as the last strategy in your chain to ensure a locale is always returned.
///
/// ## Example
///
/// ```gleam
/// strategy.base_locale(locale.En)
/// ```
pub fn base_locale(base: locale.Locale) -> Strategy {
  BaseLocale(base)
}

/// Create a document language strategy.
///
/// Uses the `lang` attribute from the `<html>` element.
///
/// ## Example
///
/// ```gleam
/// strategy.document_lang()
/// ```
pub fn document_lang() -> Strategy {
  DocumentLang
}

/// Evaluate a strategy chain to detect the user's locale.
///
/// Strategies are checked in order. The first one that returns a valid
/// locale is used. If all strategies fail, the fallback locale is returned.
///
/// ## Example
///
/// ```gleam
/// let strategies = [
///   strategy.cookie("locale"),
///   strategy.preferred_language(),
///   strategy.base_locale(locale.En),
/// ]
///
/// strategy.evaluate(strategies, locale.En)
/// // -> StrategyResult(locale: En, source: "baseLocale")
/// ```
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

/// Create a URL pattern from a list of locales.
///
/// The first locale in the list is used as the base locale.
///
/// ## Example
///
/// ```gleam
/// strategy.url_patterns_for([locale.En, locale.De, locale.Fr])
/// // -> UrlPattern(locales: [En, De, Fr], base_locale: En, prefix: "")
/// ```
pub fn url_patterns_for(locales: List(locale.Locale)) -> UrlPattern {
  case locales {
    [base, ..] -> UrlPattern(locales: locales, base_locale: base, prefix: "")
    [] -> UrlPattern(locales: [], base_locale: locale.En, prefix: "")
  }
}

/// Default strategy: check URL, then fall back to English.
///
/// Use this for simple apps that only need URL-based locale detection.
pub const default_strategy: List(Strategy) = [
  Url(UrlPattern(locales: [], base_locale: locale.En, prefix: "")),
  BaseLocale(locale.En),
]

/// Strategy that prioritizes user preference saved in localStorage.
///
/// Check order: localStorage → URL → browser language → English
pub const user_preference_strategy: List(Strategy) = [
  LocalStorage("locale"),
  Url(UrlPattern(locales: [], base_locale: locale.En, prefix: "")),
  PreferredLanguage,
  BaseLocale(locale.En),
]

/// Auto-detect strategy that checks multiple sources.
///
/// Check order: localStorage → browser language → URL → English
pub const auto_detect_strategy: List(Strategy) = [
  LocalStorage("locale"),
  PreferredLanguage,
  Url(UrlPattern(locales: [], base_locale: locale.En, prefix: "")),
  BaseLocale(locale.En),
]

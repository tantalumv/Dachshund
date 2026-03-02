//// Dachshund provides internationalization (i18n) for Gleam web applications.
//// It offers locale detection, translation management, and RTL support.
////
//// ## Quick Start
////
//// ```gleam
//// import dachshund/locale
////
//// // Get the string code for a locale
//// locale.to_string(locale.En)  // -> "en"
////
//// // Parse a locale from a string
//// locale.from_string("de")  // -> Ok(De)
////
//// // Check text direction for RTL languages
//// locale.text_direction(locale.Ar)  // -> "rtl"
//// ```
////
//// ## Usage with Strategies
////
//// Dachshund uses strategies to detect the user's preferred locale.
//// See [`dachshund/strategy`](./strategy.html) for more details.

import gleam/list
import gleam/string

/// A supported locale code.
///
/// Use these to define which languages your app supports.
/// Each variant corresponds to an ISO 639-1 language code.
pub type Locale {
  En
  De
  Fr
  Es
  Ja
  Zh
  Ar
  He
  Fa
  Ur
  Yi
  Ps
  Pt
  It
  Ko
  Ru
  Hi
  Nl
  Pl
  Tr
  Sv
  Da
  Fi
  No
  Cs
  El
  Th
  Vi
  Id
  Ms
  Uk
  Hu
  Ro
  Bg
  Hr
  Sk
  Sl
  Ca
  Et
  Lv
  Lt
}

/// A language with its locale code and human-readable display name.
///
/// ## Example
///
/// ```gleam
/// Language(En, "en", "English")
/// ```
pub type Language {
  Language(Locale, String, String)
}

/// All supported languages with their codes and display names.
///
/// Use this to build language selector UIs:
///
/// ```gleam
/// import dachshund/locale
///
/// fn language_options() {
///   locale.languages
///   |> list.map(fn(lang) {
///     case lang {
///       Language(_, code, name) -> #(code, name)
///     }
///   })
/// }
/// ```
pub const languages: List(Language) = [
  Language(En, "en", "English"),
  Language(De, "de", "German"),
  Language(Fr, "fr", "French"),
  Language(Es, "es", "Spanish"),
  Language(Ja, "ja", "Japanese"),
  Language(Zh, "zh", "Chinese"),
  Language(Ar, "ar", "Arabic"),
  Language(He, "he", "Hebrew"),
  Language(Pt, "pt", "Portuguese"),
  Language(It, "it", "Italian"),
  Language(Ko, "ko", "Korean"),
  Language(Ru, "ru", "Russian"),
  Language(Hi, "hi", "Hindi"),
  Language(Nl, "nl", "Dutch"),
  Language(Pl, "pl", "Polish"),
  Language(Tr, "tr", "Turkish"),
  Language(Sv, "sv", "Swedish"),
  Language(Da, "da", "Danish"),
  Language(Fi, "fi", "Finnish"),
  Language(No, "no", "Norwegian"),
  Language(Cs, "cs", "Czech"),
  Language(El, "el", "Greek"),
  Language(Th, "th", "Thai"),
  Language(Vi, "vi", "Vietnamese"),
  Language(Id, "id", "Indonesian"),
  Language(Ms, "ms", "Malay"),
  Language(Uk, "uk", "Ukrainian"),
  Language(Hu, "hu", "Hungarian"),
  Language(Ro, "ro", "Romanian"),
  Language(Bg, "bg", "Bulgarian"),
  Language(Hr, "hr", "Croatian"),
  Language(Sk, "sk", "Slovak"),
  Language(Sl, "sl", "Slovenian"),
  Language(Ca, "ca", "Catalan"),
  Language(Et, "et", "Estonian"),
  Language(Lv, "lv", "Latvian"),
  Language(Lt, "lt", "Lithuanian"),
]

/// Locales that use right-to-left text direction.
///
/// Use with [`text_direction`](#text_direction) to determine
/// which direction to render text.
///
/// ## Example
///
/// ```gleam
/// import dachshund/locale
///
/// fn get_html_dir(lang: locale.Locale) {
///   locale.text_direction(lang)  // returns "ltr" or "rtl"
/// }
/// ```
pub const rtl_locales: List(Locale) = [Ar, He, Fa, Ur, Yi, Ps]

/// Convert a Locale to its ISO 639-1 string code.
///
/// ## Examples
///
/// ```gleam
/// locale.to_string(locale.En)  // -> "en"
/// locale.to_string(locale.Ja)  // -> "ja"
/// ```
pub fn to_string(locale: Locale) -> String {
  case locale {
    En -> "en"
    De -> "de"
    Fr -> "fr"
    Es -> "es"
    Ja -> "ja"
    Zh -> "zh"
    Ar -> "ar"
    He -> "he"
    Fa -> "fa"
    Ur -> "ur"
    Yi -> "yi"
    Ps -> "ps"
    Pt -> "pt"
    It -> "it"
    Ko -> "ko"
    Ru -> "ru"
    Hi -> "hi"
    Nl -> "nl"
    Pl -> "pl"
    Tr -> "tr"
    Sv -> "sv"
    Da -> "da"
    Fi -> "fi"
    No -> "no"
    Cs -> "cs"
    El -> "el"
    Th -> "th"
    Vi -> "vi"
    Id -> "id"
    Ms -> "ms"
    Uk -> "uk"
    Hu -> "hu"
    Ro -> "ro"
    Bg -> "bg"
    Hr -> "hr"
    Sk -> "sk"
    Sl -> "sl"
    Ca -> "ca"
    Et -> "et"
    Lv -> "lv"
    Lt -> "lt"
  }
}

/// Parse a Locale from a string code.
///
/// Returns `Error(Nil)` if the string is not a supported locale.
///
/// ## Examples
///
/// ```gleam
/// locale.from_string("en")    // -> Ok(En)
/// locale.from_string("fr")    // -> Ok(Fr)
/// locale.from_string("xyz")   // -> Error(Nil)
/// ```
pub fn from_string(s: String) -> Result(Locale, Nil) {
  case s {
    "en" -> Ok(En)
    "de" -> Ok(De)
    "fr" -> Ok(Fr)
    "es" -> Ok(Es)
    "ja" -> Ok(Ja)
    "zh" -> Ok(Zh)
    "ar" -> Ok(Ar)
    "he" -> Ok(He)
    "fa" -> Ok(Fa)
    "ur" -> Ok(Ur)
    "yi" -> Ok(Yi)
    "ps" -> Ok(Ps)
    "pt" -> Ok(Pt)
    "it" -> Ok(It)
    "ko" -> Ok(Ko)
    "ru" -> Ok(Ru)
    "hi" -> Ok(Hi)
    "nl" -> Ok(Nl)
    "pl" -> Ok(Pl)
    "tr" -> Ok(Tr)
    "sv" -> Ok(Sv)
    "da" -> Ok(Da)
    "fi" -> Ok(Fi)
    "no" -> Ok(No)
    "cs" -> Ok(Cs)
    "el" -> Ok(El)
    "th" -> Ok(Th)
    "vi" -> Ok(Vi)
    "id" -> Ok(Id)
    "ms" -> Ok(Ms)
    "uk" -> Ok(Uk)
    "hu" -> Ok(Hu)
    "ro" -> Ok(Ro)
    "bg" -> Ok(Bg)
    "hr" -> Ok(Hr)
    "sk" -> Ok(Sk)
    "sl" -> Ok(Sl)
    "ca" -> Ok(Ca)
    "et" -> Ok(Et)
    "lv" -> Ok(Lv)
    "lt" -> Ok(Lt)
    _ -> Error(Nil)
  }
}

/// Parse a Locale from a string, handling locale codes with region subtags.
///
/// This is useful for parsing browser `navigator.languages` which may
/// include codes like `"en-US"` or `"zh-CN"`.
///
/// ## Examples
///
/// ```gleam
/// locale.from_string_loose("en")     // -> Ok(En)
/// locale.from_string_loose("en-US")  // -> Ok(En)
/// locale.from_string_loose("zh-CN")  // -> Ok(Zh)
/// locale.from_string_loose("invalid") // -> Error(Nil)
/// ```
pub fn from_string_loose(s: String) -> Result(Locale, Nil) {
  case string.length(s) {
    2 -> from_string(s)
    5 ->
      case string.split_once(s, "-") {
        Ok(#(lang, _)) -> from_string(lang)
        Error(_) -> Error(Nil)
      }
    _ -> Error(Nil)
  }
}

/// Parse a Locale from a string, returning a default if invalid.
///
/// ## Examples
///
/// ```gleam
/// locale.from_string_or_default("de")   // -> De
/// locale.from_string_or_default("xyz") // -> En (default)
/// ```
pub fn from_string_or_default(s: String) -> Locale {
  case from_string(s) {
    Ok(locale) -> locale
    Error(_) -> En
  }
}

/// Parse a Locale from a string with region subtag, returning a default if invalid.
///
/// ## Examples
///
/// ```gleam
/// locale.from_string_loose_or_default("fr-CA") // -> Fr
/// locale.from_string_loose_or_default("xyz")   // -> En (default)
/// ```
pub fn from_string_loose_or_default(s: String) -> Locale {
  case from_string_loose(s) {
    Ok(locale) -> locale
    Error(_) -> En
  }
}

/// Get the text direction for a locale.
///
/// Returns `"rtl"` for right-to-left languages (Arabic, Hebrew, etc.)
/// and `"ltr"` for left-to-right languages.
///
/// ## Example
///
/// ```gleam
/// locale.text_direction(locale.En)  // -> "ltr"
/// locale.text_direction(locale.Ar)  // -> "rtl"
/// ```
pub fn text_direction(locale: Locale) -> String {
  case list.contains(rtl_locales, locale) {
    True -> "rtl"
    False -> "ltr"
  }
}

/// Get the text direction from a locale string.
///
/// Convenience function that combines [`from_string`](#from_string)
/// and [`text_direction`](#text_direction).
///
/// ## Example
///
/// ```gleam
/// locale.text_direction_from_string("he")  // -> "rtl"
/// locale.text_direction_from_string("es")  // -> "ltr"
/// locale.text_direction_from_string("??")  // -> "ltr" (invalid returns default)
/// ```
pub fn text_direction_from_string(s: String) -> String {
  case from_string(s) {
    Ok(locale) -> text_direction(locale)
    Error(_) -> "ltr"
  }
}

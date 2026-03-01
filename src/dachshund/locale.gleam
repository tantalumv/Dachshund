import gleam/list
import gleam/string

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

pub type Language {
  Language(Locale, String, String)
}

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

pub const rtl_locales: List(Locale) = [Ar, He, Fa, Ur, Yi, Ps]

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

pub fn from_string_or_default(s: String) -> Locale {
  case from_string(s) {
    Ok(locale) -> locale
    Error(_) -> En
  }
}

pub fn from_string_loose_or_default(s: String) -> Locale {
  case from_string_loose(s) {
    Ok(locale) -> locale
    Error(_) -> En
  }
}

pub fn text_direction(locale: Locale) -> String {
  case list.contains(rtl_locales, locale) {
    True -> "rtl"
    False -> "ltr"
  }
}

pub fn text_direction_from_string(s: String) -> String {
  case from_string(s) {
    Ok(locale) -> text_direction(locale)
    Error(_) -> "ltr"
  }
}

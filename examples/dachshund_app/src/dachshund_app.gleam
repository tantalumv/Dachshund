import gleam/int
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect, none}
import lustre/element.{type Element, text}
import lustre/element/html as h
import lustre/event.{on_click}

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}

pub type Locale {
  En
  De
  Zh
  Ar
  He
}

pub type DarkMode {
  Light
  Dark
}

pub type Model {
  Model(
    locale: Locale,
    dark_mode: DarkMode,
    select_is_open: Bool,
    detected_locale: Locale,
    detection_source: String,
  )
}

pub type Msg {
  SetLocale(Locale)
  ToggleDarkMode
  ToggleSelect
  SelectLocale(Locale)
  CloseSelect
  LoadPersistedState(Locale, String)
}

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  set_body_class("")
  let #(locale_str, dark_mode_str) = get_persisted_state()
  let persisted_locale = locale_from_string(locale_str)
  let persisted_dark_mode = dark_mode_from_string(dark_mode_str)
  let has_persisted = has_persisted_locale()
  let detection_source = case has_persisted {
    True -> "localStorage"
    False -> "Browser Language"
  }
  #(
    Model(
      locale: persisted_locale,
      dark_mode: persisted_dark_mode,
      select_is_open: False,
      detected_locale: persisted_locale,
      detection_source: detection_source,
    ),
    none(),
  )
}

@external(javascript, "./dachshund_app_ffi.mjs", "set_body_class")
fn set_body_class(class: String) -> Nil

@external(javascript, "./dachshund_app_ffi.mjs", "get_local_storage_item")
fn get_local_storage_item(key: String) -> String

@external(javascript, "./dachshund_app_ffi.mjs", "set_local_storage_item")
fn set_local_storage_item(key: String, value: String) -> Nil

@external(javascript, "./dachshund_app_ffi.mjs", "has_local_storage_item")
fn has_local_storage_item(key: String) -> Bool

fn get_persisted_state() -> #(String, String) {
  let locale_str = get_local_storage_item("dachshund_locale")
  let dark_mode_str = get_local_storage_item("dachshund_dark_mode")
  #(locale_str, dark_mode_str)
}

fn has_persisted_locale() -> Bool {
  has_local_storage_item("dachshund_locale")
}

fn persist_locale(locale: Locale) -> Nil {
  let locale_str = locale_to_string(locale)
  set_local_storage_item("dachshund_locale", locale_str)
}

fn persist_dark_mode(dark_mode: DarkMode) -> Nil {
  let dark_mode_str = dark_mode_to_string(dark_mode)
  set_local_storage_item("dachshund_dark_mode", dark_mode_str)
}

fn locale_from_string(s: String) -> Locale {
  case s {
    "en" -> En
    "de" -> De
    "zh" -> Zh
    "ar" -> Ar
    "he" -> He
    _ -> En
  }
}

fn dark_mode_from_string(s: String) -> DarkMode {
  case s {
    "dark" -> Dark
    _ -> Light
  }
}

fn locale_to_string(locale: Locale) -> String {
  case locale {
    En -> "en"
    De -> "de"
    Zh -> "zh"
    Ar -> "ar"
    He -> "he"
  }
}

fn dark_mode_to_string(dark_mode: DarkMode) -> String {
  case dark_mode {
    Light -> "light"
    Dark -> "dark"
  }
}

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    SetLocale(locale) -> {
      persist_locale(locale)
      #(Model(..model, locale: locale, select_is_open: False), none())
    }
    ToggleDarkMode -> {
      let new_mode = case model.dark_mode {
        Light -> Dark
        Dark -> Light
      }
      let class = case new_mode {
        Light -> ""
        Dark -> "dark"
      }
      set_body_class(class)
      persist_dark_mode(new_mode)
      #(Model(..model, dark_mode: new_mode), none())
    }
    ToggleSelect -> #(Model(..model, select_is_open: !model.select_is_open), none())
    SelectLocale(locale) -> {
      persist_locale(locale)
      #(Model(..model, locale: locale, select_is_open: False), none())
    }
    CloseSelect -> #(Model(..model, select_is_open: False), none())
    LoadPersistedState(locale, source) -> #(
      Model(..model, detected_locale: locale, detection_source: source),
      none(),
    )
  }
}

pub fn view(model: Model) -> Element(Msg) {
  let dir = text_direction(model.locale)
  let lang = locale_to_lang_attr(model.locale)
  h.div([attr.attribute("dir", dir), attr.attribute("lang", lang)], [
    h.div([attr.class("sticky-header")], [
      language_select(model),
      dark_mode_toggle(model),
    ]),
    h.div([attr.class("page-wrapper")], [
      main_content(model),
      how_it_works_section(model.locale),
    ]),
    live_detector(model),
    footer(model),
  ])
}

fn text_direction(locale: Locale) -> String {
  case locale {
    Ar -> "rtl"
    He -> "rtl"
    _ -> "ltr"
  }
}

fn locale_to_lang_attr(locale: Locale) -> String {
  case locale {
    En -> "en"
    De -> "de"
    Zh -> "zh"
    Ar -> "ar"
    He -> "he"
  }
}

fn dark_mode_toggle(model: Model) -> Element(Msg) {
  h.button(
    [
      attr.class("dark-mode-toggle"),
      on_click(ToggleDarkMode),
      attr.attribute("aria-label", "Toggle dark mode"),
    ],
    [
      h.img([
        attr.src(case model.dark_mode {
          Light -> "./moon-svgrepo-com.svg"
          Dark -> "./sun-svgrepo-com.svg"
        }),
        attr.alt(case model.dark_mode {
          Light -> "Moon icon"
          Dark -> "Sun icon"
        }),
        attr.class("dark-mode-icon"),
      ]),
    ],
  )
}

fn header_title(locale: Locale) -> Element(Msg) {
  let dachshund_name = case locale {
    En -> "Dachshund"
    De -> "Dackel"
    Zh -> "腊肠犬"
    Ar -> "داكشوند"
    He -> "דאכשונד"
  }

  case locale {
    En -> text("Welcome to " <> dachshund_name)
    De -> text("Willkommen bei " <> dachshund_name)
    Zh -> text("欢迎使用 " <> dachshund_name)
    Ar -> text("مرحبًا بك في " <> dachshund_name)
    He -> text("ברוכים הבאים ל" <> dachshund_name)
  }
}

fn language_select(model: Model) -> Element(Msg) {
  let display_text = case model.locale {
    En -> "English"
    De -> "Deutsch"
    Zh -> "中文"
    Ar -> "العربية"
    He -> "עברית"
  }

  h.div(
    [
      attr.class("custom-select-container"),
    ],
    [
      // Select trigger button
      h.button(
        [
          attr.class("custom-select-trigger"),
          on_click(ToggleSelect),
        ],
        [
          text(display_text),
        ],
      ),
      // Dropdown options
      case model.select_is_open {
        True -> h.div(
          [
            attr.class("custom-select-dropdown"),
          ],
          [
            select_option(En, "English", model),
            select_option(De, "Deutsch", model),
            select_option(Zh, "中文", model),
            select_option(Ar, "العربية", model),
            select_option(He, "עברית", model),
          ],
        )
        False -> text("")
      },
    ],
  )
}

fn select_option(locale: Locale, label: String, model: Model) -> Element(Msg) {
  let is_selected = locale == model.locale
  let classes = "custom-select-option"
    <> case is_selected { True -> " selected" False -> "" }
  
  h.div(
    [
      attr.class(classes),
      on_click(SelectLocale(locale)),
    ],
    [text(label)],
  )
}

fn main_content(model: Model) -> Element(Msg) {
  h.main([attr.class("main-content")], [
    hero_section(model),
    subtitle(model.locale),
    features_section(model.locale),
  ])
}

fn hero_section(model: Model) -> Element(Msg) {
  h.section([attr.class("mb-16")], [
    h.div([attr.class("hero-layout")], [
      h.img([
        attr.src("./dachshund-mascot.svg"),
        attr.alt("Dachshund mascot"),
        attr.class("mascot"),
      ]),
      h.div([attr.class("speech-bubble-wrapper")], [
        h.div(
          [
            attr.class("chat-bubble-container"),
          ],
          [
            h.img([
              attr.src("./chatbubble.svg"),
              attr.alt("Chat bubble"),
              attr.class("chat-bubble-img"),
            ]),
            h.span(
              [
                attr.class("chat-bubble-text"),
              ],
              [header_title(model.locale)],
            ),
          ],
        ),
      ]),
    ]),
  ])
}

fn subtitle(locale: Locale) -> Element(Msg) {
  let subtitle_text = case locale {
    En -> "A GLEAM I18N LIBRARY INSPIRED BY PARAGLIDE - TRANSLATIONS AS CODE"
    De -> "EINE GLEAM I18N-BIBLIOTHEK INSPIRIERT VON PARAGLIDE - ÜBERSETZUNGEN ALS CODE"
    Zh -> "受 PARAGLIDE 啟發的 GLEAM I18N 庫 - 翻譯即代碼"
    Ar -> "مكتبة GLEAM I18N مستوحاة من PARAGLIDE - الترجمات ككود"
    He -> "ספריית GLEAM I18N בהשראת PARAGLIDE - תרגומים כקוד"
  }

  h.div([attr.class("marquee-container")], [
    h.div([attr.class("marquee-track")], [
      h.span([attr.class("marquee-text")], [text(subtitle_text)]),
      h.span([attr.class("marquee-text")], [text(subtitle_text)]),
      h.span([attr.class("marquee-text")], [text(subtitle_text)]),
      h.span([attr.class("marquee-text")], [text(subtitle_text)]),
    ]),
  ])
}

fn features_section(locale: Locale) -> Element(Msg) {
  h.section([attr.class("mb-16")], [
    h.div([attr.class("content-card features-card")], [
      h.h2([attr.class("text-2xl text-foreground mb-8 decorative-heading text-center")], [
        case locale {
          En -> text("Features")
          De -> text("Funktionen")
          Zh -> text("功能特点")
          Ar -> text("الميزات")
          He -> text("תכונות")
        },
      ]),
      h.div([attr.class("grid grid-cols-1 md:grid-cols-3 gap-6")], [
        feature_card("🚀", title(locale, 1), desc(locale, 1)),
        feature_card("🎯", title(locale, 2), desc(locale, 2)),
        feature_card("🔒", title(locale, 3), desc(locale, 3)),
      ]),
    ]),
  ])
}

fn title(locale: Locale, n: Int) -> Element(Msg) {
  case n {
    1 ->
      case locale {
        En -> text("Zero Dependencies")
        De -> text("Keine Abhängigkeiten")
        Zh -> text("零依赖")
        Ar -> text("بدون تبعيات")
        He -> text("אפס תלויות")
      }
    2 ->
      case locale {
        En -> text("Strategy Detection")
        De -> text("Strategie-Erkennung")
        Zh -> text("策略检测")
        Ar -> text("اكتشاف الاستراتيجية")
        He -> text("זיהוי אסטרטגיה")
      }
    _ ->
      case locale {
        En -> text("Type Safety")
        De -> text("Typsicherheit")
        Zh -> text("类型安全")
        Ar -> text("أمان النوع")
        He -> text("בטיחות סוגים")
      }
  }
}

fn desc(locale: Locale, n: Int) -> Element(Msg) {
  case n {
    1 ->
      case locale {
        En -> text("Nothing. Pure Gleam all the way down.")
        De -> text("Nichts. Rein Gleam durch und durch.")
        Zh -> text("什么都没有。甚至没有牵引绳。纯 Gleam 一路到底。")
        Ar -> text("لا شيء. Gleam نقي حتى النهاية.")
        He -> text("כלום. Gleam טהור עד הסוף.")
      }
    2 ->
      case locale {
        En -> text("Cookie, localStorage, URL, browser - all in Gleam.")
        De -> text("Cookie, localStorage, URL, Browser - alles in Gleam.")
        Zh -> text("Cookie、localStorage、URL、浏览器语言 - 全部在 Gleam 中实现。")
        Ar -> text("Cookie وlocalStorage وURL والمتصفح - كلها في Gleam.")
        He -> text("Cookie, localStorage, URL, דפדפן - הכל ב-Gleam.")
      }
    _ ->
      case locale {
        En -> text("The compiler catches bugs before your users.")
        De -> text("Der Compiler findet Fehler, bevor es Nutzer tun.")
        Zh -> text("编译器会在用户之前发现错误。")
        Ar -> text("المترجم يكتشف الأخطاء قبل المستخدمين.")
        He -> text("המהדר תופס באגים לפני המשתמשים שלך.")
      }
  }
}

fn feature_card(
  emoji: String,
  title: Element(Msg),
  desc: Element(Msg),
) -> Element(Msg) {
  h.div(
    [attr.class("feature-card")],
    [
      h.span([attr.class("text-2xl mb-4 block")], [text(emoji)]),
      h.h3([attr.class("text-foreground mb-2")], [title]),
      h.p([attr.class("text-muted-foreground")], [desc]),
    ],
  )
}

fn how_it_works_section(locale: Locale) -> Element(Msg) {
  h.section([attr.class("mb-16")], [
    h.h2([attr.class("text-2xl text-foreground mb-8 decorative-heading text-center")], [
      case locale {
        En -> text("How It Works")
        De -> text("So funktioniert es")
        Zh -> text("工作原理")
        Ar -> text("كيف يعمل")
        He -> text("איך זה עובד")
      },
    ]),
    h.div([attr.class("content-card")], [
      h.div([attr.class("content-card-content")], [
        step_card(1, step_title(locale, 1), step_desc(locale, 1)),
        code_example(locale, 1),
        step_card(2, step_title(locale, 2), step_desc(locale, 2)),
        code_example(locale, 2),
        step_card(3, step_title(locale, 3), step_desc(locale, 3)),
        code_example(locale, 3),
      ]),
    ]),
  ])
}

fn step_title(locale: Locale, n: Int) -> Element(Msg) {
  case n {
    1 ->
      case locale {
        En -> text("Write Translations")
        De -> text("Übersetzungen schreiben")
        Zh -> text("编写翻译")
        Ar -> text("اكتب الترجمات")
        He -> text("כתיבת תרגומים")
      }
    2 ->
      case locale {
        En -> text("Detect Locale")
        De -> text("Locale erkennen")
        Zh -> text("检测语言环境")
        Ar -> text("اكتشاف اللغة")
        He -> text("זיהוי שפה")
      }
    _ ->
      case locale {
        En -> text("Import & Use")
        De -> text("Importieren & Nutzen")
        Zh -> text("导入和使用")
        Ar -> text("استيراد واستخدام")
        He -> text("ייבוא ושימוש")
      }
  }
}

fn step_desc(locale: Locale, n: Int) -> Element(Msg) {
  case n {
    1 ->
      case locale {
        En -> text("Write Gleam constants and functions for your messages")
        De -> text("Schreibe Gleam-Konstanten und Funktionen für Nachrichten")
        Zh -> text("使用 Gleam 常量和函数编写您的消息")
        Ar -> text("اكتب ثوابت ودوال Gleam لرسائلك")
        He -> text("כתיבת קבועים ופונקציות של Gleam להודעות שלך")
      }
    2 ->
      case locale {
        En -> text("Use strategies to detect user's preferred language")
        De -> text("Verwende Strategien, um die bevorzugte Sprache zu erkennen")
        Zh -> text("使用策略检测用户首选语言")
        Ar -> text("استخدم الاستراتيجيات لاكتشاف لغة المستخدم المفضلة")
        He -> text("שימוש באסטרטגיות לזיהוי השפה המועדפת של המשתמש")
      }
    _ ->
      case locale {
        En -> text("Import correct module. Use like any value.")
        De -> text("Importiere das richtige Modul. Nutze es wie jeden Wert.")
        Zh -> text("根据语言环境导入正确的模块。像使用任何值一样使用它。")
        Ar -> text("استيراد الوحدة الصحيحة. استخدمها مثل أي قيمة.")
        He -> text("ייבוא המודול הנכון. שימוש כמו בכל ערך.")
      }
  }
}

fn step_card(
  num: Int,
  title: Element(Msg),
  desc: Element(Msg),
) -> Element(Msg) {
  let step_svg = "./step" <> int.to_string(num) <> ".svg"
  h.div([attr.class("flex gap-4 items-center")], [
    h.img([
      attr.src(step_svg),
      attr.alt("Step " <> int.to_string(num)),
      attr.class("step-number-svg"),
    ]),
    h.div([attr.class("flex-1")], [
      h.h3([attr.class("text-foreground mb-1")], [title]),
      h.p([attr.class("text-muted-foreground mb-2")], [desc]),
    ]),
  ])
}

fn code_example(locale: Locale, n: Int) -> Element(Msg) {
  let code = case n {
    1 ->
      case locale {
        En ->
          "// translations/en.gleam
pub const welcome = \"Welcome\"
pub const goodbye = \"Goodbye\"

// translations/de.gleam
pub const welcome = \"Willkommen\"
pub const goodbye = \"Auf Wiedersehen\""
        De ->
          "// translations/en.gleam
pub const welcome = \"Welcome\"
pub const goodbye = \"Goodbye\"

// translations/de.gleam
pub const welcome = \"Willkommen\"
pub const goodbye = \"Auf Wiedersehen\""
        Zh ->
          "// translations/en.gleam
pub const welcome = \"Welcome\"
pub const goodbye = \"Goodbye\"

// translations/de.gleam
pub const welcome = \"Willkommen\"
pub const goodbye = \"Auf Wiedersehen\""
        Ar ->
          "// translations/ar.gleam
pub const welcome = \"مرحبًا\"
pub const goodbye = \"مع السلامة\"

// translations/en.gleam
pub const welcome = \"Welcome\"
pub const goodbye = \"Goodbye\""
        He ->
          "// translations/he.gleam
pub const welcome = \"ברוכים הבאים\"
pub const goodbye = \"להתראות\"

// translations/en.gleam
pub const welcome = \"Welcome\"
pub const goodbye = \"Goodbye\""
      }
    2 ->
      case locale {
        En ->
          "const my_strategy = [
  strategy.local_storage(\"locale\"),
  strategy.preferred_language(),
  strategy.base_locale(En),
]

let result = strategy.evaluate(my_strategy, En)"
        De ->
          "const my_strategy = [
  strategy.local_storage(\"locale\"),
  strategy.preferred_language(),
  strategy.base_locale(En),
]

let result = strategy.evaluate(my_strategy, En)"
        Zh ->
          "const my_strategy = [
  strategy.local_storage(\"locale\"),
  strategy.preferred_language(),
  strategy.base_locale(En),
]

let result = strategy.evaluate(my_strategy, En)"
        Ar ->
          "const my_strategy = [
  strategy.local_storage(\"locale\"),
  strategy.preferred_language(),
  strategy.base_locale(Ar),
]

let result = strategy.evaluate(my_strategy, Ar)"
        He ->
          "const my_strategy = [
  strategy.local_storage(\"locale\"),
  strategy.preferred_language(),
  strategy.base_locale(He),
]

let result = strategy.evaluate(my_strategy, He)"
      }
    _ ->
      case locale {
        En ->
          "let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // \"Welcome\" or \"مرحبًا\""
        De ->
          "let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // \"Welcome\" or \"Willkommen\""
        Zh ->
          "let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // \"Welcome\" or \"欢迎\""
        Ar ->
          "let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // \"مرحبًا\" or \"Welcome\""
        He ->
          "let t = case result.locale {
  En -> en
  De -> de
  Ar -> ar
  He -> he
}

// Use translations
t.welcome  // \"ברוכים הבאים\" or \"Welcome\""
      }
  }

  h.div([attr.class("code-example-wrapper")], [
    h.pre([attr.class("code-block")], [text(code)]),
  ])
}

fn footer(model: Model) -> Element(Msg) {
  h.footer([attr.class("footer")], [
    h.div([attr.class("text-center")], [
      case model.locale {
        En -> text("Built with Gleam and Lustre")
        De -> text("Erstellt mit Gleam und Lustre")
        Zh -> text("使用 Gleam 和 Lustre 构建")
        Ar -> text("بني باستخدام Gleam و Lustre")
        He -> text("נבנה עם Gleam ו-Lustre")
      },
    ]),
  ])
}

fn live_detector(model: Model) -> Element(Msg) {
  let source_text = case model.detection_source {
    "localStorage" -> "localStorage"
    "cookie" -> "Cookie"
    "url" -> "URL"
    "preferredLanguage" -> "Browser Language"
    "baseLocale" -> "Default"
    "documentLang" -> "Document Lang"
    _ -> model.detection_source
  }

  let locale_display = case model.detected_locale {
    En -> "English"
    De -> "Deutsch"
    Zh -> "中文"
    Ar -> "العربية"
    He -> "עברית"
  }

  h.div([attr.class("live-detector")], [
    h.h3([attr.class("live-detector-title decorative-heading")], [
      text(case model.locale {
        En -> "Live Locale Detector"
        De -> "Live Locale-Erkennung"
        Zh -> "实时语言检测"
        Ar -> "اكتشاف اللغة المباشر"
        He -> "זיהוי שפה חי"
      }),
    ]),
    h.div([attr.class("live-detector-content")], [
      h.div([attr.class("detector-row")], [
        h.span([attr.class("detector-label")], [
          text(case model.locale {
            En -> "Detected Locale:"
            De -> "Erkannte Locale:"
            Zh -> "检测到的语言:"
            Ar -> "اللغة المكتشفة:"
            He -> "שפה זוהתה:"
          }),
        ]),
        h.span([attr.class("detector-value")], [text(locale_display)]),
      ]),
      h.div([attr.class("detector-row")], [
        h.span([attr.class("detector-label")], [
          text(case model.locale {
            En -> "Source:"
            De -> "Quelle:"
            Zh -> "来源:"
            Ar -> "المصدر:"
            He -> "מקור:"
          }),
        ]),
        h.span([attr.class("detector-value")], [text(source_text)]),
      ]),
      h.p([attr.class("detector-hint")], [
        text(case model.locale {
          En -> "Change language or clear localStorage to see different detection results."
          De -> "Sprache ändern oder localStorage löschen, um andere Erkennungsergebnisse zu sehen."
          Zh -> "更改语言或清除 localStorage 以查看不同的检测结果。"
          Ar -> "غيّر اللغة أو امسح localStorage لرؤية نتائج اكتشاف مختلفة."
          He -> "שנה שפה או נקה localStorage כדי לראות תוצאות זיהוי שונות."
        }),
      ]),
    ]),
  ])
}

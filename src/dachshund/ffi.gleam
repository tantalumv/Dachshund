//// FFI bindings for browser APIs.
////
//// These functions provide cross-platform access to browser features
//// for locale detection. On Erlang, they return safe defaults.
////
//// You typically don't need to use these directly—use the strategy
//// functions in [`dachshund/strategy`](./strategy.html) instead.

/// Options for setting cookies.
pub type CookieOptions {
  CookieOptions(path: String, max_age: Int, same_site: String)
}

/// Create cookie options.
///
/// ## Parameters
///
/// - `path`: The cookie path (use `"/"` for entire site)
/// - `max_age`: Seconds until the cookie expires
/// - `same_site`: Cross-site policy (`"strict"`, `"lax"`, or `"none"`)
///
/// ## Example
///
/// ```gleam
/// let options = ffi.cookie_options("/", 31536000, "lax")
/// ffi.set_cookie("locale", "en", options)
/// ```
pub fn cookie_options(
  path path: String,
  max_age max_age: Int,
  same_site same_site: String,
) -> CookieOptions {
  CookieOptions(path: path, max_age: max_age, same_site: same_site)
}

@target(javascript)
/// Get a cookie value by name.
///
/// Returns `Error(Nil)` if the cookie doesn't exist.
/// On Erlang, always returns `Error(Nil)`.
@external(javascript, "./dachshund_ffi.mjs", "get_cookie")
pub fn get_cookie(name: String) -> Result(String, Nil)

@target(erlang)
pub fn get_cookie(_name: String) -> Result(String, Nil) {
  Error(Nil)
}

@target(javascript)
/// Set a cookie with the given name, value, and options.
@external(javascript, "./dachshund_ffi.mjs", "set_cookie")
pub fn set_cookie(name: String, value: String, options: CookieOptions) -> Nil

@target(erlang)
pub fn set_cookie(_name: String, _value: String, _options: CookieOptions) -> Nil {
  Nil
}

@target(javascript)
/// Delete a cookie by name.
///
/// Note: To delete a cookie, you may need to set its path to match
/// the original path it was set with.
@external(javascript, "./dachshund_ffi.mjs", "delete_cookie")
pub fn delete_cookie(name: String) -> Nil

@target(erlang)
pub fn delete_cookie(_name: String) -> Nil {
  Nil
}

@target(javascript)
/// Get a value from localStorage by key.
///
/// Returns `Error(Nil)` if the key doesn't exist.
/// On Erlang, always returns `Error(Nil)`.
@external(javascript, "./dachshund_ffi.mjs", "get_local_storage")
pub fn get_local_storage(key: String) -> Result(String, Nil)

@target(erlang)
pub fn get_local_storage(_key: String) -> Result(String, Nil) {
  Error(Nil)
}

@target(javascript)
/// Set a value in localStorage.
@external(javascript, "./dachshund_ffi.mjs", "set_local_storage")
pub fn set_local_storage(key: String, value: String) -> Nil

@target(erlang)
pub fn set_local_storage(_key: String, _value: String) -> Nil {
  Nil
}

@target(javascript)
/// Delete a value from localStorage by key.
@external(javascript, "./dachshund_ffi.mjs", "delete_local_storage")
pub fn delete_local_storage(key: String) -> Nil

@target(erlang)
pub fn delete_local_storage(_key: String) -> Nil {
  Nil
}

@target(javascript)
/// Get the user's preferred languages from the browser.
///
/// Returns a list like `["en-US", "en", "es"]` from `navigator.languages`.
/// On Erlang, returns `["en"]`.
@external(javascript, "./dachshund_ffi.mjs", "get_preferred_languages")
pub fn get_preferred_languages() -> List(String)

@target(erlang)
pub fn get_preferred_languages() -> List(String) {
  ["en"]
}

@target(javascript)
/// Get the current URL pathname (e.g., `"/en/about"`).
///
/// On Erlang, returns `""`.
@external(javascript, "./dachshund_ffi.mjs", "get_pathname")
pub fn get_pathname() -> String

@target(erlang)
pub fn get_pathname() -> String {
  ""
}

@target(javascript)
/// Get the current hostname (e.g., `"example.com"`).
@external(javascript, "./dachshund_ffi.mjs", "get_hostname")
pub fn get_hostname() -> String

@target(erlang)
pub fn get_hostname() -> String {
  ""
}

@target(javascript)
/// Get the current URL search string (e.g., `"?lang=en"`).
@external(javascript, "./dachshund_ffi.mjs", "get_search")
pub fn get_search() -> String

@target(erlang)
pub fn get_search() -> String {
  ""
}

@target(javascript)
/// Replace the current URL without reloading the page.
@external(javascript, "./dachshund_ffi.mjs", "replace_url")
pub fn replace_url(url: String) -> Nil

@target(erlang)
pub fn replace_url(_url: String) -> Nil {
  Nil
}

@target(javascript)
/// Get the `lang` attribute from the `<html>` element.
///
/// On Erlang, returns `"en"`.
@external(javascript, "./dachshund_ffi.mjs", "get_document_lang")
pub fn get_document_lang() -> String

@target(erlang)
pub fn get_document_lang() -> String {
  "en"
}

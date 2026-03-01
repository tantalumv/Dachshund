pub type CookieOptions {
  CookieOptions(path: String, max_age: Int, same_site: String)
}

pub fn cookie_options(
  path path: String,
  max_age max_age: Int,
  same_site same_site: String,
) -> CookieOptions {
  CookieOptions(path: path, max_age: max_age, same_site: same_site)
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_cookie")
pub fn get_cookie(name: String) -> Result(String, Nil)

@target(erlang)
pub fn get_cookie(_name: String) -> Result(String, Nil) {
  Error(Nil)
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "set_cookie")
pub fn set_cookie(name: String, value: String, options: CookieOptions) -> Nil

@target(erlang)
pub fn set_cookie(_name: String, _value: String, _options: CookieOptions) -> Nil {
  Nil
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "delete_cookie")
pub fn delete_cookie(name: String) -> Nil

@target(erlang)
pub fn delete_cookie(_name: String) -> Nil {
  Nil
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_local_storage")
pub fn get_local_storage(key: String) -> Result(String, Nil)

@target(erlang)
pub fn get_local_storage(_key: String) -> Result(String, Nil) {
  Error(Nil)
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "set_local_storage")
pub fn set_local_storage(key: String, value: String) -> Nil

@target(erlang)
pub fn set_local_storage(_key: String, _value: String) -> Nil {
  Nil
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "delete_local_storage")
pub fn delete_local_storage(key: String) -> Nil

@target(erlang)
pub fn delete_local_storage(_key: String) -> Nil {
  Nil
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_preferred_languages")
pub fn get_preferred_languages() -> List(String)

@target(erlang)
pub fn get_preferred_languages() -> List(String) {
  ["en"]
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_pathname")
pub fn get_pathname() -> String

@target(erlang)
pub fn get_pathname() -> String {
  ""
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_hostname")
pub fn get_hostname() -> String

@target(erlang)
pub fn get_hostname() -> String {
  ""
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_search")
pub fn get_search() -> String

@target(erlang)
pub fn get_search() -> String {
  ""
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "replace_url")
pub fn replace_url(url: String) -> Nil

@target(erlang)
pub fn replace_url(_url: String) -> Nil {
  Nil
}

@target(javascript)
@external(javascript, "./dachshund_ffi.mjs", "get_document_lang")
pub fn get_document_lang() -> String

@target(erlang)
pub fn get_document_lang() -> String {
  "en"
}

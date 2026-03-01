import dachshund/locale
import gleeunit
import gleeunit/should

pub fn main() {
  gleeunit.main()
}

pub fn locale_to_string_test() {
  locale.to_string(locale.En) |> should.equal("en")
}

pub fn locale_from_string_test() {
  locale.from_string("de") |> should.equal(Ok(locale.De))
}

pub fn locale_text_direction_ltr_test() {
  locale.text_direction(locale.En) |> should.equal("ltr")
}

pub fn locale_text_direction_rtl_test() {
  locale.text_direction(locale.Ar) |> should.equal("rtl")
}

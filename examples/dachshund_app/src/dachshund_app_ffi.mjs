// JavaScript FFI helpers for dachshund_app
// Thin wrapper - all logic in Gleam

export function set_body_class(className) {
  if (typeof document !== "undefined") {
    document.documentElement.className = className;
  }
}

export function get_local_storage_item(key) {
  if (typeof localStorage === "undefined") {
    return "";
  }
  return localStorage.getItem(key) || "";
}

export function set_local_storage_item(key, value) {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(key, value);
}

export function has_local_storage_item(key) {
  if (typeof localStorage === "undefined") {
    return false;
  }
  return localStorage.getItem(key) !== null;
}

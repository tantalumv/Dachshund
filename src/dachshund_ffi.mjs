export function get_cookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const result = parts.pop().split(";").shift();
    return result === "" ? undefined : result;
  }
  return undefined;
}

export function set_cookie(name, value, options) {
  const expires = new Date(Date.now() + options.max_age * 1000).toUTCString();
  const cookie = [
    `${name}=${value}`,
    `expires=${expires}`,
    `path=${options.path}`,
    `SameSite=${options.same_site}`,
  ].join("; ");
  document.cookie = cookie;
}

export function delete_cookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function get_local_storage(key) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? undefined : value;
  } catch {
    return undefined;
  }
}

export function set_local_storage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage might be full or disabled
  }
}

export function delete_local_storage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}

export function get_preferred_languages() {
  return navigator.languages || [navigator.language || "en"];
}

export function get_pathname() {
  return window.location.pathname;
}

export function get_hostname() {
  return window.location.hostname;
}

export function get_search() {
  return window.location.search;
}

export function replace_url(url) {
  window.history.replaceState({}, "", url);
}

export function get_document_lang() {
  return document.documentElement.lang || "en";
}

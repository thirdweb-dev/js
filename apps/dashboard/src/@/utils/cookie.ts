"use client";

export function getCookie(name: string) {
  try {
    const value = document.cookie;
    const cookies = value.split(";");

    for (const c of cookies) {
      const [_name, _val] = c.trim().split("=");
      if (_name === name && _val) {
        return decodeURIComponent(_val);
      }
    }
  } catch {
    // ignore
  }

  return undefined;
}

export function setCookie(name: string, value: string, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  // biome-ignore lint/suspicious/noDocumentCookie: EXPECTED
  document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`;
}

export function deleteCookie(name: string) {
  // biome-ignore lint/suspicious/noDocumentCookie: EXPECTED
  document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

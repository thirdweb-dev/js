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
  document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`;
}

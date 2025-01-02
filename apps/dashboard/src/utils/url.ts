export function hostnameEndsWith(url: string, matches: `${string}.${string}`) {
  try {
    const host = new URL(url).host;
    return host.endsWith(matches);
  } catch {
    // if we fail to parse the url, we can't match it
    return false;
  }
}

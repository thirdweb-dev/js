export function formatDisplayUri(
  uri: string,
  links: { universal: string; native: string },
) {
  const encodedUri: string = encodeURIComponent(uri);
  return links.universal
    ? `${links.universal}/wc?uri=${encodedUri}`
    : links.native
    ? `${links.native}${
        links.native.endsWith(":") ? "//" : "/"
      }wc?uri=${encodedUri}`
    : `${uri}`;
}

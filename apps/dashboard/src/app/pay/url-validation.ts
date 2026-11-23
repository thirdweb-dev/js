/**
 * Validates and normalizes a URL string.
 * Only allows http: and https: protocols with a valid hostname.
 * @returns normalized URL string on success, undefined on failure
 */
export const onlyUrl = (v: string): string | undefined => {
  try {
    const url = new URL(v);
    // Only allow http or https protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return undefined;
    }
    // Ensure hostname is non-empty
    if (!url.hostname) {
      return undefined;
    }
    // Return normalized URL
    return url.toString();
  } catch {
    // Invalid URL format
    return undefined;
  }
};

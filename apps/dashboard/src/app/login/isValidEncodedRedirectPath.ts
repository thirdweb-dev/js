export function isValidEncodedRedirectPath(encodedPath: string): boolean {
  try {
    const decodedPath = decodeURIComponent(encodedPath);
    if (!decodedPath.startsWith("/")) {
      return false;
    }
    const url = new URL(decodedPath, "https://thirdweb.com");
    return url.hostname === "thirdweb.com";
  } catch {
    // If decoding fails, return false
    return false;
  }
}

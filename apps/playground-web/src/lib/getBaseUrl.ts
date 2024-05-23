export function getMetadataBaseUrl() {
  return process.env.VERCEL_ENV === "production"
    ? new URL("https://playground.thirdweb.com")
    : undefined;
}

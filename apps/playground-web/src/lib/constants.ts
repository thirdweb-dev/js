export const metadataBase = process.env.VERCEL_ENV
  ? new URL("https://playground.thirdweb.com")
  : undefined;

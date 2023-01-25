import { isBrowser } from "utils/isBrowser";

export function getVercelEnv() {
  const onVercel = process.env.vercel || process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (!onVercel) {
    return "development";
  }
  return (process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    "production") as "production" | "preview" | "development";
}

export function getAbsoluteUrl(): string {
  if (process.env.CI) {
    return "https://thirdweb.com";
  }
  const env = getVercelEnv();

  if (env === "production") {
    return "https://thirdweb.com";
  }
  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  if (isBrowser()) {
    return window.location.origin;
  }
  return "https://thirdweb.com";
}

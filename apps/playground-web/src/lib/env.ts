// export const isProd =
//   (process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV) ===
//   "production";

function getVercelEnv(): "production" | "preview" | "development" {
  const onVercel = process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV;

  // localhost
  if (!onVercel) {
    return "development";
  }

  const vercelEnv =
    process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV;

  if (
    vercelEnv === "production" ||
    vercelEnv === "preview" ||
    vercelEnv === "development"
  ) {
    return vercelEnv;
  }

  // if running on vercel but for some reason failed to vercel env is not set -> production
  return "production";
}

export function getBaseUrl(): string {
  const env = getVercelEnv();

  //  dev
  if (env === "development") {
    return "http://localhost:3000";
  }

  // prod
  if (env === "production") {
    return "https://playground.thirdweb.com";
  }

  // preview
  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  // preview but missing the preview URL for some reason -> production
  return "https://playground.thirdweb.com";
}

export function isVercel() {
  return !!(process.env.vercel || process.env.NEXT_PUBLIC_VERCEL_ENV);
}

export function getVercelEnv() {
  if (!isVercel()) {
    return "development";
  }
  return (process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    "production") as "production" | "preview" | "development";
}

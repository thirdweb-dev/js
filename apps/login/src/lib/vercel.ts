export function getVercelEnv() {
  const onVercel = process.env.vercel || process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (!onVercel) {
    return "development";
  }
  return (process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    "production") as "production" | "preview" | "development";
}

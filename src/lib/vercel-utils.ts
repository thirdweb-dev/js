import { isBrowser } from "utils/isBrowser";
import { setThirdwebDomains } from "thirdweb/utils";

function getVercelEnv() {
  const onVercel = process.env.vercel || process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (!onVercel) {
    return "development";
  }
  return (process.env.VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV ||
    "production") as "production" | "preview" | "development";
}

export function getAbsoluteUrl(): string {
  // once we're in the browser we can just use the window.location.origin
  if (isBrowser()) {
    return window.location.origin;
  }
  if (process.env.CI) {
    return "https://thirdweb.com";
  }
  const env = getVercelEnv();
  // if we're in development we can just use the localhost
  if (env === "development") {
    // TODO - this should be a config
    return "http://localhost:3000";
  }

  if (env === "production") {
    return "https://thirdweb.com";
  }
  const vercelUrl =
    process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "https://thirdweb.com";
}

function setOverrides() {
  if (getVercelEnv() === "production") {
    // no overrides
    return;
  }
  /* DEFAULTS

  const DEFAULT_RPC_URL = "rpc.thirdweb.com";
  const DEFAULT_IN_APP_WALLET_URL = "embedded-wallet.thirdweb.com";
  const DEFAULT_PAY_URL = "pay.thirdweb.com";
  const DEFAULT_STORAGE_URL = "storage.thirdweb.com";
  */

  setThirdwebDomains({
    rpc: process.env.NEXT_PUBLIC_RPC_URL || "rpc.thirdweb-dev.com",
    inAppWallet:
      process.env.NEXT_PUBLIC_IN_APP_WALLET_URL ||
      "embedded-wallet.thirdweb-dev.com",
    pay: process.env.NEXT_PUBLIC_PAY_URL || "pay.thirdweb-dev.com",
    storage: process.env.NEXT_PUBLIC_STORAGE_URL || "storage.thirdweb-dev.com",
  });
}

setOverrides();

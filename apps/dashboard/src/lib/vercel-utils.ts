import {
  THIRDWEB_INAPP_WALLET_DOMAIN,
  THIRDWEB_PAY_DOMAIN,
  THIRDWEB_RPC_DOMAIN,
  THIRDWEB_STORAGE_DOMAIN,
} from "constants/urls";
import { setThirdwebDomains } from "thirdweb/utils";
import { isBrowser } from "utils/isBrowser";

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
    rpc: THIRDWEB_RPC_DOMAIN,
    inAppWallet: THIRDWEB_INAPP_WALLET_DOMAIN,
    pay: THIRDWEB_PAY_DOMAIN,
    storage: THIRDWEB_STORAGE_DOMAIN,
  });
}

setOverrides();

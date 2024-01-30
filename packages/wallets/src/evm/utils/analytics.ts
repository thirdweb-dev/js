import { isWalletAnalyticsEnabled } from "./setWalletAnaltyicsEnabled";
import pkg from "../../../package.json";
import { getOperatingSystem } from "./os/os";

const ANALYTICS_ENDPOINT = "https://c.thirdweb.com/event";

export function track(args: {
  clientId: string;
  source: string;
  action: string;
  walletType: string;
  walletAddress: string;
}) {
  if (!isWalletAnalyticsEnabled()) {
    return;
  }
  const { clientId, walletType, walletAddress, source, action } = args;
  const body = {
    source,
    action,
    walletAddress,
    walletType,
  };
  // don't block on analytic calls
  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-sdk-version": (globalThis as any).X_SDK_VERSION || pkg.version,
      "x-sdk-name": (globalThis as any).X_SDK_NAME || pkg.name,
      "x-sdk-platform":
        (globalThis as any).X_SDK_PLATFORM ||
        (typeof navigator !== "undefined" &&
          navigator.product === "ReactNative")
          ? "mobile"
          : typeof window !== "undefined"
            ? "browser"
            : "node",
      "x-sdk-os": (globalThis as any).X_SDK_OS || getOperatingSystem(),
    },
    body: JSON.stringify(body),
  });
}

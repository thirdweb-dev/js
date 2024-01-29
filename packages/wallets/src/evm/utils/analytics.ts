import { isWalletAnalyticsEnabled } from "./setWalletAnaltyicsEnabled";

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
      "x-sdk-version": (globalThis as any).X_SDK_VERSION,
      "x-sdk-name": (globalThis as any).X_SDK_NAME,
      "x-sdk-platform": (globalThis as any).X_SDK_PLATFORM,
      "x-sdk-os": (globalThis as any).X_SDK_OS,
    },
    body: JSON.stringify(body),
  });
}

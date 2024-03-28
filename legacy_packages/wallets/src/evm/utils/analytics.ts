import { isWalletAnalyticsEnabled } from "./setWalletAnaltyicsEnabled";
import { getAnalyticsHeaders } from "./headers";

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
      ...getAnalyticsHeaders(),
    },
    body: JSON.stringify(body),
  });
}

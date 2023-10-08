import { fetch } from "cross-fetch";

const ANALYTICS_ENDPOINT = "https://c.thirdweb-dev.com/event";

export function track(args: {
  clientId: string;
  source: string;
  action: string;
  walletType: string;
  walletAddress: string;
}) {
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
    },
    body: JSON.stringify(body),
  });
}

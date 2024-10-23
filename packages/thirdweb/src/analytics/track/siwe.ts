import type { ThirdwebClient } from "../../client/client.js";
import { stringify } from "../../utils/json.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
import { track } from "./index.js";

type SiweEvent = {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  walletAddress?: string;
  walletType?: string;
  chainId?: number;
  error?: {
    message: string;
    code: string;
  };
};

/**
 * @internal
 */
export async function trackLogin(event: SiweEvent) {
  return trackSiweEvent({
    ...event,
    action: "login:attempt",
  });
}

/**
 * @internal
 */
async function trackSiweEvent(
  event: SiweEvent & {
    action: "login:attempt";
  },
) {
  return track({
    client: event.client,
    ecosystem: event.ecosystem,
    data: {
      action: event.action,
      clientId: event.client.clientId,
      chainId: event.chainId,
      walletAddress: event.walletAddress,
      walletType: event.walletType,
      errorCode: stringify(event.error),
    },
  });
}

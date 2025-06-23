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
    data: {
      action: event.action,
      chainId: event.chainId,
      clientId: event.client.clientId,
      errorCode: stringify(event.error),
      walletAddress: event.walletAddress,
      walletType: event.walletType,
    },
    ecosystem: event.ecosystem,
  });
}

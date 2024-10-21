import type { Ecosystem } from "src/wallets/in-app/core/wallet/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { stringify } from "../../utils/json.js";
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

type SiweSuccessEvent = SiweEvent & {
  error?: undefined;
};

/**
 * @internal
 */
export async function trackLogin(event: SiweSuccessEvent) {
  return trackSiweEvent({
    ...event,
    type: "login:success",
  });
}

type SiweErrorEvent = SiweEvent & {
  error: {
    message: string;
    code: string;
  };
};

/**
 * @internal
 */
export async function trackLoginError(event: SiweErrorEvent) {
  return trackSiweEvent({
    ...event,
    type: "login:error",
  });
}

/**
 * @internal
 */
async function trackSiweEvent(
  event: SiweEvent & {
    type: "login:success" | "login:error";
  },
) {
  return track({
    client: event.client,
    ecosystem: event.ecosystem,
    data: {
      action: event.type,
      clientId: event.client.clientId,
      chainId: event.chainId,
      walletAddress: event.walletAddress,
      walletType: event.walletType,
      errorCode: stringify(event.error),
    },
  });
}

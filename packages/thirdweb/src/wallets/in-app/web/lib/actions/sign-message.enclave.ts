import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import { stringify } from "../../../../../utils/json.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../../../core/wallet/types.js";

export async function signMessage({
  client,
  ecosystem,
  payload: { message, isRaw },
  storage,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  payload: {
    message: string;
    isRaw: boolean;
  };
  storage: ClientScopedStorage;
}) {
  const clientFetch = getClientFetch(client, ecosystem);
  const authToken = await storage.getAuthCookie();

  const response = await clientFetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/v1/enclave-wallet/sign-message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-thirdweb-client-id": client.clientId,
        Authorization: `Bearer embedded-wallet-token:${authToken}`,
      },
      body: stringify({
        messagePayload: {
          message,
          isRaw,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to sign message");
  }

  const signedMessage = (await response.json()) as {
    r: string;
    s: string;
    v: number;
    signature: string;
    hash: string;
  };
  return signedMessage;
}

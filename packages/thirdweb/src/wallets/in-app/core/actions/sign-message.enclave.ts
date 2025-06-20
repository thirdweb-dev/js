import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";

export async function signMessage({
  client,
  payload: { message, isRaw, originalMessage, chainId },
  storage,
}: {
  client: ThirdwebClient;
  payload: {
    message: string;
    isRaw: boolean;
    originalMessage?: string;
    chainId?: number;
  };
  storage: ClientScopedStorage;
}) {
  const authToken = await storage.getAuthCookie();
  const ecosystem = storage.ecosystem;
  const clientFetch = getClientFetch(client, ecosystem);

  if (!authToken) {
    throw new Error("No auth token found when signing message");
  }

  const response = await clientFetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/v1/enclave-wallet/sign-message`,
    {
      body: stringify({
        messagePayload: {
          chainId,
          isRaw,
          message,
          originalMessage,
        },
      }),
      headers: {
        Authorization: `Bearer embedded-wallet-token:${authToken}`,
        "Content-Type": "application/json",
        "x-thirdweb-client-id": client.clientId,
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to sign message - ${response.status} ${response.statusText}`,
    );
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

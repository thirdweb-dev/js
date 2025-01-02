import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { Hex } from "../../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";

export async function signTransaction({
  client,
  payload,
  storage,
}: {
  client: ThirdwebClient;
  payload: Record<string, Hex | number | undefined>;
  storage: ClientScopedStorage;
}) {
  const authToken = await storage.getAuthCookie();
  const ecosystem = storage.ecosystem;
  const clientFetch = getClientFetch(client, ecosystem);

  if (!authToken) {
    throw new Error("No auth token found when signing transaction");
  }

  const response = await clientFetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/v1/enclave-wallet/sign-transaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-thirdweb-client-id": client.clientId,
        Authorization: `Bearer embedded-wallet-token:${authToken}`,
      },
      body: stringify({
        transactionPayload: payload,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to sign transaction - ${response.status} ${response.statusText}`,
    );
  }

  const signedTransaction = (await response.json()) as {
    r: string;
    s: string;
    v: number;
    signature: string;
    hash: string;
  };
  return signedTransaction.signature as Hex;
}

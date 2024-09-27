import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import { stringify } from "../../../../../utils/json.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../../../core/wallet/types.js";

export async function signTransaction({
  client,
  ecosystem,
  payload,
  storage,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  payload: Record<string, Hex | number | undefined>;
  storage: ClientScopedStorage;
}) {
  console.log("payload", payload);
  const clientFetch = getClientFetch(client, ecosystem);
  const authToken = await storage.getAuthCookie();

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
    throw new Error("Failed to sign transaction");
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

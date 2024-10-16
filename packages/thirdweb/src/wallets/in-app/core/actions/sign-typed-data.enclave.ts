import type { TypedData } from "abitype";
import type { TypedDataDefinition } from "viem";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";

export async function signTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>({
  client,
  payload,
  storage,
}: {
  client: ThirdwebClient;
  payload: TypedDataDefinition<typedData, primaryType>;
  storage: ClientScopedStorage;
}) {
  const authToken = await storage.getAuthCookie();
  const ecosystem = storage.ecosystem;
  const clientFetch = getClientFetch(client, ecosystem);

  if (!authToken) {
    throw new Error("No auth token found when signing typed data");
  }

  const response = await clientFetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/v1/enclave-wallet/sign-typed-data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-thirdweb-client-id": client.clientId,
        Authorization: `Bearer embedded-wallet-token:${authToken}`,
      },
      body: stringify({
        ...payload,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to sign typed data");
  }

  const signedTypedData = (await response.json()) as {
    r: string;
    s: string;
    v: number;
    signature: string;
    hash: string;
  };
  return signedTypedData;
}

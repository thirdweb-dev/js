import type * as ox__TypedData from "ox/TypedData";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import { stringify } from "../../../../utils/json.js";
import type { ClientScopedStorage } from "../authentication/client-scoped-storage.js";

export async function signTypedData<
  const typedData extends ox__TypedData.TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>({
  client,
  payload,
  storage,
}: {
  client: ThirdwebClient;
  payload: ox__TypedData.Definition<typedData, primaryType>;
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
      body: stringify({
        ...payload,
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
      `Failed to sign typed data - ${response.status} ${response.statusText}`,
    );
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

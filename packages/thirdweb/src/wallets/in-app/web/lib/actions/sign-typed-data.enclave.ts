import type { TypedData } from "abitype";
import type { TypedDataDefinition } from "viem";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../../utils/domains.js";
import { getClientFetch } from "../../../../../utils/fetch.js";
import { stringify } from "../../../../../utils/json.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type { Ecosystem } from "../../../core/wallet/types.js";

export async function signTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | "EIP712Domain" = keyof typedData,
>({
  client,
  ecosystem,
  payload,
  storage,
}: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  payload: TypedDataDefinition<typedData, primaryType>;
  storage: ClientScopedStorage;
}) {
  const clientFetch = getClientFetch(client, ecosystem);
  const authToken = await storage.getAuthCookie();

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

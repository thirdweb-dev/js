import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { UserWallet } from "../wallet/enclave-wallet.js";
import type { Ecosystem } from "../wallet/types.js";

/**
 * Generate a new enclave wallet using an auth token
 * @internal
 */
export async function generateWallet({
  client,
  ecosystem,
  authToken,
}: {
  client: ThirdwebClient;
  authToken: string;
  ecosystem?: Ecosystem;
}) {
  const clientFetch = getClientFetch(client, ecosystem);
  const response = await clientFetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/v1/enclave-wallet/generate`,
    {
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
      `Failed to generate wallet - ${response.status} ${response.statusText}`,
    );
  }

  const { wallet } = (await response.json()) as {
    wallet: UserWallet;
  };

  return wallet;
}

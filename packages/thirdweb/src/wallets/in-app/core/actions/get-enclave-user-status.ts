import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import { getClientFetch } from "../../../../utils/fetch.js";
import type { UserStatus } from "../wallet/enclave-wallet.js";
import type { Ecosystem } from "../wallet/types.js";

/**
 * Gets the user's status from the backend.
 *
 * @internal
 */
export async function getUserStatus({
  authToken,
  client,
  ecosystem,
}: {
  authToken: string;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
}): Promise<UserStatus | undefined> {
  const clientFetch = getClientFetch(client, ecosystem);
  const response = await clientFetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/accounts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-thirdweb-client-id": client.clientId,
        Authorization: `Bearer embedded-wallet-token:${authToken}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      // 401 response indicates there is no user logged in, so we return undefined
      return undefined;
    }
    const result = await response.json();
    throw new Error(`Failed to get user status: ${result.message}`);
  }

  return (await response.json()) as UserStatus;
}

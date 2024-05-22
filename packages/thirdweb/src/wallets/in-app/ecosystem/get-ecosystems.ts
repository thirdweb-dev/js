import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import { getClientFetch } from "../../../utils/fetch.js";
import type { Ecosystem } from "./types.js";

export type GetEcosystemsOptions = {
  client: ThirdwebClient;
  id?: string;
};

/**
 * Retrieves all wallet ecosystems  for an account.
 *
 * @param {GetEcosystemsOptions} options - The options required to retrieve one or more wallet ecosystems.
 * @param {ThirdwebClient} options.client - The thirdweb client instance, which must include a valid secret key for authentication.
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful.
 * @throws {Error} Throws an error if the secret key is not set in the client, if the API request fails, or if the response indicates an authorization or other server-side error.
 *
 * @example
 * The provided client **must** have a secret key set.
 * ```typescript
 * import { createThirdwebClient } from "thirdweb";
 * import { getEcosystems } from "thirdweb/wallets/ecosystem";
 *
 * const client = createThirdwebClient({ secretKey: 'your_secret_key' });
 * const updated = await getEcosystems({
 *   client: client,
 * });
 * ```
 */
export async function getEcosystems(
  options: GetEcosystemsOptions,
): Promise<Ecosystem[]> {
  if (!options.client.secretKey) {
    throw new Error(
      "Unauthorized - Secret Key is required to retrieve an ecosystem.",
    );
  }

  const res = await getClientFetch(options.client)(
    `https://${
      getThirdwebDomains().inAppWallet
    }/api/2024-05-05/ecosystem-wallet/provider`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    res.body?.cancel();
    if (res.status === 401) {
      throw new Error(
        "Unauthorized - You don't have permission to use this service. Make sure your secret key is set on your client.",
      );
    }
    throw new Error(
      `Failed to retrieve the wallet ecosystem(s) info - ${res.status} - ${res.statusText}`,
    );
  }

  const body = await res.json();

  return body;
}

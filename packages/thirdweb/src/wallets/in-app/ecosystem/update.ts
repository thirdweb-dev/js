import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import { getClientFetch } from "../../../utils/fetch.js";

export type EcosystemUpdateOptions = {
  client: ThirdwebClient;
  id: string;
  name?: string;
  logoUrl?: string;
};

/**
 * Updates an existing wallet ecosystem with the provided details.
 *
 * @param {EcosystemUpdateOptions} options - The options required to update the wallet ecosystem.
 * @param {ThirdwebClient} options.client - The thirdweb client instance, which must include a valid secret key for authentication.
 * @param {string} options.id - The ID of the wallet ecosystem to be updated.
 * @param {string} [options.name] - The new name of the wallet ecosystem (if updating the name).
 * @param {string} [options.logoUrl] - The URL pointing to the new logo image for the wallet ecosystem (if updating the logo).
 * @returns {Promise<boolean>} A promise that resolves to true if the update was successful.
 * @throws {Error} Throws an error if the secret key is not set in the client, if the API request fails, or if the response indicates an authorization or other server-side error.
 *
 * @example
 * The provided client **must** have a secret key set.
 * ```typescript
 * import { createThirdwebClient } from "thirdweb";
 * import { updateWalletEcosystem } from "thirdweb/wallets/ecosystem";
 *
 * const client = createThirdwebClient({ secretKey: 'your_secret_key' });
 * const updated = await updateWalletEcosystem({
 *   client: client,
 *   id: 'ecosystem_id',
 *   name: 'My New Ecosystem',
 *   logoUrl: 'https://example.com/logo.png'
 * });
 * ```
 */
export async function updateWalletEcosystem(options: EcosystemUpdateOptions) {
  if (!options.client.secretKey) {
    throw new Error(
      "Unauthorized - Secret Key is required to update a wallet ecosystem.",
    );
  }

  const res = await getClientFetch(options.client)(
    `https://${
      getThirdwebDomains().inAppWallet
    }/api/2024-05-05/ecosystem-wallet/provider/${options.id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name: options.name,
        logoUrl: options.logoUrl,
      }),
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
      `Failed to update the wallet ecosystem - ${res.status} - ${res.statusText}`,
    );
  }

  return true;
}

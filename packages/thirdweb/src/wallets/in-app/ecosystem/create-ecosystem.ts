import type { ThirdwebClient } from "../../../client/client.js";
import { getThirdwebDomains } from "../../../utils/domains.js";
import { getClientFetch } from "../../../utils/fetch.js";

export type CreateEcosystemOptions = {
  client: ThirdwebClient;
  name: string;
  logoUrl: string;
};

/**
 * Creates a new wallet ecosystem with the provided details.
 *
 * @param {CreateEcosystemOptions} options - The options required to create the wallet ecosystem.
 * @param {ThirdwebClient} options.client - The thirdweb client instance, which must include a valid secret key for authentication.
 * @param {string} options.name - The name of the wallet ecosystem to be created.
 * @param {string} options.logoUrl - The URL pointing to the logo image for the wallet ecosystem.
 * @returns {Promise<string>} A promise that resolves to the ID of the newly created wallet ecosystem.
 * @throws {Error} Throws an error if the secret key is not set in the client, if the API request fails, or if the response indicates an authorization or other server-side error.
 *
 * @example
 * The provided client **must** have a secret key set.
 * ```typescript
 * import { createThirdwebClient } from "thirdweb";
 * import { createEcosystem } from "thirdweb/wallets/ecosystem";
 *
 * const client = createThirdwebClient({ secretKey: 'your_secret_key' });
 * const ecosystemId = await createEcosystem({
 *   client: client,
 *   name: 'My New Ecosystem',
 *   logoUrl: 'https://example.com/logo.png'
 * });
 * ```
 */
export async function createEcosystem(
  options: CreateEcosystemOptions,
): Promise<string> {
  if (!options.client.secretKey) {
    throw new Error(
      "Unauthorized - Secret Key is required to create a wallet ecosystem.",
    );
  }

  const res = await getClientFetch(options.client)(
    `https://${
      getThirdwebDomains().inAppWallet
    }/api/2024-05-05/ecosystem-wallet/provider`,
    {
      method: "POST",
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
      `Failed to create a new wallet ecosystem - ${res.status} - ${res.statusText}`,
    );
  }

  const body = await res.json();

  return body.id;
}

import { getThirdwebBaseUrl } from "../../utils/domains.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { WalletInfo } from "../wallet-info.js";
import type { EcosystemWalletId } from "../wallet-types.js";

/**
 * Fetches metadata for a given ecosystem wallet.
 *
 * @param {EcosystemWalletId} walletId - The ecosystem wallet ID.
 * @returns {Promise<{ imageUrl: string | undefined, name: string | undefined }>} A promise that resolves to an object containing the wallet's image URL and name.
 * @throws {Error} Throws an error if no partner ID is provided in the wallet configuration.
 * @internal
 */
export async function getEcosystemWalletInfo(
  walletId: EcosystemWalletId,
): Promise<Prettify<WalletInfo>> {
  const res = await fetch(
    `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/ecosystem-wallet`,
    {
      headers: {
        "x-ecosystem-id": walletId,
      },
    },
  );

  const data = await res.json();

  if (!data || data.code === "UNAUTHORIZED") {
    throw new Error(
      data.message ||
        `Could not find ecosystem wallet with id ${walletId}, please check your ecosystem wallet configuration.`,
    );
  }

  return {
    id: walletId,
    name: data.name as string,
    image_id: data.imageUrl as string,
    homepage: data.homepage as string,
    rdns: null,
    app: {
      browser: null,
      ios: null,
      android: null,
      mac: null,
      windows: null,
      linux: null,
      opera: null,
      chrome: null,
      firefox: null,
      safari: null,
      edge: null,
    },
    mobile: {
      native: null,
      universal: null,
    },
    desktop: {
      native: null,
      universal: null,
    },
  };
}

import type { Prettify } from "../../utils/type-utils.js";
import type { WalletInfo } from "../wallet-info.js";
import type { EcosystemWalletId } from "../wallet-types.js";
import { getEcosystemInfo } from "./get-ecosystem-wallet-auth-options.js";

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
  const data = await getEcosystemInfo(walletId);

  return {
    id: walletId,
    name: data.name,
    image_id: data.imageUrl || "",
    homepage: data.homepage || "",
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

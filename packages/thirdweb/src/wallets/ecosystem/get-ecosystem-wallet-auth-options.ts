import { getThirdwebBaseUrl } from "../../utils/domains.js";
import type { AuthOption } from "../types.js";
import type { EcosystemWalletId } from "../wallet-types.js";

/**
 * Retrieves the specified auth options for a given ecosystem wallet, if any.
 * @param walletId The ecosystem wallet ID.
 * @returns {AuthOption[] | undefined} The auth options for the ecosystem wallet.
 * @internal
 */
export async function getEcosystemWalletAuthOptions(
  walletId: EcosystemWalletId,
): Promise<AuthOption[] | undefined> {
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

  return data.authOptions ?? undefined;
}

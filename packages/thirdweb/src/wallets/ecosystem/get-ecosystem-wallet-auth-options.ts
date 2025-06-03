import { getThirdwebBaseUrl } from "../../utils/domains.js";
import { withCache } from "../../utils/promise/withCache.js";
import type { AuthOption } from "../types.js";
import type { EcosystemWalletId } from "../wallet-types.js";

type EcosystemOptions = {
  name: string;
  imageUrl?: string;
  slug: string;
  homepage?: string;
  authOptions: AuthOption[];
  smartAccountOptions: SmartAccountOptions;
};

type SmartAccountOptions = {
  defaultChainId: number;
  sponsorGas: boolean;
  accountFactoryAddress?: string;
  executionMode?: "EIP4337" | "EIP7702";
};

/**
 * Retrieves the specified auth options for a given ecosystem wallet, if any.
 * @param walletId The ecosystem wallet ID.
 * @returns {AuthOption[] | undefined} The auth options for the ecosystem wallet.
 * @internal
 */
export async function getEcosystemInfo(
  walletId: EcosystemWalletId,
): Promise<EcosystemOptions> {
  return withCache(
    async () => {
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

      // siwe is the auth option in the backend, but we want to use wallet as the auth option in the frontend
      if (data.authOptions?.includes("siwe")) {
        data.authOptions = data.authOptions.filter((o: string) => o !== "siwe");
        data.authOptions.push("wallet");
      }

      return data;
    },
    {
      cacheKey: `ecosystem-wallet-options-${walletId}`,
      cacheTime: 1000 * 60 * 5, // 5 mins
    },
  );
}

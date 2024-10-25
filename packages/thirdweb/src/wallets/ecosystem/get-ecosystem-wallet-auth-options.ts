import { getThirdwebBaseUrl } from "../../utils/domains.js";
import type { AuthOption } from "../types.js";
import type { EcosystemWalletId } from "../wallet-types.js";

export type EcosystemOptions = {
  authOptions: AuthOption[];
  smartAccountOptions: SmartAccountOptions;
};

type SmartAccountOptions = {
  chainIds: number[];
  sponsorGas: boolean;
  accountFactoryAddress: string;
};

/**
 * Retrieves the specified auth options for a given ecosystem wallet, if any.
 * @param walletId The ecosystem wallet ID.
 * @returns {AuthOption[] | undefined} The auth options for the ecosystem wallet.
 * @internal
 */
export async function getEcosystemOptions(
  walletId: EcosystemWalletId,
): Promise<EcosystemOptions | null> {
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

  return data ?? null;
}

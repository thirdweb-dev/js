import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import { getProfiles } from "../../../../wallets/in-app/core/wallet/profiles.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useAdminWallet } from "../wallets/useAdminAccount.js";

/**
 * Retrieves all linked profiles for the current wallet.
 *
 * @returns A React Query result containing the linked profiles for the connected in-app wallet.
 *
 * @note This hook will only run if the connected wallet supports multi-auth (in-app wallets).
 *
 * @example
 * ```jsx
 * import { useProfiles } from "thirdweb/react";
 *
 * const { data: profiles } = useProfiles();
 *
 * console.log("Type:", profiles[0].type); // "discord"
 * console.log("Email:", profiles[0].details.email); // "john.doe@example.com"
 * ```
 *
 * @wallet
 */
export function useProfiles(): UseQueryResult<Profile[]> {
  const wallet = useAdminWallet();

  return useQuery({
    queryKey: ["profiles", wallet?.id],
    enabled: !!wallet && (wallet.id === "inApp" || isEcosystemWallet(wallet)),
    queryFn: async () => {
      return getProfiles(wallet as Wallet<"inApp">);
    },
  });
}

import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import { getProfiles } from "../../../../wallets/in-app/core/wallet/profiles.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { useActiveWallet } from "../wallets/useActiveWallet.js";

/**
 * Retrieves all linked profiles for the current wallet.
 *
 * @returns A React Query result containing the linked profiles for the connected in-app wallet.
 *
 * @note This hook will only run if the connected wallet supports multi-auth (in-app wallets).
 *
 * @example
 * ```jsx
 * import { use } from "thirdweb/react";
 *
 * const { data: profiles } = useProfiles();
 *
 * console.log("Type:", profiles[0].type); // "discord"
 * console.log("Email:", profiles[0].email); // "john.doe@example.com"
 * ```
 *
 * @wallet
 */
export function useProfiles(): UseQueryResult<Profile[]> {
  const wallet = useActiveWallet();

  return useQuery({
    queryKey: ["profiles", wallet?.id],
    enabled: !!wallet && wallet.id === "inApp",
    queryFn: async () => {
      return getProfiles(wallet as Wallet<"inApp">);
    },
  });
}

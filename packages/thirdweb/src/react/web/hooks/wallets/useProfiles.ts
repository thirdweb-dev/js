import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import type { Ecosystem } from "../../../../wallets/in-app/core/wallet/types.js";
import { getProfiles } from "../../../../wallets/in-app/web/lib/auth/index.js";
import { useConnectedWallets } from "../../../core/hooks/wallets/useConnectedWallets.js";

/**
 * Retrieves all linked profiles of the connected in-app or ecosystem account.
 *
 * @returns A React Query result containing the linked profiles for the connected in-app account.
 *  This hook will only run if the connected wallet supports account linking.
 *
 * @example
 * ```jsx
 * import { useProfiles } from "thirdweb/react";
 *
 * const { data: profiles } = useProfiles({
 *   client,
 * });
 *
 * console.log("Type:", profiles[0].type); // "discord"
 * console.log("Email:", profiles[0].details.email); // "john.doe@example.com"
 * ```
 *
 * @wallet
 */
export function useProfiles(args: {
  client: ThirdwebClient;
}): UseQueryResult<Profile[]> {
  const wallets = useConnectedWallets();
  const enabled =
    wallets.length > 0 &&
    wallets.some((w) => w.id === "inApp" || isEcosystemWallet(w));
  return useQuery({
    enabled,
    queryFn: async () => {
      const ecosystemWallet = wallets.find((w) => isEcosystemWallet(w));
      const ecosystem: Ecosystem | undefined = ecosystemWallet
        ? {
            id: ecosystemWallet.id,
            partnerId: ecosystemWallet.getConfig()?.partnerId,
          }
        : undefined;
      return getProfiles({
        client: args.client,
        ecosystem,
      });
    },
    queryKey: [
      "profiles",
      wallets.map((w) => `${w.id}-${w.getAccount()?.address}`),
    ],
  });
}

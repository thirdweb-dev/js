import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../client/client.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Profile } from "../../../../wallets/in-app/core/authentication/types.js";
import type { Ecosystem } from "../../../../wallets/in-app/core/wallet/types.js";
import { unlinkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import { useConnectedWallets } from "../../../core/hooks/wallets/useConnectedWallets.js";

/**
 * Unlinks a web2 or web3 profile currently connected in-app or ecosystem account.
 * **When a profile is unlinked from the account, it will no longer be able to be used to sign into the account.**
 *
 * @example
 *
 * ### Unlinking an email account
 *
 * ```jsx
 * import { useUnlinkProfile } from "thirdweb/react";
 *
 * const { data: connectedProfiles, isLoading } = useProfiles({
 *   client: props.client,
 * });
 * const { mutate: unlinkProfile } = useUnlinkProfile();
 *
 * const onClick = () => {
 *   unlinkProfile({
 *     client,
 *      // Select any other profile you want to unlink
 *     profileToUnlink: connectedProfiles[1]
 *   });
 * };
 * ```
 *
 * ### Unlinking an email account with account deletion
 *
 * ```jsx
 * import { useUnlinkProfile } from "thirdweb/react";
 *
 * const { mutate: unlinkProfile } = useUnlinkProfile();
 *
 * const onClick = () => {
 *   unlinkProfile({
 *     client,
 *      // Select the profile you want to unlink
 *     profileToUnlink: connectedProfiles[0],
 *     allowAccountDeletion: true, // This will delete the account if it's the last profile linked to the account
 *   });
 * };
 * ```
 *
 * @wallet
 */
export function useUnlinkProfile() {
  const wallets = useConnectedWallets();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      client,
      profileToUnlink,
      allowAccountDeletion = false,
    }: {
      client: ThirdwebClient;
      profileToUnlink: Profile;
      allowAccountDeletion?: boolean;
    }) => {
      const ecosystemWallet = wallets.find((w) => isEcosystemWallet(w));
      const ecosystem: Ecosystem | undefined = ecosystemWallet
        ? {
            id: ecosystemWallet.id,
            partnerId: ecosystemWallet.getConfig()?.partnerId,
          }
        : undefined;

      await unlinkProfile({
        allowAccountDeletion,
        client,
        ecosystem,
        profileToUnlink,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}

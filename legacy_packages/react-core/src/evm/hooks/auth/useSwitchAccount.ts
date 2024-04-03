import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

/**
 * Hook to switch the account of the active wallet
 *
 * @example
 * ```ts
 * const { switchAccount, isLoading } = useSwitchAccount();
 *
 * const handleSwitchAccount = async (address: string) => {
 *  await switchAccount(address);
 * }
 * ```
 *
 * @returns A function to invoke to switch account and a boolean to indicate if it is in progress
 *
 * @auth
 */
export function useSwitchAccount() {
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthContext();

  const switchAccount = useMutation({
    mutationFn: async (address: string) => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(
        authConfig.authUrl,
        "Please specify an authUrl in the authConfig.",
      );

      await fetch(`${authConfig.authUrl}/switch-account`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
        }),
      });

      queryClient.invalidateQueries(cacheKeys.auth.user());
    },
  });

  return {
    switchAccount: switchAccount.mutateAsync,
    isLoading: switchAccount.isLoading,
  };
}

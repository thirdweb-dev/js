import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

/**
 * Hook to logout the connected wallet from the backend.
 * The backend logout URL must be configured on the ThirdwebProvider.
 *
 * @returns  A function to invoke to logout.
 *
 * @see {@link https://portal.thirdweb.com/react/react.uselogout?utm_source=sdk | Documentation}
 *
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthContext();

  const logout = useMutation({
    mutationFn: async () => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(
        authConfig.authUrl,
        "Please specify an authUrl in the authConfig.",
      );

      await fetch(`${authConfig.authUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      authConfig.secureStorage?.removeItem(AUTH_TOKEN_STORAGE_KEY);

      queryClient.invalidateQueries(cacheKeys.auth.user());
    },
  });

  return { logout: logout.mutateAsync, isLoading: logout.isLoading };
}

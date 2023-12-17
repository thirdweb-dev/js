import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import invariant from "tiny-invariant";

/**
 * Hook for signing out of a wallet after a user has logged in using `useLogin`
 *
 * @example
 * ```jsx
 * import { useLogout } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { logout, isLoading } = useLogout();
 *
 *   return (
 *     <button onClick={() => logout()}>
 *       {isLoading ? "Logging out..." : "Logout"}
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns object containing a `logout` function and an `isLoading` state that indicates if the logout request is in progress
 *
 * @auth
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

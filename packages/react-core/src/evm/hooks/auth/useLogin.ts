import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginOptions } from "@thirdweb-dev/auth";
import invariant from "tiny-invariant";

/**
 * Hook to securely login to a backend with the connected wallet. The backend
 * authentication URL must be configured on the ThirdwebProvider.
 *
 * @returns - A function to invoke to login with the connected wallet, and an isLoading state.
 *
 * @beta
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthContext();

  const login = useMutation({
    mutationFn: async (options?: LoginOptions) => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(authConfig.auth, "You need a connected wallet to login.");
      invariant(
        authConfig.authUrl,
        "Please specify an authUrl in the authConfig.",
      );

      const payload = await authConfig.auth.login(options);
      const res = await fetch(`${authConfig.authUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        throw new Error(`Login request failed with status code ${res.status}`);
      }

      queryClient.invalidateQueries(cacheKeys.auth.user());
    },
  });

  return {
    login: (options?: LoginOptions) => login.mutateAsync(options),
    isLoading: login.isLoading,
  };
}

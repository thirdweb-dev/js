import { ensureTWPrefix } from "../../../core/query-utils/query-key";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginOptions } from "@thirdweb-dev/auth";
import invariant from "tiny-invariant";

export interface LoginConfig {
  /**
   * The URL to redirect to on login.
   */
  redirectTo?: string;
  /**
   * Function to run on error.
   */
  onError?: (error: string) => void;
}

/**
 * Hook to securely login to a backend with the connected wallet. The backend
 * authentication URL must be configured on the ThirdwebProvider.
 *
 * @param config - Configuration for the login.
 * @returns - A function to invoke to login with the connected wallet.
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

      queryClient.invalidateQueries(ensureTWPrefix(["user"]));
    },
  });

  return {
    login: (options?: LoginOptions) => login.mutateAsync(options),
    isLoading: login.isLoading,
  };
}

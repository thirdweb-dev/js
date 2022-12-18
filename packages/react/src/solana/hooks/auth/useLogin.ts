import { ensureTWPrefix } from "../../../core/query-utils/query-key";
import { useThirdwebAuthConfig } from "../../contexts/thirdweb-auth";
import { useSDK } from "../../providers/base";
import { useQueryClient } from "@tanstack/react-query";
import { LoginOptions } from "@thirdweb-dev/sdk/solana";
import React from "react";
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
export function useLogin(config?: LoginConfig) {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthConfig();

  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get("error");

    if (error && config?.onError) {
      // If there is an error, parse it and trigger the onError callback
      config.onError(decodeURI(error));
    }
  }, [config]);

  async function login(cfg?: LoginOptions) {
    invariant(
      authConfig,
      "Please specify an authConfig in the ThirdwebProvider",
    );
    const payload = await sdk?.auth.login(authConfig.domain, cfg);

    const encodedPayload = encodeURIComponent(btoa(JSON.stringify(payload)));
    const encodedRedirectTo = encodeURIComponent(
      config?.redirectTo ||
        authConfig.loginRedirect ||
        window.location.toString(),
    );

    queryClient.invalidateQueries(ensureTWPrefix(["user"]));

    // Redirect to the login URL with the encoded payload
    window.location.href = `${authConfig.authUrl}/login?payload=${encodedPayload}&redirect=${encodedRedirectTo}`;
  }

  return login;
}

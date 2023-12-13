import { useWallet } from "../../../core/hooks/wallet-hooks";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signLoginPayload, type LoginPayloadData } from "@thirdweb-dev/auth";
import invariant from "tiny-invariant";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";

/**
 * Hook to securely login to a backend with the connected wallet. The backend
 * authentication URL must be configured on the ThirdwebProvider.
 *
 * @returns - A function to invoke to login with the connected wallet, and an isLoading state.
 *
 * @see {@link https://portal.thirdweb.com/react/react.uselogin?utm_source=sdk | Documentation}
 *
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const authConfig = useThirdwebAuthContext();
  const wallet = useWallet();

  const login = useMutation({
    mutationFn: async () => {
      invariant(
        authConfig,
        "Please specify an authConfig in the ThirdwebProvider",
      );
      invariant(wallet, "You need a connected wallet to login.");
      invariant(
        authConfig.authUrl,
        "Please specify an authUrl in the authConfig.",
      );

      const address = await wallet.getAddress();
      const chainId = await wallet.getChainId();
      let res = await fetch(`${authConfig.authUrl}/payload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, chainId: chainId.toString() }),
      });

      if (!res.ok) {
        throw new Error(`Failed to get payload with status code ${res.status}`);
      }

      let payloadData: LoginPayloadData;
      try {
        ({ payload: payloadData } = await res.json());
      } catch {
        throw new Error(`Failed to get payload`);
      }

      const payload = await signLoginPayload({ wallet, payload: payloadData });

      res = await fetch(`${authConfig.authUrl}/login`, {
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

      const { token } = await res.json();
      await authConfig.secureStorage?.setItem(AUTH_TOKEN_STORAGE_KEY, token);

      queryClient.invalidateQueries(cacheKeys.auth.user());

      return token;
    },
  });

  return {
    login: () => login.mutateAsync(),
    isLoading: login.isLoading,
  };
}

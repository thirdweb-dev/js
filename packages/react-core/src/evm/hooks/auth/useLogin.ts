import { useWallet } from "../../../core/hooks/wallet-hooks";
import { useThirdwebAuthContext } from "../../contexts/thirdweb-auth";
import { cacheKeys } from "../../utils/cache-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signLoginPayload, type LoginPayloadData } from "@thirdweb-dev/auth";
import invariant from "tiny-invariant";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../core/constants/auth";

/**
 * Hook to prompt the user to sign in with their wallet using [auth](https://portal.thirdweb.com/auth)
 *
 * Requires the `authConfig` prop to be configured on the `ThirdwebProvider`
 *
 * @example
 *
 * ```jsx
 * import { useLogin } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { isLoading, login } = useLogin();
 *
 *   return (
 *     <button onClick={() => login()}>
 *       {isLoading ? "Loading..." : "Sign in with Ethereum"}
 *     </button>
 *   );
 * }
 * ```
 *
 * @returns  A function to invoke to login with the connected wallet, and an `isLoading` state that indicates if the login request is in progress
 *
 * ### login
 *
 * The `login` function accepts an optional `LoginOptions` object as an argument.
 *
 * This configuration follows the [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361) Sign in with Ethereum standard.
 *
 * ```jsx
 * import { useLogin, Web3Button } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const { login, isLoading } = useLogin();
 *
 *   const loginOptions = {
 *     // highlight-start
 *     domain: "https://your-domain.com", // Your dapp domain
 *     statement: "My statement", // Text that the user will sign
 *     uri: "https://your-domain.com/login", // RFC 3986 URI referring to the resource that is the subject of the signing
 *     version: "1.0", // The current version of the message, which MUST be 1 for this specification.
 *     chainId: "mainnet", // Chain ID to which the session is bound
 *     nonce: "my-nonce", // randomized token typically used to prevent replay attacks
 *     expirationTime: new Date(2021, 1, 1), // When this message expires
 *     invalidBefore: new Date(2020, 12, 1), // When this message becomes valid
 *     resources: ["balance", "history", "info"], // A list of information or references to information the user wishes to have resolved
 *     // highlight-end
 *   };
 *
 *   return <Web3Button action={() => login(loginOptions)}>Login</Web3Button>;
 * }
 * ```
 *
 * @auth
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

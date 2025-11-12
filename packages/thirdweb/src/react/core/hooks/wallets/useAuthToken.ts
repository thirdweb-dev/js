import type {
  EcosystemWallet,
  InAppWallet,
} from "../../../../wallets/in-app/core/wallet/types.js";
import { useConnectedWallets } from "./useConnectedWallets.js";

/**
 * A hook that returns the authentication token (JWT) for the currently active wallet.
 * This token can be used to authorize API calls to your backend server.
 *
 * @returns The JWT string if the active wallet is an in-app wallet and matches the active account, null otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const authToken = useAuthToken();
 *
 *   const fetchData = async () => {
 *     const response = await fetch('https://api.example.com/data', {
 *       headers: {
 *         'Authorization': `Bearer ${authToken}`
 *       }
 *     });
 *     // ... handle response
 *   };
 * }
 * ```
 *
 * @wallet
 */
export function useAuthToken() {
  const walletWithAuthToken = useWalletWithAuthToken();
  // if any connected wallet has an auth token, return it
  if (walletWithAuthToken) {
    return walletWithAuthToken.getAuthToken();
  }
  // no wallet with an auth token found
  return null;
}

function useWalletWithAuthToken(): InAppWallet | EcosystemWallet | undefined {
  const wallets = useConnectedWallets();
  const wallet = wallets.find((w) => !!w.getAuthToken) as
    | InAppWallet
    | EcosystemWallet
    | undefined;
  return wallet ?? undefined;
}

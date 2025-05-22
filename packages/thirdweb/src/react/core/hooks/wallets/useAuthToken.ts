import { useActiveAccount } from "./useActiveAccount.js";
import { useActiveWallet } from "./useActiveWallet.js";

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
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  // if the active wallet is an in-app wallet and the active account is the same as the active wallet's account, return the auth token for the in-app wallet
  if (
    activeWallet?.getAuthToken &&
    activeAccount &&
    activeAccount.address === activeWallet.getAccount()?.address
  ) {
    return activeWallet.getAuthToken();
  }
  // all other wallets don't expose an auth token for now
  return null;
}

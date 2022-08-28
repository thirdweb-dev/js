import { useAccount } from "wagmi";

/**
 * Hook for accessing the address of the connected wallet
 *
 * ```javascript
 * import { useAddress } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * To get the address of the connected wallet, you can use the hook as follows:
 *
 * ```javascript
 * import { useAddress } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const address = useAddress()
 *
 *   return <div>{address}</div>
 * }
 * ```
 *
 * The `address` variable will hold the address of the connected wallet if a user has connected using one of the supported wallet connection hooks.
 *
 * @public
 */
export function useAddress(): string | undefined {
  const [account] = useAccount();
  return account.data?.address;
}

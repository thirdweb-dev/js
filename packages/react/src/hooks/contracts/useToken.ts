import { useBuiltinContract } from "./useBuiltinContract";

/**
 * Hook for getting an instance of a `Token` contract. This contract supports ERC20 compliant tokens.
 * @param contractAddress - the address of the Token contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useToken } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const token = useToken("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the token contract in the rest of the component
 *
 *   // For example, this function will get the connected wallets token balance
 *   async function balance() {
 *     const balance = await token.balance()
 *     return balance
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @depreated use `useContract()` instead
 */
export function useToken(contractAddress?: string) {
  return useBuiltinContract("token", contractAddress);
}

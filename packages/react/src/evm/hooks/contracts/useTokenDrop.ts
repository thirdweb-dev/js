import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";
import { TokenDrop } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/token-drop";

/**
 * Hook for getting an instance of a `Token Drop` contract.
 * @param contractAddress - the address of the Token Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useTokenDrop } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const tokenDrop = useTokenDrop("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the token drop contract in the rest of the component
 *
 *   // For example, this function will get the connected wallets token balance
 *   async function balance() {
 *     const balance = await tokenDrop.balance()
 *     return balance
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated use `useContract()` instead
 */
export function useTokenDrop(contractAddress?: string) {
  showDeprecationWarning("useTokenDrop()", "useContract<TokenDrop>()");
  return useContract<TokenDrop>(contractAddress).contract;
}

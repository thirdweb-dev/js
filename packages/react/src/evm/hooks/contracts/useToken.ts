import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

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
 * @deprecated use `useContract()` instead
 */
export function useToken(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(`useToken("0x...")`, `useContract("0x...", "token")`);
  return useContract(contractAddress, "token").contract;
}

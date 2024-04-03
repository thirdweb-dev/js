import { RequiredParam } from "../../../core/query-utils/required-param";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of a `Marketplace` contract. This contract is used to support marketplace for purchase and sale of on-chain assets.
 * @param contractAddress - The address of the Marketplace contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useContract } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const { contract } = useContract("<YOUR-CONTRACT-ADDRESS>", "marketplace")
 *
 *   // Now you can use the marketplace contract in the rest of the component
 *
 *   // For example, this function will return all the listings on the marketplace
 *   async function getListings() {
 *     const listings = await contract.getAll()
 *     return listings
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const marketplace = useMarketplace("0x1234...");
 * + const marketplace = useContract("0x1234...", "marketplace").contract;
 * ```
 * @internal
 */
export function useMarketplace(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useMarketplace("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "marketplace")`,
  );
  return useContract(contractAddress, "marketplace").contract;
}

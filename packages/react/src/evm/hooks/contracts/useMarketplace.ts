import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of a `Marketplace` contract. This contract is used to support marketplace for purchase and sale of on-chain assets.
 * @param contractAddress - the address of the Marketplace contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useMarketplace } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const marketplace = useMarketplace("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the marketplace contract in the rest of the component
 *
 *   // For example, this function will return all the listings on the marketplace
 *   async function getListings() {
 *     const listings = await marketplace.getAll()
 *     return listings
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated use `useContract()` instead
 */
export function useMarketplace(contractAddress?: RequiredParam<string>) {
  showDeprecationWarning(
    `useMarketplace("0x...")`,
    `useContract("0x...", "marketplace")`,
  );
  return useContract(contractAddress, "marketplace").contract;
}

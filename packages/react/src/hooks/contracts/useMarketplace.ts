import { useBuiltinContract } from "./useBuiltinContract";
import { Marketplace } from "@thirdweb-dev/sdk";

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
 */
export function useMarketplace(
  contractAddress?: string,
): Marketplace | undefined {
  return useBuiltinContract("marketplace", contractAddress);
}

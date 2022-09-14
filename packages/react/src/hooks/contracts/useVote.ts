import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";
import { VoteImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/prebuilt-implementations/vote";

/**
 * Hook for getting an instance of an `Vote` contract. This contract enables fully featured voting-based decentralized governance systems.
 * @param contractAddress - the address of the Vote contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useVote } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const vote = useVote("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the vote contract in the rest of the component
 *
 *   // For example, this function will get all the proposals on this contract
 *   async function getProposals() {
 *     const proposals = await vote.getAll()
 *     return proposals
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @depreated use `useContract()` instead
 */
export function useVote(contractAddress?: string) {
  showDeprecationWarning("useVote()", "useContract<Vote>()");
  return useContract<VoteImpl>(contractAddress).contract;
}

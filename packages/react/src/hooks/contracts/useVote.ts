import { useBuiltinContract } from "./useBuiltinContract";
import { Vote } from "@thirdweb-dev/sdk";

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
 */
export function useVote(contractAddress?: string): Vote | undefined {
  return useBuiltinContract("vote", contractAddress);
}

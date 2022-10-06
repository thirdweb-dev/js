import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

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
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const vote = await sdk.useVote("0x1234...");
 * + const vote = await sdk.useContract("0x1234...", "vote").contract;
 * ```
 */
export function useVote(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useVote("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "vote")`,
  );
  return useContract(contractAddress, "vote").contract;
}

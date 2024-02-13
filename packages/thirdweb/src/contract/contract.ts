import type { Abi } from "abitype";
import type { ThirdwebClient } from "../client/client.js";
import type { Chain } from "../chain/index.js";

export type ContractOptions<abi extends Abi = []> = {
  client: ThirdwebClient;
  address: string;
  chain: Chain;
  readonly abi?: abi;
};

export type ThirdwebContract<abi extends Abi = []> = Readonly<
  ContractOptions<abi>
>;

/**
 * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
 * @param options - The options for creating the contract.
 * @returns The Thirdweb contract.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * const client = createThirdwebClient({ clientId: "..." });
 * const contract = getContract({
 *  client,
 *  address: "...",
 *  // optional ABI
 *  abi: [...],
 * });
 * ```
 */
export function getContract<const abi extends Abi = []>(
  options: ContractOptions<abi>,
): ThirdwebContract<abi> {
  return options;
}

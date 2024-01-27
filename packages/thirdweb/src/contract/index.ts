import type { Abi } from "abitype";
import type { ThirdwebClient } from "../client/client.js";

export type ContractOptions<abi extends Abi = []> = {
  client: ThirdwebClient;
  address: string;
  chainId: number;
  readonly abi?: abi;
};

export type ThirdwebContract<abi extends Abi = []> = ThirdwebClient & {
  readonly address: string;
  readonly chainId: number;
  readonly abi?: abi;
};

/**
 * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
 * @param client - The Thirdweb client.
 * @param options - The contract options.
 * @returns The Thirdweb contract.
 */
export function contract<const abi extends Abi = []>(
  options: ContractOptions<abi>,
): ThirdwebContract<abi> {
  const { client, ...rest } = options;
  return { ...client, ...rest } as const;
}

export { resolveContractAbi } from "./actions/resolve-abi.js";

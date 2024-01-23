import type { ThirdwebClient } from "../client/client.js";

export type ContractOptions = {
  address: string;
  chainId: number;
};

export type ThirdwebContract = ThirdwebClient & {
  address: Readonly<string>;
  chainId: Readonly<number>;
};

/**
 * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
 * @param client - The Thirdweb client.
 * @param options - The contract options.
 * @returns The Thirdweb contract.
 */
export function contract(
  client: ThirdwebClient,
  options: ContractOptions,
): ThirdwebContract {
  return { ...client, ...options } as const;
}

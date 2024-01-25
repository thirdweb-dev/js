import type { ThirdwebClient } from "../client/client.js";

export type ContractOptions = {
  client: ThirdwebClient;
  address: string;
  chainId: number;
};

export type ThirdwebContract = ThirdwebClient & {
  readonly address: string;
  readonly chainId: number;
};

/**
 * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
 * @param client - The Thirdweb client.
 * @param options - The contract options.
 * @returns The Thirdweb contract.
 */
export function contract(options: ContractOptions): ThirdwebContract {
  const { client, ...rest } = options;
  return { ...client, ...rest } as const;
}

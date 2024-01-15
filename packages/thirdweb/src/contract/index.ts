import type { ThirdwebClient } from "../client/client.js";

export type GetContractOptions = {
  address: string;
  chainId: number;
};

export type ThirdwebContract = ThirdwebClient & {
  address: Readonly<string>;
  chainId: Readonly<number>;
};

export function getContract(
  client: ThirdwebClient,
  options: GetContractOptions,
) {
  return { ...client, ...options } as const;
}

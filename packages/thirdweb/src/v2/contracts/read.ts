import { readContract } from "@thirdweb-dev/engine";
import type { ContractCall } from "./types.js";

export type ReadOptions = {
  contractAddress: string;
  chainId: number;
  calls: ContractCall[];
};

/**
 * Read from a contract
 * @param options - Options including the contract address, chain id, and calls
 * @returns Promise that resolves to the result
 * @example
 * ```typescript
 * const result = await Contracts.read({
 *   contractAddress: "0x...",
 *   chainId: 1,
 *   calls: [{ method: "function balanceOf(address)", params: ["0x..."] }],
 * });
 * ```
 */
export async function read(options: ReadOptions) {
  const result = await readContract({
    body: {
      readOptions: {
        chainId: options.chainId.toString(),
      },
      params: options.calls.map((call) => ({
        contractAddress: call.contractAddress,
        method: call.method,
        params: call.params,
        value: call.value,
      })),
    },
  });
  if (result.error) {
    throw new Error(
      `Failed to write contract: ${result.response.status} - ${result.error}`,
    );
  }
  return result.data?.result;
}

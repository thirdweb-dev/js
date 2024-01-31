import { type Abi } from "abitype";
import type { ThirdwebContract } from "../index.js";
import type { Hex } from "viem";
import { getRpcClient, eth_getCode } from "../../rpc/index.js";

const BYTECODE_CACHE = new WeakMap<ThirdwebContract<Abi>, Promise<Hex>>();

/**
 * Retrieves the bytecode of a contract.
 * @param contract - The ThirdwebContract instance.
 * @returns A Promise that resolves to the bytecode of the contract.
 * @example
 * ```ts
 * import { getByteCode } from "thirdweb/contract";
 * const bytecode = await getByteCode(contract);
 * ```
 */
export function getByteCode<abi extends Abi>(
  contract: ThirdwebContract<abi>,
): Promise<Hex> {
  if (BYTECODE_CACHE.has(contract)) {
    return BYTECODE_CACHE.get(contract) as Promise<Hex>;
  }

  const prom = (async () => {
    const rpcRequest = getRpcClient(contract);
    return eth_getCode(rpcRequest, {
      address: contract.address,
      blockTag: "latest",
    });
  })();
  BYTECODE_CACHE.set(contract, prom);
  return prom;
}

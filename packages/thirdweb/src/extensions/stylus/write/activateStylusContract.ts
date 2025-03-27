import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { activateProgram } from "../__generated__/IArbWasm/write/activateProgram.js";

const ARB_WASM_ADDRESS = "0000000000000000000000000000000000000071";

export type ActivateStylusContractOptions = {
  chain: Chain;
  client: ThirdwebClient;
  contractAddress: string;
};

/**
 * Activate a stylus contract by calling ArbWasm Precompile
 * @param options - The options for activating the contract
 * @returns A prepared transaction to send
 * @example
 * ```ts
 * import { activateStylusContract } from "thirdweb/stylus";
 * const transaction = activateStylusContract({
 *  client,
 *  chain,
 *  contractAddress,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 */
export function activateStylusContract(options: ActivateStylusContractOptions) {
  const { chain, client, contractAddress } = options;
  const arbWasmPrecompile = getContract({
    client,
    chain,
    address: ARB_WASM_ADDRESS,
  });

  return activateProgram({
    program: contractAddress,
    contract: arbWasmPrecompile,
  });
}

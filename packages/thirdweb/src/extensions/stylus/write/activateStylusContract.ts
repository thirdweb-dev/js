import {
  decodeAbiParameters,
  formatTransactionRequest,
  parseEther,
} from "viem";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { eth_call } from "../../../rpc/actions/eth_call.js";
import { getRpcClient } from "../../../rpc/rpc.js";
import { encode } from "../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { activateProgram } from "../__generated__/IArbWasm/write/activateProgram.js";

const ARB_WASM_ADDRESS = "0x0000000000000000000000000000000000000071";

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
export async function activateStylusContract(
  options: ActivateStylusContractOptions,
) {
  const { chain, client, contractAddress } = options;
  const arbWasmPrecompile = getContract({
    client,
    chain,
    address: ARB_WASM_ADDRESS,
  });

  const dataFee = await estimateDataFee({
    transaction: activateProgram({
      program: contractAddress,
      contract: arbWasmPrecompile,
    }),
  });

  return activateProgram({
    program: contractAddress,
    contract: arbWasmPrecompile,
    overrides: {
      value: dataFee,
    },
  });
}

async function estimateDataFee(options: {
  // biome-ignore lint/suspicious/noExplicitAny:
  transaction: PreparedTransaction<any>;
}) {
  const data = await encode(options.transaction);

  const serializedTx = formatTransactionRequest({
    data,
    to: ARB_WASM_ADDRESS,
    value: parseEther("1"), // only for simulation. it will be replaced with estimated data fee.
  });

  const rpcRequest = getRpcClient(options.transaction);
  try {
    const result = await eth_call(rpcRequest, serializedTx);
    const [, dataFee] = decodeAbiParameters(
      [
        {
          type: "uint16",
        },
        {
          type: "uint256",
        },
      ],
      result,
    );

    return (dataFee * BigInt(100 + 10)) / BigInt(100); // bump 10%
  } catch {
    return 0n;
  }
}

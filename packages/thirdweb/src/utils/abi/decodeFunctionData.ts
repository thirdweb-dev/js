import type * as ox__Abi from "ox/Abi";
import * as ox__AbiFunction from "ox/AbiFunction";
import type * as ox__Hex from "ox/Hex";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";

/**
 * Decodes the data of a function call.
 * @param options - The options object.
 * @returns The decoded data.
 * @example
 * ```ts
 * import { decodeFunctionData } from "thirdweb/utils";
 *
 * const data = "0x...";
 * const decodedData = await decodeFunctionData({ contract, data });
 * ```
 *
 * @utils
 */
export async function decodeFunctionData<abi extends ox__Abi.Abi>(options: {
  contract: ThirdwebContract<abi>;
  data: ox__Hex.Hex;
}) {
  const { contract, data } = options;
  let abi = contract?.abi;
  if (contract && !abi) {
    abi = await resolveContractAbi(contract).catch(() => undefined);
  }
  if (!abi) {
    throw new Error(
      `No ABI found for contract ${contract.address} on chain ${contract.chain.id}`,
    );
  }
  const abiFunction = ox__AbiFunction.fromAbi(abi, data);
  return ox__AbiFunction.decodeData(abiFunction, data);
}

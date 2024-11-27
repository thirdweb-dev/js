import { type Abi, AbiFunction, type Hex } from "ox";
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
export async function decodeFunctionData<abi extends Abi.Abi>(options: {
  contract: ThirdwebContract<abi>;
  data: Hex.Hex;
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
  const abiFunction = AbiFunction.fromAbi(abi, data);
  return AbiFunction.decodeData(abiFunction, data);
}

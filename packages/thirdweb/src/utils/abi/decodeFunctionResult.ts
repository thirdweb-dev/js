import { type Abi, AbiFunction, type Hex } from "ox";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";

/**
 * Decodes the result of a function call.
 * @param options - The options object.
 * @returns The decoded result.
 * @example
 * ```ts
 * import { decodeFunctionResult } from "thirdweb/utils";
 *
 * const data = "0x...";
 * const result = await decodeFunctionResult({ contract, data });
 * ```
 *
 * @utils
 */
export async function decodeFunctionResult<abi extends Abi.Abi>(options: {
  contract: ThirdwebContract<abi>;
  data: Hex.Hex;
}) {
  const { contract, ...rest } = options;
  let abi = contract?.abi;
  if (contract && !abi) {
    abi = await resolveContractAbi(contract).catch(() => undefined);
  }
  if (!abi) {
    throw new Error(
      `No ABI found for contract ${contract.address} on chain ${contract.chain.id}`,
    );
  }
  const abiFunction = AbiFunction.fromAbi(abi, rest.data);
  return AbiFunction.decodeResult(abiFunction, rest.data);
}

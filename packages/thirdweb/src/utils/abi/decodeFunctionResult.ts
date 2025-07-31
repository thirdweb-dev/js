import type * as ox__Abi from "ox/Abi";
import * as ox__AbiFunction from "ox/AbiFunction";
import type * as ox__Hex from "ox/Hex";
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
export async function decodeFunctionResult<abi extends ox__Abi.Abi>(options: {
  contract: ThirdwebContract<abi>;
  data: ox__Hex.Hex;
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
  const fn = abi.filter(
    (i) =>
      i.type === "function" &&
      ox__AbiFunction.getSelector(i) === rest.data.slice(0, 10),
  );
  const abiFunction = fn[0] as ox__AbiFunction.AbiFunction;
  if (!abiFunction) {
    throw new Error(
      `No ABI function found for selector ${rest.data.slice(0, 10)}`,
    );
  }
  return ox__AbiFunction.decodeResult(abiFunction, rest.data);
}

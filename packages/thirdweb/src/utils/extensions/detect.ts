import type { AbiFunction } from "abitype";
import { getByteCode, type ThirdwebContract } from "../../contract/index.js";
import { getFunctionSelector } from "../../abi/lib/getFunctionSelector.js";

export type DetectExtensionOptions = {
  contract: ThirdwebContract;
  method: string | AbiFunction;
};

/**
 * Detects if the specified method is present in the contract bytecode.
 * @param options - The options for detecting the extension.
 * @returns A promise that resolves to a boolean indicating if the extension is detected.
 * @example
 * ```ts
 * import { detectMethod } from "thirdweb/utils/extensions/detect.js";
 * const hasDecimals = await detectMethod({
 *  contract,
 *  method: "function decimals() view returns (uint8)",
 * });
 * @internal
 */
export async function detectMethod(
  options: DetectExtensionOptions,
): Promise<boolean> {
  const bytecode = await getByteCode(options.contract);
  // if we can't get the bytecode we know the contract is not deployed
  if (bytecode === "0x") {
    return false;
  }
  // we strip the leading `0x` from the function selector
  const fnSelector = getFunctionSelector(options.method).slice(2);
  // indexOf is slightly faster than includes
  return bytecode.indexOf(fnSelector) > -1;
}

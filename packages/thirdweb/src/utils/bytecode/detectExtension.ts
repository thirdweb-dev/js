import type { AbiFunction } from "abitype";
import type { ThirdwebContract } from "../../contract/contract.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";
import { toFunctionSelector } from "viem";
import type { PreparedMethod } from "../abi/prepare-method.js";

type DetectExtensionOptions = {
  contract: ThirdwebContract;
  method: string | AbiFunction | PreparedMethod<AbiFunction>;
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
  const bytecode = await getBytecode(options.contract);
  return detectMethodInBytecode({ bytecode, method: options.method });
}

type DetectExtensionInBytecodeOptions = {
  bytecode: string;
  method: string | AbiFunction | PreparedMethod<AbiFunction>;
};
/**
 * Detects if a specific method is present in the bytecode of a contract.
 * @param options - The options for detecting the method in the bytecode.
 * @returns A boolean indicating whether the method is present in the bytecode.
 * @internal
 */
function detectMethodInBytecode(options: DetectExtensionInBytecodeOptions) {
  // if we can't get the bytecode we know the contract is not deployed
  if (options.bytecode === "0x") {
    return false;
  }
  // we strip the leading `0x` from the function selector
  const fnSelector = Array.isArray(options.method)
    ? options.method[0]
    : toFunctionSelector(options.method).slice(2);
  // indexOf is slightly faster than includes
  return options.bytecode.indexOf(fnSelector) > -1;
}

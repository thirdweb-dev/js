import type { AbiFunction } from "abitype";
import { toFunctionSelector } from "viem";
import type { PreparedMethod } from "../abi/prepare-method.js";

type DetectExtensionOptions = {
  method: string | AbiFunction | PreparedMethod<AbiFunction>;
  availableSelectors: string[];
};

/**
 * Detects if the specified method is present in the contract bytecode.
 * @param options - The options for detecting the extension.
 * @returns A promise that resolves to a boolean indicating if the extension is detected.
 * @example
 * ```ts
 * import { detectMethod } from "thirdweb/utils/extensions/detect.js";
 * const hasDecimals = await detectMethod({
 *  method: "function decimals() view returns (uint8)",
 *  availableSelectors: ["0x313ce567"],
 * });
 * ```
 * @contract
 */
export function detectMethod(options: DetectExtensionOptions): boolean {
  const fnSelector = Array.isArray(options.method)
    ? options.method[0]
    : toFunctionSelector(options.method);

  return options.availableSelectors.includes(fnSelector);
}

import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { hexToString } from "../../../utils/encoding/hex.js";
import * as ContractTypeGenerated from "../__generated__/IThirdwebContract/read/contractType.js";

/**
 * Checks if the `contractType` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `contractType` method is supported.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { isContractTypeSupported } from "thirdweb/extensions/thirdweb";
 *
 * const supported = isContractTypeSupported(["0x..."]);
 * ```
 */
export function isContractTypeSupported(availableSelectors: string[]) {
  return ContractTypeGenerated.isContractTypeSupported(availableSelectors);
}

/**
 * Calls the "contractType" function on the contract.
 * @param options - The options for the contractType function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { contractType } from "thirdweb/extensions/thirdweb";
 *
 * const result = await contractType({
 *  contract,
 * });
 *
 * ```
 */
export async function contractType(options: BaseTransactionOptions) {
  try {
    const rawContractType = await ContractTypeGenerated.contractType(options);
    const utf8 = hexToString(rawContractType);
    // biome-ignore lint/suspicious/noControlCharactersInRegex: required here
    return utf8.replace(/\x00/g, "") || "custom";
  } catch {
    // backwards compat, if this fails for any reason we assume it's a custom contract
    return "custom";
  }
}

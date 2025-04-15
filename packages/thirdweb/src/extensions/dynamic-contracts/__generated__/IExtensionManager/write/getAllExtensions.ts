import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";

import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

export const FN_SELECTOR = "0x4a00cc48" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    components: [
      {
        type: "tuple",
        name: "metadata",
        components: [
          {
            type: "string",
            name: "name",
          },
          {
            type: "string",
            name: "metadataURI",
          },
          {
            type: "address",
            name: "implementation",
          },
        ],
      },
      {
        type: "tuple[]",
        name: "functions",
        components: [
          {
            type: "bytes4",
            name: "functionSelector",
          },
          {
            type: "string",
            name: "functionSignature",
          },
        ],
      },
    ],
  },
] as const;

/**
 * Checks if the `getAllExtensions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getAllExtensions` method is supported.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { isGetAllExtensionsSupported } from "thirdweb/extensions/dynamic-contracts";
 *
 * const supported = isGetAllExtensionsSupported(["0x..."]);
 * ```
 */
export function isGetAllExtensionsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Prepares a transaction to call the "getAllExtensions" function on the contract.
 * @param options - The options for the "getAllExtensions" function.
 * @returns A prepared transaction object.
 * @extension DYNAMIC-CONTRACTS
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { getAllExtensions } from "thirdweb/extensions/dynamic-contracts";
 *
 * const transaction = getAllExtensions();
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function getAllExtensions(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

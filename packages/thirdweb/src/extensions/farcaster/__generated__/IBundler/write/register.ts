import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "register" function.
 */

type RegisterParamsInternal = {
  registerParams: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "registerParams";
    components: [
      { type: "address"; name: "to" },
      { type: "address"; name: "recovery" },
      { type: "uint256"; name: "deadline" },
      { type: "bytes"; name: "sig" },
    ];
  }>;
  signerParams: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "signerParams";
    components: [
      { type: "uint32"; name: "keyType" },
      { type: "bytes"; name: "key" },
      { type: "uint8"; name: "metadataType" },
      { type: "bytes"; name: "metadata" },
      { type: "uint256"; name: "deadline" },
      { type: "bytes"; name: "sig" },
    ];
  }>;
  extraStorage: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "extraStorage";
  }>;
};

export type RegisterParams = Prettify<
  | RegisterParamsInternal
  | {
      asyncParams: () => Promise<RegisterParamsInternal>;
    }
>;
const METHOD = [
  "0xa44c9ce7",
  [
    {
      type: "tuple",
      name: "registerParams",
      components: [
        {
          type: "address",
          name: "to",
        },
        {
          type: "address",
          name: "recovery",
        },
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "bytes",
          name: "sig",
        },
      ],
    },
    {
      type: "tuple[]",
      name: "signerParams",
      components: [
        {
          type: "uint32",
          name: "keyType",
        },
        {
          type: "bytes",
          name: "key",
        },
        {
          type: "uint8",
          name: "metadataType",
        },
        {
          type: "bytes",
          name: "metadata",
        },
        {
          type: "uint256",
          name: "deadline",
        },
        {
          type: "bytes",
          name: "sig",
        },
      ],
    },
    {
      type: "uint256",
      name: "extraStorage",
    },
  ],
  [
    {
      type: "uint256",
      name: "fid",
    },
  ],
] as const;

/**
 * Calls the "register" function on the contract.
 * @param options - The options for the "register" function.
 * @returns A prepared transaction object.
 * @extension FARCASTER
 * @example
 * ```
 * import { register } from "thirdweb/extensions/farcaster";
 *
 * const transaction = register({
 *  registerParams: ...,
 *  signerParams: ...,
 *  extraStorage: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function register(options: BaseTransactionOptions<RegisterParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.registerParams,
              resolvedParams.signerParams,
              resolvedParams.extraStorage,
            ] as const;
          }
        : [options.registerParams, options.signerParams, options.extraStorage],
  });
}

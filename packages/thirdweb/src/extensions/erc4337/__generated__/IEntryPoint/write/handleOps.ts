import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "handleOps" function.
 */

type HandleOpsParamsInternal = {
  ops: AbiParameterToPrimitiveType<{
    type: "tuple[]";
    name: "ops";
    components: [
      { type: "address"; name: "sender" },
      { type: "uint256"; name: "nonce" },
      { type: "bytes"; name: "initCode" },
      { type: "bytes"; name: "callData" },
      { type: "uint256"; name: "callGasLimit" },
      { type: "uint256"; name: "verificationGasLimit" },
      { type: "uint256"; name: "preVerificationGas" },
      { type: "uint256"; name: "maxFeePerGas" },
      { type: "uint256"; name: "maxPriorityFeePerGas" },
      { type: "bytes"; name: "paymasterAndData" },
      { type: "bytes"; name: "signature" },
    ];
  }>;
  beneficiary: AbiParameterToPrimitiveType<{
    type: "address";
    name: "beneficiary";
  }>;
};

export type HandleOpsParams = Prettify<
  | HandleOpsParamsInternal
  | {
      asyncParams: () => Promise<HandleOpsParamsInternal>;
    }
>;
const FN_SELECTOR = "0x1fad948c" as const;
const FN_INPUTS = [
  {
    type: "tuple[]",
    name: "ops",
    components: [
      {
        type: "address",
        name: "sender",
      },
      {
        type: "uint256",
        name: "nonce",
      },
      {
        type: "bytes",
        name: "initCode",
      },
      {
        type: "bytes",
        name: "callData",
      },
      {
        type: "uint256",
        name: "callGasLimit",
      },
      {
        type: "uint256",
        name: "verificationGasLimit",
      },
      {
        type: "uint256",
        name: "preVerificationGas",
      },
      {
        type: "uint256",
        name: "maxFeePerGas",
      },
      {
        type: "uint256",
        name: "maxPriorityFeePerGas",
      },
      {
        type: "bytes",
        name: "paymasterAndData",
      },
      {
        type: "bytes",
        name: "signature",
      },
    ],
  },
  {
    type: "address",
    name: "beneficiary",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "handleOps" function.
 * @param options - The options for the handleOps function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```
 * import { encodeHandleOpsParams } "thirdweb/extensions/erc4337";
 * const result = encodeHandleOpsParams({
 *  ops: ...,
 *  beneficiary: ...,
 * });
 * ```
 */
export function encodeHandleOpsParams(options: HandleOpsParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.ops, options.beneficiary]);
}

/**
 * Calls the "handleOps" function on the contract.
 * @param options - The options for the "handleOps" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { handleOps } from "thirdweb/extensions/erc4337";
 *
 * const transaction = handleOps({
 *  ops: ...,
 *  beneficiary: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function handleOps(options: BaseTransactionOptions<HandleOpsParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.ops, resolvedParams.beneficiary] as const;
          }
        : [options.ops, options.beneficiary],
  });
}

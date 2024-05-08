import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "openPack" function.
 */
export type OpenPackParams = WithOverrides<{
  packId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "packId" }>;
  amountToOpen: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "amountToOpen";
  }>;
}>;

export const FN_SELECTOR = "0x914e126a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "packId",
  },
  {
    type: "uint256",
    name: "amountToOpen",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    components: [
      {
        type: "address",
        name: "assetContract",
      },
      {
        type: "uint8",
        name: "tokenType",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "uint256",
        name: "totalAmount",
      },
    ],
  },
] as const;

/**
 * Checks if the `openPack` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `openPack` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isOpenPackSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isOpenPackSupported(contract);
 * ```
 */
export async function isOpenPackSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "openPack" function.
 * @param options - The options for the openPack function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOpenPackParams } "thirdweb/extensions/erc1155";
 * const result = encodeOpenPackParams({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 * ```
 */
export function encodeOpenPackParams(options: OpenPackParams) {
  return encodeAbiParameters(FN_INPUTS, [options.packId, options.amountToOpen]);
}

/**
 * Encodes the "openPack" function into a Hex string with its parameters.
 * @param options - The options for the openPack function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeOpenPack } "thirdweb/extensions/erc1155";
 * const result = encodeOpenPack({
 *  packId: ...,
 *  amountToOpen: ...,
 * });
 * ```
 */
export function encodeOpenPack(options: OpenPackParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeOpenPackParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "openPack" function on the contract.
 * @param options - The options for the "openPack" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { openPack } from "thirdweb/extensions/erc1155";
 *
 * const transaction = openPack({
 *  contract,
 *  packId: ...,
 *  amountToOpen: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function openPack(
  options: BaseTransactionOptions<
    | OpenPackParams
    | {
        asyncParams: () => Promise<OpenPackParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [resolvedOptions.packId, resolvedOptions.amountToOpen] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}

import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "createSessionWithSig" function.
 */
export type CreateSessionWithSigParams = WithOverrides<{
  sessionSpec: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "sessionSpec";
    components: [
      { type: "address"; name: "signer" },
      { type: "bool"; name: "isWildcard" },
      { type: "uint256"; name: "expiresAt" },
      {
        type: "tuple[]";
        name: "callPolicies";
        components: [
          { type: "address"; name: "target" },
          { type: "bytes4"; name: "selector" },
          { type: "uint256"; name: "maxValuePerUse" },
          {
            type: "tuple";
            name: "valueLimit";
            components: [
              { type: "uint8"; name: "limitType" },
              { type: "uint256"; name: "limit" },
              { type: "uint256"; name: "period" },
            ];
          },
          {
            type: "tuple[]";
            name: "constraints";
            components: [
              { type: "uint8"; name: "condition" },
              { type: "uint64"; name: "index" },
              { type: "bytes32"; name: "refValue" },
              {
                type: "tuple";
                name: "limit";
                components: [
                  { type: "uint8"; name: "limitType" },
                  { type: "uint256"; name: "limit" },
                  { type: "uint256"; name: "period" },
                ];
              },
            ];
          },
        ];
      },
      {
        type: "tuple[]";
        name: "transferPolicies";
        components: [
          { type: "address"; name: "target" },
          { type: "uint256"; name: "maxValuePerUse" },
          {
            type: "tuple";
            name: "valueLimit";
            components: [
              { type: "uint8"; name: "limitType" },
              { type: "uint256"; name: "limit" },
              { type: "uint256"; name: "period" },
            ];
          },
        ];
      },
      { type: "bytes32"; name: "uid" },
    ];
  }>;
  signature: AbiParameterToPrimitiveType<{ type: "bytes"; name: "signature" }>;
}>;

export const FN_SELECTOR = "0xb5051648" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "sessionSpec",
    components: [
      {
        type: "address",
        name: "signer",
      },
      {
        type: "bool",
        name: "isWildcard",
      },
      {
        type: "uint256",
        name: "expiresAt",
      },
      {
        type: "tuple[]",
        name: "callPolicies",
        components: [
          {
            type: "address",
            name: "target",
          },
          {
            type: "bytes4",
            name: "selector",
          },
          {
            type: "uint256",
            name: "maxValuePerUse",
          },
          {
            type: "tuple",
            name: "valueLimit",
            components: [
              {
                type: "uint8",
                name: "limitType",
              },
              {
                type: "uint256",
                name: "limit",
              },
              {
                type: "uint256",
                name: "period",
              },
            ],
          },
          {
            type: "tuple[]",
            name: "constraints",
            components: [
              {
                type: "uint8",
                name: "condition",
              },
              {
                type: "uint64",
                name: "index",
              },
              {
                type: "bytes32",
                name: "refValue",
              },
              {
                type: "tuple",
                name: "limit",
                components: [
                  {
                    type: "uint8",
                    name: "limitType",
                  },
                  {
                    type: "uint256",
                    name: "limit",
                  },
                  {
                    type: "uint256",
                    name: "period",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "tuple[]",
        name: "transferPolicies",
        components: [
          {
            type: "address",
            name: "target",
          },
          {
            type: "uint256",
            name: "maxValuePerUse",
          },
          {
            type: "tuple",
            name: "valueLimit",
            components: [
              {
                type: "uint8",
                name: "limitType",
              },
              {
                type: "uint256",
                name: "limit",
              },
              {
                type: "uint256",
                name: "period",
              },
            ],
          },
        ],
      },
      {
        type: "bytes32",
        name: "uid",
      },
    ],
  },
  {
    type: "bytes",
    name: "signature",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `createSessionWithSig` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `createSessionWithSig` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isCreateSessionWithSigSupported } from "thirdweb/extensions/erc7702";
 *
 * const supported = isCreateSessionWithSigSupported(["0x..."]);
 * ```
 */
export function isCreateSessionWithSigSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "createSessionWithSig" function.
 * @param options - The options for the createSessionWithSig function.
 * @returns The encoded ABI parameters.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeCreateSessionWithSigParams } from "thirdweb/extensions/erc7702";
 * const result = encodeCreateSessionWithSigParams({
 *  sessionSpec: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeCreateSessionWithSigParams(
  options: CreateSessionWithSigParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.sessionSpec,
    options.signature,
  ]);
}

/**
 * Encodes the "createSessionWithSig" function into a Hex string with its parameters.
 * @param options - The options for the createSessionWithSig function.
 * @returns The encoded hexadecimal string.
 * @extension ERC7702
 * @example
 * ```ts
 * import { encodeCreateSessionWithSig } from "thirdweb/extensions/erc7702";
 * const result = encodeCreateSessionWithSig({
 *  sessionSpec: ...,
 *  signature: ...,
 * });
 * ```
 */
export function encodeCreateSessionWithSig(
  options: CreateSessionWithSigParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCreateSessionWithSigParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "createSessionWithSig" function on the contract.
 * @param options - The options for the "createSessionWithSig" function.
 * @returns A prepared transaction object.
 * @extension ERC7702
 * @example
 * ```ts
 * import { sendTransaction } from "thirdweb";
 * import { createSessionWithSig } from "thirdweb/extensions/erc7702";
 *
 * const transaction = createSessionWithSig({
 *  contract,
 *  sessionSpec: ...,
 *  signature: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 */
export function createSessionWithSig(
  options: BaseTransactionOptions<
    | CreateSessionWithSigParams
    | {
        asyncParams: () => Promise<CreateSessionWithSigParams>;
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
      return [resolvedOptions.sessionSpec, resolvedOptions.signature] as const;
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
    erc20Value: async () => (await asyncOptions()).overrides?.erc20Value,
    authorizationList: async () =>
      (await asyncOptions()).overrides?.authorizationList,
  });
}

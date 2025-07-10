import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { getContract } from "../../../contract/contract.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  createSessionWithSig,
  isCreateSessionWithSigSupported,
} from "../__generated__/MinimalAccount/write/createSessionWithSig.js";
import { type CallSpecInput, type TransferSpecInput } from "./types.js";

export type CreateSessionKeyOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  sessionKeyAddress: string;
  durationInSeconds?: number;
  grantFullPermissions?: boolean;
  callPolicies?: CallSpecInput[];
  transferPolicies?: TransferSpecInput[];
};

/**
 * Creates a session key for the minimal account.
 * This allows delegation of specific permissions to another address.
 *
 * @param options - The options for creating the session key
 * @returns A prepared transaction to create the session key
 *
 * @example
 * ```ts
 * import { createSessionKey } from "thirdweb/extensions/erc7702/account";
 * import { defineChain } from "thirdweb/chains";
 *
 * const transaction = createSessionKey({
 *   client,
 *   chain: defineChain(1),
 *   account,
 *   sessionKeyAddress: "0x...",
 *   durationInSeconds: 3600, // 1 hour
 *   grantFullPermissions: true,
 * });
 * ```
 */
export function createSessionKey(options: CreateSessionKeyOptions) {
  const {
    client,
    chain,
    account,
    sessionKeyAddress,
    durationInSeconds = 86400, // 24 hours default
    grantFullPermissions = false,
    callPolicies = [],
    transferPolicies = [],
  } = options;

  // Create the contract using account.address - ABI will be auto-resolved by thirdweb
  const contract = getContract({
    address: account.address,
    chain,
    client,
  });

  // Create the session spec object directly
  const sessionSpec = {
    signer: sessionKeyAddress,
    isWildcard: grantFullPermissions,
    expiresAt: BigInt(Math.floor(Date.now() / 1000) + durationInSeconds),
    callPolicies: grantFullPermissions
      ? []
      : callPolicies.map((policy) => ({
          target: policy.target,
          selector: policy.selector,
          maxValuePerUse: policy.maxValuePerUse || 0n,
          valueLimit: policy.valueLimit || {
            limitType: 0,
            limit: 0n,
            period: 0n,
          },
          constraints: (policy.constraints || []).map((constraint) => ({
            condition: constraint.condition,
            index: constraint.index,
            refValue: constraint.refValue,
            limit: constraint.limit || {
              limitType: 0,
              limit: 0n,
              period: 0n,
            },
          })),
        })),
    transferPolicies: grantFullPermissions
      ? []
      : transferPolicies.map((policy) => ({
          target: policy.target,
          maxValuePerUse: policy.maxValuePerUse || 0n,
          valueLimit: policy.valueLimit || {
            limitType: 0,
            limit: 0n,
            period: 0n,
          },
        })),
    uid: randomBytesHex(32),
  };

  return createSessionWithSig({
    contract,
    sessionSpec,
    signature: "0x",
  });
}

/**
 * Checks if the `isCreateSessionKeySupported` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isAddSessionKeySupported` method is supported.
 * @extension ERC7702
 * @example
 * ```ts
 * import { isCreateSessionKeySupported } from "thirdweb/extensions/erc7702";
 *
 * const supported = isCreateSessionKeySupported(["0x..."]);
 * ```
 */
export function isCreateSessionKeySupported(availableSelectors: string[]) {
  return isCreateSessionWithSigSupported(availableSelectors);
}

import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  createSessionWithSig,
  isCreateSessionWithSigSupported,
} from "../__generated__/MinimalAccount/write/createSessionWithSig.js";
import {
  type CallSpecInput,
  CallSpecRequest,
  ConstraintRequest,
  SessionSpecRequest,
  type TransferSpecInput,
  TransferSpecRequest,
  UsageLimitRequest,
} from "./types.js";

/**
 * @extension ERC7702
 */
export type CreateSessionKeyOptions = {
  /**
   * The admin account that will perform the operation.
   */
  account: Account;
  /**
   * The address to add as a session key.
   */
  sessionKeyAddress: string;
  /**
   * How long the session key should be valid for, in seconds.
   */
  durationInSeconds: number;
  /**
   * Whether to grant full execution permissions to the session key.
   */
  grantFullPermissions?: boolean;
  /**
   * Smart contract interaction policies to apply to the session key, ignored if grantFullPermissions is true.
   */
  callPolicies?: CallSpecInput[];
  /**
   * Value transfer policies to apply to the session key, ignored if grantFullPermissions is true.
   */
  transferPolicies?: TransferSpecInput[];
};

/**
 * Creates  session key permissions for a specified address.
 * @param options - The options for the createSessionKey function.
 * @param {Contract} options.contract - The EIP-7702 smart EOA contract to create the session key from
 * @returns The transaction object to be sent.
 * @example
 * ```ts
 * import { createSessionKey } from 'thirdweb/wallets/in-app';
 * import { sendTransaction } from 'thirdweb';
 *
 * const transaction = createSessionKey({
 *  account: account,
 *  contract: accountContract,
 *  sessionKeyAddress: TEST_ACCOUNT_A.address,
 *  durationInSeconds: 86400, // 1 day
 *  grantFullPermissions: true
 *})
 *
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC7702
 */
export function createSessionKey(
  options: BaseTransactionOptions<CreateSessionKeyOptions>,
) {
  const {
    contract,
    account,
    sessionKeyAddress,
    durationInSeconds,
    grantFullPermissions,
    callPolicies,
    transferPolicies,
  } = options;

  if (durationInSeconds <= 0) {
    throw new Error("durationInSeconds must be positive");
  }

  return createSessionWithSig({
    async asyncParams() {
      const req = {
        callPolicies: (callPolicies || []).map((policy) => ({
          constraints: (policy.constraints || []).map((constraint) => ({
            condition: Number(constraint.condition),
            index: constraint.index || BigInt(0),
            limit: constraint.limit
              ? {
                  limit: constraint.limit.limit,
                  limitType: Number(constraint.limit.limitType),
                  period: constraint.limit.period,
                }
              : {
                  limit: BigInt(0),
                  limitType: 0,
                  period: BigInt(0),
                },
            refValue: constraint.refValue || "0x",
          })),
          maxValuePerUse: policy.maxValuePerUse || BigInt(0),
          selector: policy.selector,
          target: policy.target,
          valueLimit: policy.valueLimit
            ? {
                limit: policy.valueLimit.limit,
                limitType: Number(policy.valueLimit.limitType),
                period: policy.valueLimit.period,
              }
            : {
                limit: BigInt(0),
                limitType: 0,
                period: BigInt(0),
              },
        })),
        expiresAt: BigInt(Math.floor(Date.now() / 1000) + durationInSeconds),
        isWildcard: grantFullPermissions ?? true,
        signer: sessionKeyAddress,
        transferPolicies: (transferPolicies || []).map((policy) => ({
          maxValuePerUse: policy.maxValuePerUse || BigInt(0),
          target: policy.target,
          valueLimit: policy.valueLimit
            ? {
                limit: policy.valueLimit.limit,
                limitType: Number(policy.valueLimit.limitType),
                period: policy.valueLimit.period,
              }
            : {
                limit: BigInt(0),
                limitType: 0,
                period: BigInt(0),
              },
        })),
        uid: await randomBytesHex(),
      };

      const signature = await account.signTypedData({
        domain: {
          chainId: contract.chain.id,
          name: "MinimalAccount",
          verifyingContract: contract.address,
          version: "1",
        },
        message: req,
        primaryType: "SessionSpec",
        types: {
          CallSpec: CallSpecRequest,
          Constraint: ConstraintRequest,
          SessionSpec: SessionSpecRequest,
          TransferSpec: TransferSpecRequest,
          UsageLimit: UsageLimitRequest,
        },
      });

      return { sessionSpec: req, signature };
    },
    contract,
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

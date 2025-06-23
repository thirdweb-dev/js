import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  getContract,
  type ThirdwebContract,
} from "../../../contract/contract.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { readContract } from "../../../transaction/read-contract.js";
import { isHex, stringToHex } from "../../../utils/encoding/hex.js";
import { withCache } from "../../../utils/promise/withCache.js";
import type { SendTransactionOption } from "../../interfaces/wallet.js";
import { DEFAULT_ACCOUNT_FACTORY_V0_6 } from "./constants.js";

/**
 * Predict the address of a smart account.
 * @param args - The options for predicting the address of a smart account.
 * @returns The predicted address of the smart account.
 * @example
 * ```ts
 * import { predictSmartAccountAddress } from "thirdweb/wallets/smart";
 *
 * const predictedAddress = await predictSmartAccountAddress({
 *  client,
 *  chain,
 *  adminAddress,
 * });
 * ```
 * @walletUtils
 */
export async function predictSmartAccountAddress(args: {
  client: ThirdwebClient;
  chain: Chain;
  adminAddress: string;
  factoryAddress?: string;
  accountSalt?: string;
}): Promise<string> {
  return predictAddress({
    accountSalt: args.accountSalt,
    adminAddress: args.adminAddress,
    factoryContract: getContract({
      address: args.factoryAddress ?? DEFAULT_ACCOUNT_FACTORY_V0_6,
      chain: args.chain,
      client: args.client,
    }),
  });
}

/**
 * Predict the address of a smart account.
 * @param args - The options for predicting the address of a smart account.
 * @returns The predicted address of the smart account.
 * @example
 * ```ts
 * import { predictAddress } from "thirdweb/wallets/smart";
 *
 * const predictedAddress = await predictAddress({
 *  factoryContract,
 *  adminAddress,
 *  accountSalt,
 * });
 * ```
 * @walletUtils
 * @deprecated Use `predictSmartAccountAddress` instead.
 */
export async function predictAddress(args: {
  factoryContract: ThirdwebContract;
  predictAddressOverride?: (
    factoryContract: ThirdwebContract,
    admin: string,
  ) => Promise<string>;
  adminAddress: string;
  accountSalt?: string;
  accountAddress?: string;
}): Promise<string> {
  const {
    factoryContract,
    predictAddressOverride: predictAddress,
    adminAddress,
    accountSalt,
    accountAddress,
  } = args;
  if (predictAddress) {
    return predictAddress(factoryContract, adminAddress);
  }
  if (accountAddress) {
    return accountAddress;
  }
  if (!adminAddress) {
    throw new Error(
      "Account address is required to predict the smart wallet address.",
    );
  }
  return withCache(
    async () => {
      const saltHex =
        accountSalt && isHex(accountSalt)
          ? accountSalt
          : stringToHex(accountSalt ?? "");
      let result: string | undefined;
      let retries = 0;
      const maxRetries = 3;

      while (retries <= maxRetries) {
        try {
          result = await readContract({
            contract: factoryContract,
            method: "function getAddress(address, bytes) returns (address)",
            params: [adminAddress, saltHex],
          });
          break;
        } catch (error) {
          if (retries === maxRetries) {
            throw error;
          }

          // Exponential backoff: 2^(retries + 1) * 200ms (400ms, 800ms, 1600ms)
          const delay = 2 ** (retries + 1) * 200;
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
        }
      }
      if (!result) {
        throw new Error(
          `No smart account address found for admin address ${adminAddress} and salt ${accountSalt}`,
        );
      }
      return result;
    },
    {
      cacheKey: `${args.factoryContract.chain.id}-${args.factoryContract.address}-${args.adminAddress}-${args.accountSalt}`,
      cacheTime: 1000 * 60 * 60 * 24, // 1 day
    },
  );
}

/**
 * @internal
 */
export function prepareCreateAccount(args: {
  factoryContract: ThirdwebContract;
  adminAddress: string;
  accountSalt?: string;
  createAccountOverride?: (
    factoryContract: ThirdwebContract,
    admin: string,
  ) => PreparedTransaction;
}): PreparedTransaction {
  const {
    adminAddress,
    factoryContract,
    createAccountOverride: createAccount,
    accountSalt,
  } = args;
  if (createAccount) {
    return createAccount(factoryContract, adminAddress);
  }
  const saltHex =
    accountSalt && isHex(accountSalt)
      ? accountSalt
      : stringToHex(accountSalt ?? "");
  return prepareContractCall({
    contract: factoryContract,
    method: "function createAccount(address, bytes) returns (address)",
    params: [adminAddress, saltHex],
  });
}

/**
 * @internal
 */
export function prepareExecute(args: {
  accountContract: ThirdwebContract;
  transaction: SendTransactionOption;
  executeOverride?: (
    accountContract: ThirdwebContract,
    transaction: SendTransactionOption,
  ) => PreparedTransaction;
}): PreparedTransaction {
  const { accountContract, transaction, executeOverride: execute } = args;
  if (execute) {
    return execute(accountContract, transaction);
  }
  let value = transaction.value || 0n;
  // special handling of hedera chains, decimals for native value is 8 instead of 18 when passed as contract params
  if (transaction.chainId === 295 || transaction.chainId === 296) {
    value = BigInt(value) / BigInt(10 ** 10);
  }
  return prepareContractCall({
    contract: accountContract,
    // if gas is specified for the inner tx, use that and add 21k for the execute call on the account contract
    // this avoids another estimateGas call when bundling the userOp
    // and also allows for passing custom gas limits for the inner tx
    gas: transaction.gas ? transaction.gas + 21000n : undefined,
    method: "function execute(address, uint256, bytes)",
    params: [transaction.to || "", value, transaction.data || "0x"],
  });
}

/**
 * @internal
 */
export function prepareBatchExecute(args: {
  accountContract: ThirdwebContract;
  transactions: SendTransactionOption[];
  executeBatchOverride?: (
    accountContract: ThirdwebContract,
    transactions: SendTransactionOption[],
  ) => PreparedTransaction;
}): PreparedTransaction {
  const {
    accountContract,
    transactions,
    executeBatchOverride: executeBatch,
  } = args;
  if (executeBatch) {
    return executeBatch(accountContract, transactions);
  }
  let values = transactions.map((tx) => tx.value || 0n);
  const chainId = transactions[0]?.chainId;
  // special handling of hedera chains, decimals for native value is 8 instead of 18 when passed as contract params
  if (chainId === 295 || chainId === 296) {
    values = values.map((value) => BigInt(value) / BigInt(10 ** 10));
  }
  return prepareContractCall({
    contract: accountContract,
    method: "function executeBatch(address[], uint256[], bytes[])",
    params: [
      transactions.map((tx) => tx.to || ""),
      values,
      transactions.map((tx) => tx.data || "0x"),
    ],
  });
}

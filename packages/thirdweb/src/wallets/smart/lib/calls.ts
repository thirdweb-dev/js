import type { ThirdwebContract } from "../../../contract/contract.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { readContract } from "../../../transaction/read-contract.js";
import { isHex, stringToHex } from "../../../utils/encoding/hex.js";
import type { SendTransactionOption } from "../../interfaces/wallet.js";

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
 */
export async function predictAddress(args: {
  factoryContract: ThirdwebContract;
  predictAddressOverride?: (
    factoryContract: ThirdwebContract,
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
    return predictAddress(factoryContract);
  }
  if (accountAddress) {
    return accountAddress;
  }
  if (!adminAddress) {
    throw new Error(
      "Account address is required to predict the smart wallet address.",
    );
  }
  const saltHex =
    accountSalt && isHex(accountSalt)
      ? accountSalt
      : stringToHex(accountSalt ?? "");
  return readContract({
    contract: factoryContract,
    method: "function getAddress(address, bytes) returns (address)",
    params: [adminAddress, saltHex],
  });
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
  ) => PreparedTransaction;
}): PreparedTransaction {
  const {
    adminAddress,
    factoryContract,
    createAccountOverride: createAccount,
    accountSalt,
  } = args;
  if (createAccount) {
    return createAccount(factoryContract);
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
  return prepareContractCall({
    contract: accountContract,
    method: "function execute(address, uint256, bytes)",
    params: [
      transaction.to || "",
      transaction.value || 0n,
      transaction.data || "0x",
    ],
    // if gas is specified for the inner tx, use that and add 21k for the execute call on the account contract
    // this avoids another estimateGas call when bundling the userOp
    // and also allows for passing custom gas limits for the inner tx
    gas: transaction.gas ? transaction.gas + 21000n : undefined,
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
  return prepareContractCall({
    contract: accountContract,
    method: "function executeBatch(address[], uint256[], bytes[])",
    params: [
      transactions.map((tx) => tx.to || ""),
      transactions.map((tx) => tx.value || 0n),
      transactions.map((tx) => tx.data || "0x"),
    ],
  });
}

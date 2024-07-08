import type { ThirdwebContract } from "../../../contract/contract.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { PreparedTransaction } from "../../../transaction/prepare-transaction.js";
import { readContract } from "../../../transaction/read-contract.js";
import { stringToHex } from "../../../utils/encoding/hex.js";
import type { SendTransactionOption } from "../../interfaces/wallet.js";
import type { SmartAccountOptions, SmartWalletOptions } from "../types.ts";

/**
 * @internal
 */
export async function predictAddress(
  factoryContract: ThirdwebContract,
  options: SmartWalletOptions & { personalAccountAddress?: string },
): Promise<string> {
  if (options.overrides?.predictAddress) {
    return options.overrides.predictAddress(factoryContract);
  }
  if (options.overrides?.accountAddress) {
    return options.overrides.accountAddress;
  }
  const adminAddress = options.personalAccountAddress;
  if (!adminAddress) {
    throw new Error(
      "Account address is required to predict the smart wallet address.",
    );
  }
  const extraData = stringToHex(options.overrides?.accountSalt ?? "");
  return readContract({
    contract: factoryContract,
    method: "function getAddress(address, bytes) returns (address)",
    params: [adminAddress, extraData],
  });
}

/**
 * @internal
 */
export function prepareCreateAccount(args: {
  factoryContract: ThirdwebContract;
  options: {
    personalAccount?: {
      address: string;
    };
    overrides?: {
      createAccount?: (
        factoryContract: ThirdwebContract,
      ) => PreparedTransaction;
      accountSalt?: string;
    };
  };
}): PreparedTransaction {
  const { factoryContract, options } = args;
  if (options.overrides?.createAccount) {
    console.log("options.overrides.createAccount set");
    return options.overrides.createAccount(factoryContract);
  }
  const adminAddress = options.personalAccount?.address;
  if (!adminAddress) {
    throw new Error("Personal account address is required.");
  }
  return prepareContractCall({
    contract: factoryContract,
    method: "function createAccount(address, bytes) returns (address)",
    params: [adminAddress, stringToHex(options.overrides?.accountSalt ?? "")],
  });
}

/**
 * @internal
 */
export function prepareExecute(args: {
  accountContract: ThirdwebContract;
  transaction: SendTransactionOption;
  execute?: (
    accountContract: ThirdwebContract,
    transaction: SendTransactionOption,
  ) => PreparedTransaction;
}): PreparedTransaction {
  const { accountContract, execute, transaction } = args;
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
  });
}

/**
 * @internal
 */
export function prepareBatchExecute(args: {
  accountContract: ThirdwebContract;
  options: SmartAccountOptions;
  transactions: SendTransactionOption[];
}): PreparedTransaction {
  const { accountContract, options, transactions } = args;
  if (options.overrides?.executeBatch) {
    return options.overrides.executeBatch(accountContract, transactions);
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

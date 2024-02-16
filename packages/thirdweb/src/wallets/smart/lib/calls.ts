import { toHex } from "viem";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { SmartWalletOptions } from "../types.js";
import { readContract } from "../../../transaction/read-contract.js";
import {
  prepareContractCall,
  type PreparedTransaction,
} from "../../../index.js";
import type { Account } from "../../index.js";
import type { SendTransactionOption } from "../../interfaces/wallet.js";

/**
 * @internal
 */
export async function predictAddress(
  factoryContract: ThirdwebContract,
  options: SmartWalletOptions & { personalAccount: Account },
): Promise<string> {
  if (options.overrides?.predictAddress) {
    return options.overrides.predictAddress(factoryContract);
  }
  const accountAddress =
    options.overrides?.accountAddress || options.personalAccount.address;
  const extraData = toHex(options.overrides?.accountSalt ?? "");
  return readContract({
    contract: factoryContract,
    method: "function getAddress(address, bytes) returns (address)",
    params: [accountAddress, extraData],
  });
}

/**
 * @internal
 */
export function prepareCreateAccount(args: {
  factoryContract: ThirdwebContract;
  options: SmartWalletOptions & { personalAccount: Account };
}): PreparedTransaction {
  const { factoryContract, options } = args;
  if (options.overrides?.createAccount) {
    return options.overrides.createAccount(factoryContract);
  }
  return prepareContractCall({
    contract: factoryContract,
    method: "function createAccount(address, bytes) public returns (address)",
    params: [
      options.overrides?.accountAddress || options.personalAccount.address,
      toHex(options.overrides?.accountSalt ?? ""),
    ],
  });
}

/**
 * @internal
 */
export function prepareExecute(args: {
  accountContract: ThirdwebContract;
  options: SmartWalletOptions;
  transaction: SendTransactionOption;
}): PreparedTransaction {
  const { accountContract, options, transaction } = args;
  if (options.overrides?.execute) {
    return options.overrides.execute(accountContract, transaction);
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
  options: SmartWalletOptions;
  transactions: SendTransactionOption[];
}): PreparedTransaction {
  const { accountContract, options, transactions } = args;
  if (options.overrides?.executeBatch) {
    return options.overrides.executeBatch(accountContract, transactions);
  }
  return prepareContractCall({
    contract: accountContract,
    method:
      "function executeBatch(address[] calldata _target,uint256[] calldata _value,bytes[] calldata _calldata)",
    params: [
      transactions.map((tx) => tx.to || ""),
      transactions.map((tx) => tx.value || 0n),
      transactions.map((tx) => tx.data || "0x"),
    ],
  });
}

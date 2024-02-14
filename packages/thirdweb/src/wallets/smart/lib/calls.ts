import { toHex, type Hex } from "viem";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { SmartWalletOptions } from "../types.js";
import { readContract } from "../../../transaction/read-contract.js";
import {
  prepareContractCall,
  type PreparedTransaction,
} from "../../../index.js";

/**
 * @internal
 */
export async function predictAddress(
  factoryContract: ThirdwebContract,
  options: SmartWalletOptions,
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
  options: SmartWalletOptions;
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
  target: string;
  value: bigint;
  data: Hex;
}): PreparedTransaction {
  const { accountContract, options, target, value, data } = args;
  if (options.overrides?.execute) {
    return options.overrides.execute(accountContract, target, value, data);
  }
  return prepareContractCall({
    contract: accountContract,
    method: "function execute(address, uint256, bytes)",
    params: [target, value, data],
  });
}

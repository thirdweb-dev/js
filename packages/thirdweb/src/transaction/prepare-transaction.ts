import type { Abi, AbiFunction, Address } from "abitype";
import type { AccessList, Hex } from "viem";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { ThirdwebContract } from "../contract/contract.js";
import type { PreparedMethod } from "../utils/abi/prepare-method.js";
import type { PromisedObject } from "../utils/promise/resolve-promised-value.js";

export type StaticPrepareTransactionOptions = {
  accessList?: AccessList | undefined;
  to?: Address | undefined;
  data?: Hex | undefined;
  value?: bigint | undefined;
  gas?: bigint | undefined;
  gasPrice?: bigint | undefined;
  maxFeePerGas?: bigint | undefined;
  maxPriorityFeePerGas?: bigint | undefined;
  maxFeePerBlobGas?: bigint | undefined;
  nonce?: number | undefined;
  extraGas?: bigint | undefined;
  // zksync specific
  eip712?: EIP712TransactionOptions | undefined;
  // tw specific
  chain: Chain;
  client: ThirdwebClient;
};

export type EIP712TransactionOptions = {
  // constant or user input
  gasPerPubdata?: bigint | undefined;
  // optional signature, generated
  customSignature?: Hex | undefined;
  // optional, used to deploy contracts with the transaction
  factoryDeps?: Hex[] | undefined;
  // optional, paymaster contract address to invoke
  paymaster?: Address | undefined;
  // optional, paymaster contract input
  paymasterInput?: Hex | undefined;
};

export type EIP712SerializedTransaction = {
  txType: bigint;
  from: bigint;
  to: bigint;
  gasLimit: bigint;
  gasPerPubdataByteLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  nonce: bigint;
  value: bigint;
  data: Hex;
  factoryDeps: Hex[];
  paymaster: bigint;
  paymasterInput: Hex;
};

export type PrepareTransactionOptions = {
  chain: Chain;
  client: ThirdwebClient;
} & PromisedObject<Omit<StaticPrepareTransactionOptions, "chain" | "client">>;

type Additional<
  abi extends Abi = [],
  abiFn extends AbiFunction = AbiFunction,
> = {
  preparedMethod: () => Promise<PreparedMethod<abiFn>>;
  contract: ThirdwebContract<abi>;
};

export type PreparedTransaction<
  abi extends Abi = [],
  abiFn extends AbiFunction = AbiFunction,
  options extends PrepareTransactionOptions = PrepareTransactionOptions,
> = Readonly<options> & {
  __preparedMethod?: () => Promise<PreparedMethod<abiFn>>;
  __contract?: ThirdwebContract<abi>;
};

/**
 * Prepares a transaction with the given options.
 * @param options - The options for preparing the transaction.
 * @param info - Additional information about the ABI function.
 * @returns The prepared transaction.
 * @transaction
 * @example
 * ```ts
 * import { prepareTransaction, toWei } from "thirdweb";
 * import { ethereum } from "thirdweb/chains";
 * const transaction = prepareTransaction({
 *  to: "0x1234567890123456789012345678901234567890",
 *  chain: ethereum,
 *  client: thirdwebClient,
 *  value: toWei("1.0"),
 *  gasPrice: 30n
 * });
 * ```
 */
export function prepareTransaction<
  const abi extends Abi = [],
  const abiFn extends AbiFunction = AbiFunction,
>(options: PrepareTransactionOptions, info?: Additional<abi, abiFn>) {
  if (info) {
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
    (options as any).__preparedMethod = info.preparedMethod;
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
    (options as any).__contract = info.contract;
  }
  return options as PreparedTransaction<abi, abiFn>;
}

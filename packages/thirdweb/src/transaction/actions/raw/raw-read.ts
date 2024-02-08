import type { AbiFunction } from "abitype";
import {
  prepareTransaction,
  type Transaction,
  type TransactionOptions,
} from "../../transaction.js";
import type { ReadOutputs } from "../read.js";
import { eth_call, getRpcClient } from "../../../rpc/index.js";
import { decodeFunctionResult } from "../../../abi/decode.js";
import type { Hex } from "viem";
import { encodeRaw } from "./raw-encode.js";

type ReadTransactionRawOptions<abiFn extends AbiFunction> = {
  transaction: Transaction<abiFn>;
  abiFunction: abiFn;
  encodedData: Hex;
};

/**
 * @internal
 */
export async function readTransactionRaw<const abiFn extends AbiFunction>({
  transaction,
  encodedData,
  abiFunction,
}: ReadTransactionRawOptions<abiFn>): Promise<ReadOutputs<abiFn>> {
  const rpcRequest = getRpcClient(transaction.contract);
  const result = await eth_call(rpcRequest, {
    data: encodedData,
    to: transaction.contract.address,
  });

  const decoded = decodeFunctionResult(abiFunction, result);

  if (Array.isArray(decoded) && decoded.length === 1) {
    return decoded[0];
  }

  return decoded as ReadOutputs<abiFn>;
}

/**
 * @internal
 */
export async function readContractRaw<const abiFn extends AbiFunction>(
  options: TransactionOptions<[], abiFn>,
) {
  const transaction = prepareTransaction(options) as Transaction<abiFn>;
  return readTransactionRaw<abiFn>({
    transaction,
    encodedData: await encodeRaw({
      abiFunction: options.method,
      transaction: transaction,
    }),
    abiFunction: options.method,
  });
}

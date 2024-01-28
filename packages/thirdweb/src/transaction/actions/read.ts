import { decodeFunctionResult } from "../../abi/decode.js";
import type {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunctionNames,
} from "abitype";
import {
  transaction,
  type Transaction,
  type TransactionInput,
} from "../transaction.js";
import { eth_call, getRpcClient } from "../../rpc/index.js";
import { encode } from "./encode.js";
import { resolveAbi } from "./resolve-abi.js";

export async function read<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the method to function names of the abi
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(options: TransactionInput<abi, method>) {
  return readTx(transaction(options));
}

export type ReadOutputs<abiFn extends AbiFunction> = // if the outputs are 0 length, return never, invalid case
  abiFn["outputs"] extends { length: 0 }
    ? never
    : abiFn["outputs"] extends { length: 1 }
      ? // if the outputs are 1 length, we'll always return the first element
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>[0]
      : // otherwise we'll return the array
        AbiParametersToPrimitiveTypes<abiFn["outputs"]>;

export async function readTx<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
): Promise<ReadOutputs<abiFn>> {
  const [encodedData, resolvedAbi] = await Promise.all([
    encode(tx),
    resolveAbi(tx),
  ]);
  if (!resolvedAbi) {
    throw new Error("Unable to resolve ABI");
  }

  const rpcRequest = getRpcClient(tx.contract.client, {
    chainId: tx.contract.chainId,
  });
  const result = await eth_call(rpcRequest, {
    data: encodedData,
    to: tx.contract.address,
  });

  const decoded = decodeFunctionResult(resolvedAbi, result);

  if (Array.isArray(decoded) && decoded.length === 1) {
    return decoded[0];
  }

  // @ts-expect-error - not sure why this complains but it works fine
  return decoded;
}

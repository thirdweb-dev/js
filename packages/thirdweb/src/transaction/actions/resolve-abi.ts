import { parseAbiItem, type AbiFunction, type Abi } from "abitype";
import type { Transaction, TransactionInput } from "../transaction.js";
import { isAbiFunction } from "../../abi/resolveAbiFunction.js";
import type { ParseMethod } from "../../abi/types.js";

const ABI_FN_RESOLUTION_CACHE = new WeakMap<
  Transaction<AbiFunction>,
  Promise<AbiFunction>
>();

export function resolveAbi<
  method extends AbiFunction | string,
  abi extends Abi,
>(tx: TransactionInput<abi, method>): Promise<ParseMethod<abi, method>> {
  if (ABI_FN_RESOLUTION_CACHE.has(tx as Transaction<AbiFunction>)) {
    return ABI_FN_RESOLUTION_CACHE.get(
      tx as Transaction<AbiFunction>,
    ) as Promise<ParseMethod<abi, method>>;
  }
  const prom = (async () => {
    if (isAbiFunction(tx.method)) {
      return tx.method as ParseMethod<abi, method>;
    }
    // if the method starts with the string `function ` we always will want to try to parse it
    if (tx.method.startsWith("function ")) {
      const abiItem = parseAbiItem(tx.method);
      if (abiItem.type === "function") {
        return abiItem as ParseMethod<abi, method>;
      }
      throw new Error(`"method" passed is not of type "function"`);
    }
    // check if we have a "abi" on the contract
    if (tx.contract.abi && tx.contract.abi?.length > 0) {
      // extract the abiFunction from it
      const abiFunction = tx.contract.abi?.find(
        (item) => item.type === "function" && item.name === tx.method,
      );
      // if we were able to find it -> return it
      if (abiFunction) {
        return abiFunction as ParseMethod<abi, method>;
      }
    }

    // if we get here we need to async resolve the ABI and try to find the method on there
    const { resolveContractAbi } = await import(
      "../../contract/actions/resolve-abi.js"
    );

    const abi = await resolveContractAbi(tx.contract);
    // we try to find the abiFunction in the abi
    const abiFunction = abi.find((item) => {
      // if the item is not a function we can ignore it
      if (item.type !== "function") {
        return false;
      }
      // if the item is a function we can compare the name
      return item.name === tx.method;
    }) as ParseMethod<abi, method> | undefined;

    if (!abiFunction) {
      throw new Error(`could not find function with name ${tx.method} in abi`);
    }
    return abiFunction;
  })();
  ABI_FN_RESOLUTION_CACHE.set(tx as Transaction<AbiFunction>, prom);
  return prom;
}

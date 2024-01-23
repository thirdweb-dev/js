import { type AbiFunction, parseAbiItem } from "abitype";
import { resolveAbi } from "./resolveContractAbi.js";
import type { ParseMethod } from "./types.js";
import type { ThirdwebClient } from "../client/client.js";
import type { ContractOptions } from "../contract/index.js";

export type MethodType = AbiFunction | string;

export async function resolveAbiFunction<const method extends MethodType>(
  // used later to resolve via RPC & storage directly
  _client: ThirdwebClient,
  options: ContractOptions & { method: method },
) {
  // check if we already have a parsed abiFunction as input
  if (isAbiFunction(options.method)) {
    // in this case just return it
    return options.method as ParseMethod<method>;
  }

  // now we know we have a string

  // try to parse the abiFunction directly first
  try {
    // if this succeeds we can return the parsed abiFunction
    const abiItem = parseAbiItem(options.method);
    if (abiItem.type === "function") {
      return abiItem as ParseMethod<method>;
    }
    // if it's not an abiFunction we throw an error
    throw new Error(`could not find function with name ${options.method}`);
  } catch (e) {
    // if this fails we can download the abi of the contract and try parsing the entire abi
    const abi = await resolveAbi(options);
    // we try to find the abiFunction in the abi
    const abiFunction = abi.find((item) => {
      // if the item is not a function we can ignore it
      if (item.type !== "function") {
        return false;
      }
      // if the item is a function we can compare the name
      return item.name === options.method;
    }) as ParseMethod<method> | undefined;

    if (!abiFunction) {
      throw new Error(`could not find function with name ${options.method}`);
    }
    return abiFunction;
  }
}

// helpers

export function isAbiFunction(item: unknown): item is AbiFunction {
  return !!(
    item &&
    typeof item === "object" &&
    "name" in item &&
    "type" in item
  );
}

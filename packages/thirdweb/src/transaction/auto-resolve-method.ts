import type { Abi, AbiFunction } from "abitype";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../index.js";

/**
 * Resolves and returns the ABI function with the specified method name.
 * Throws an error if the function is not found in the ABI.
 *
 * @template abiFn - The type of the ABI function.
 * @param method - The name of the method to resolve.
 * @returns The resolved ABI function.
 * @throws Error if the function is not found in the ABI.
 * @internal
 */
export function autoResolveMethod<abiFn extends AbiFunction>(method: string) {
  return async function (contract: ThirdwebContract) {
    const resolvedAbi = await resolveContractAbi<Abi>(contract);
    // we try to find the abiFunction in the abi
    const abiFunction = resolvedAbi.find((item) => {
      // if the item is not a function we can ignore it
      if (item.type !== "function") {
        return false;
      }
      // if the item is a function we can compare the name
      return item.name === method;
    }) as abiFn | undefined;

    if (!abiFunction) {
      throw new Error(`could not find function with name "${method}" in abi`);
    }
    return abiFunction;
  };
}

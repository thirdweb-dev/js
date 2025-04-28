import { isAddress } from "../address.js";
import { isHex, padHex } from "../encoding/hex.js";

/**
 * Converts an array of parameter values to their respective types based on the provided type array.
 *
 * This utility function is particularly useful for ensuring that parameter values are correctly formatted
 * according to the expected types before they are used in further processing or passed to a Solidity smart contract.
 *
 * @param {string[]} constructorParamTypes - An array of type strings indicating the expected types of the values,
 *                   following Solidity type conventions (e.g., "address", "uint256", "bool").
 * @param {unknown[]} constructorParamValues - An array of values to be converted according to the types.
 * @returns - An array of values converted to their respective types.
 *
 * @example
 * ```ts
 * import { parseAbiParams } from "thirdweb/utils";
 *
 * const example1 = parseAbiParams(
 *   ["address", "uint256"],
 *   ["0x.....", "1200000"]
 * ); // result: ["0x......", 1200000n]
 *
 * const example2 = parseAbiParams(
 *   ["address", "bool"],
 *   ["0x.....", "true"]
 * ); // result: ["0x......", true]
 * ```
 * @utils
 */
export function parseAbiParams(
  constructorParamTypes: string[],
  constructorParamValues: unknown[],
): Array<string | bigint | boolean> {
  /**
   * Internal Solidity type checklist
   * 1. tuple, array -> JSON.parse | todo: Recursively parse the content
   * 2. uint, int -> bigint
   * 3. address -> string
   * 4. string -> string
   * 5. bytes, bytes32 etc. -> string
   * 6. bool -> boolean
   * >>> Make sure to return the original value at the end of the function <<<
   */

  // Make sure they have the same length
  if (constructorParamTypes.length !== constructorParamValues.length) {
    throw new Error(
      `Passed the wrong number of constructor arguments: ${constructorParamValues.length}, expected ${constructorParamTypes.length}`,
    );
  }
  return constructorParamTypes.map((type, index) => {
    const value = constructorParamValues[index];
    if (type === "tuple" || type.endsWith("]")) {
      if (typeof value === "string") {
        return JSON.parse(value);
      }
      return value;
    }
    if (type === "string") {
      return String(value);
    }
    if (type === "bytes32") {
      if (!isHex(value)) {
        throw new Error(`${value} is not a valid hex string`);
      }
      return padHex(value);
    }
    if (type.startsWith("bytes")) {
      if (!isHex(value)) {
        throw new Error(`${value} is not a valid hex string`);
      }
      return value;
    }
    if (type === "address") {
      if (typeof value !== "string" || !isAddress(value)) {
        throw new Error(`${value} is not a valid address`);
      }
      return value;
    }
    if (type.startsWith("uint") || type.startsWith("int")) {
      if (typeof value === "bigint") {
        return value;
      }
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error(`Cannot convert type ${typeof value} to BigInt`);
      }
      try {
        const val = BigInt(value);
        return val;
      } catch (err) {
        throw new Error((err as Error).message);
      }
    }
    if (type.startsWith("bool")) {
      if (value === "false" || value === false) {
        return false;
      }
      if (value === "true" || value === true) {
        return true;
      }
      throw new Error(
        "Invalid boolean value. Expecting either 'true' or 'false'",
      );
    }

    // Return the value here if none of the types match
    return value;
  });
}

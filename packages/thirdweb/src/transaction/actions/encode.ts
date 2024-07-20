import type { Abi, AbiFunction } from "abitype";
import type { Hex } from "../../utils/encoding/hex.js";
import type { PreparedTransaction } from "../prepare-transaction.js";

const encodeWeakMap = new WeakMap<
  PreparedTransaction<Abi, AbiFunction>,
  Promise<Hex>
>();

/**
 * Encodes a transaction object into a hexadecimal string representation of the encoded data.
 * @param transaction - The transaction object to encode.
 * @returns A promise that resolves to the encoded data as a hexadecimal string.
 * @transaction
 * @example
 * ```ts
 * import { encode } from "thirdweb";
 * const encodedData = await encode(transaction);
 * ```
 */
export async function encode<abi extends Abi, abiFn extends AbiFunction>(
  transaction: PreparedTransaction<abi, abiFn>,
): Promise<Hex> {
  if (encodeWeakMap.has(transaction)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return encodeWeakMap.get(transaction)!;
  }
  const promise = (async () => {
    const [data, extraData, { concatHex }] = await Promise.all([
      getDataFromTx(transaction),
      getExtraCallDataFromTx(transaction),
      import("../../utils/encoding/helpers/concat-hex.js"),
    ]);
    if (extraData) {
      return concatHex([data, extraData]);
    }
    return data;
  })();
  encodeWeakMap.set(transaction, promise);
  return promise;
}

/**
 * Get the transaction.data (from a PreparedTransaction)
 * If the transaction does not have `data`, we default to "0x"
 * @internal
 */
export async function getDataFromTx<abi extends Abi, abiFn extends AbiFunction>(
  transaction: PreparedTransaction<abi, abiFn>,
): Promise<Hex> {
  if (transaction.data === undefined) {
    return "0x";
  }
  if (typeof transaction.data === "function") {
    const data = await transaction.data();
    if (!data) {
      return "0x";
    }
    return data;
  }
  return transaction.data;
}

/**
 * Get the extraCallData from a PreparedTransaction
 * @internal
 * If extraCallData is "0x", we will return `undefined`
 * to simplify the code, since concatenating "0x" doesn't do anything
 */
export async function getExtraCallDataFromTx<
  abi extends Abi,
  abiFn extends AbiFunction,
>(transaction: PreparedTransaction<abi, abiFn>): Promise<Hex | undefined> {
  if (!transaction.extraCallData) {
    return undefined;
  }
  if (typeof transaction.extraCallData === "function") {
    const extraData = await transaction.extraCallData();
    if (!extraData) return undefined;
    if (!extraData.startsWith("0x")) {
      throw Error("Invalid extra calldata - must be a hex string");
    }
    if (extraData === "0x") {
      return undefined;
    }
    return extraData;
  }
  if (!transaction.extraCallData.startsWith("0x")) {
    throw Error("Invalid extra calldata - must be a hex string");
  }
  return transaction.extraCallData;
}

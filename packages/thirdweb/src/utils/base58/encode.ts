import { ALPHABET } from "./alphabet.js";

const BASE = ALPHABET.length;
const LEADER = /* @__PURE__ */ (() => ALPHABET.charAt(0))();
const iFACTOR = /* @__PURE__ */ (() => Math.log(256) / Math.log(BASE))(); // log(256) / log(BASE), rounded up

/**
 * Encodes a Uint8Array into a base58 string.
 * @param source - The Uint8Array to encode.
 * @returns The base58 encoded string.
 * @throws {TypeError} If the source is not a Uint8Array.
 * @throws {Error} If there is a non-zero carry during the encoding process.
 * @example
 * ```ts
 * import { base58Encode } from "thirdweb/utils;
 * const source = new Uint8Array([0, 1, 2, 3, 4, 5]);
 * const encoded = base58Encode(source);
 * console.log(encoded);
 * ```
 */
export function base58Encode(source: Uint8Array): string {
  if (!(source instanceof Uint8Array)) {
    throw new TypeError("Expected Uint8Array");
  }
  if (source.length === 0) {
    return "";
  }
  // Skip & count leading zeroes.
  let zeroes = 0;
  let length = 0;
  let pbegin = 0;
  const pend = source.length;
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++;
    zeroes++;
  }
  // Allocate enough space in big-endian base58 representation.
  const size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
  const b58 = new Uint8Array(size);
  // Process the bytes.
  while (pbegin !== pend) {
    let carry = source[pbegin] || 0;
    // Apply "b58 = b58 * 256 + ch".
    let i = 0;
    for (
      let it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * (b58[it1] || 0)) >>> 0;
      b58[it1] = (carry % BASE) >>> 0;
      carry = (carry / BASE) >>> 0;
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry");
    }
    length = i;
    pbegin++;
  }
  // Skip leading zeroes in base58 result.
  let it2 = size - length;
  while (it2 !== size && b58[it2] === 0) {
    it2++;
  }
  // Translate the result into a string.
  let str = LEADER.repeat(zeroes);
  for (; it2 < size; ++it2) {
    str += ALPHABET.charAt(b58[it2] || 0);
  }
  return str;
}

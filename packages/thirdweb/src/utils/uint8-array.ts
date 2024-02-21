/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-description */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */

import { cachedTextDecoder } from "./text-decoder.js";

const uint8ArrayStringified = "[object Uint8Array]";

/**
 * Throw a `TypeError` if the given value is not an instance of `Uint8Array`.
 * @example
 * ```
 * import {assertUint8Array} from 'uint8array-extras';
 *
 * try {
 * assertUint8Array(new ArrayBuffer(10)); // Throws a TypeError
 * } catch (error) {
 * console.error(error.message);
 * }
 * ```
 */
function assertUint8Array(value: unknown): asserts value is Uint8Array {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}

/**
 * Check if the given value is an instance of `Uint8Array`.
 *
 * Replacement for [`Buffer.isBuffer()`](https://nodejs.org/api/buffer.html#static-method-bufferisbufferobj).
 * @example
 * ```
 * import {isUint8Array} from 'uint8array-extras';
 *
 * console.log(isUint8Array(new Uint8Array()));
 * //=> true
 *
 * console.log(isUint8Array(Buffer.from('x')));
 * //=> true
 *
 * console.log(isUint8Array(new ArrayBuffer(10)));
 * //=> false
 * ```
 */
export function isUint8Array(value: unknown): value is Uint8Array {
  if (!value) {
    return false;
  }

  if (value.constructor === Uint8Array) {
    return true;
  }

  return Object.prototype.toString.call(value) === uint8ArrayStringified;
}

/**
 * Check if two arrays are identical by verifying that they contain the same bytes in the same sequence.
 *
 * Replacement for [`Buffer#equals()`](https://nodejs.org/api/buffer.html#bufequalsotherbuffer).
 * @example
 * ```
 * import {areUint8ArraysEqual} from 'uint8array-extras';
 *
 * const a = new Uint8Array([1, 2, 3]);
 * const b = new Uint8Array([1, 2, 3]);
 * const c = new Uint8Array([4, 5, 6]);
 *
 * console.log(areUint8ArraysEqual(a, b));
 * //=> true
 *
 * console.log(areUint8ArraysEqual(a, c));
 * //=> false
 * ```
 */
export function areUint8ArraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  assertUint8Array(a);
  assertUint8Array(b);

  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) {
      return false;
    }
  }

  return true;
}

/**
 * Convert a `Uint8Array` (containing a UTF-8 string) to a string.
 *
 * Replacement for [`Buffer#toString()`](https://nodejs.org/api/buffer.html#buftostringencoding-start-end).
 * @example
 * ```
 * import {uint8ArrayToString} from 'uint8array-extras';
 *
 * const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
 *
 * console.log(uint8ArrayToString(byteArray));
 * //=> 'Hello'
 * ```
 */
function uint8ArrayToString(array: Uint8Array): string {
  assertUint8Array(array);
  return cachedTextDecoder().decode(array);
}

function assertString(value: any): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}

function base64UrlToBase64(base64url: string) {
  return base64url.replaceAll("-", "+").replaceAll("_", "/");
}

/**
 * Convert a Base64-encoded or [Base64URL](https://base64.guru/standards/base64url)-encoded string to a `Uint8Array`.
 *
 * Replacement for [`Buffer.from('SGVsbG8=', 'base64')`](https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding).
 * @example
 * ```
 * import {base64ToUint8Array} from 'uint8array-extras';
 *
 * console.log(base64ToUint8Array('SGVsbG8='));
 * //=> Uint8Array [72, 101, 108, 108, 111]
 * ```
 */
function base64ToUint8Array(base64String: string): Uint8Array {
  assertString(base64String);
  return Uint8Array.from(
    globalThis.atob(base64UrlToBase64(base64String)),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (x) => x.codePointAt(0)!,
  );
}

/**
 * Decode a Base64-encoded or [Base64URL](https://base64.guru/standards/base64url)-encoded string to a string.
 *
 * Replacement for `Buffer.from('SGVsbG8=', 'base64').toString()` and [`atob()`](https://developer.mozilla.org/en-US/docs/Web/API/atob).
 * @example
 * ```
 * import {base64ToString} from 'uint8array-extras';
 *
 * console.log(base64ToString('SGVsbG8='));
 * //=> 'Hello'
 * ```
 */
export function base64ToString(base64String: string): string {
  assertString(base64String);
  return uint8ArrayToString(base64ToUint8Array(base64String));
}

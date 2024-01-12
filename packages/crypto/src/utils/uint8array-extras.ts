// taken from: https://github.com/sindresorhus/uint8array-extras
// to make it work across CJS and ESM -> once we're fully ESM we can remove this and instead use the package directly

import { getCachedTextDecoder } from "./cache";

const objectToString = Object.prototype.toString;
const uint8ArrayStringified = "[object Uint8Array]";

/**
Check if the given value is an instance of `Uint8Array`.

Replacement for [`Buffer.isBuffer()`](https://nodejs.org/api/buffer.html#static-method-bufferisbufferobj).

@example
```
import {isUint8Array} from 'uint8array-extras';

console.log(isUint8Array(new Uint8Array()));
//=> true

console.log(isUint8Array(Buffer.from('x')));
//=> true

console.log(isUint8Array(new ArrayBuffer(10)));
//=> false
```
*/
function isUint8Array(value: unknown): value is Uint8Array {
  if (!value) {
    return false;
  }

  if (value.constructor === Uint8Array) {
    return true;
  }

  return objectToString.call(value) === uint8ArrayStringified;
}

/**
Throw a `TypeError` if the given value is not an instance of `Uint8Array`.

@example
```
import {assertUint8Array} from 'uint8array-extras';

try {
	assertUint8Array(new ArrayBuffer(10)); // Throws a TypeError
} catch (error) {
	console.error(error.message);
}
```
*/
function assertUint8Array(value: unknown): asserts value is Uint8Array {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}

/**
Concatenate the given arrays into a new array.

If `arrays` is empty, it will return a zero-sized `Uint8Array`.

If `totalLength` is not specified, it is calculated from summing the lengths of the given arrays.

Replacement for [`Buffer.concat()`](https://nodejs.org/api/buffer.html#static-method-bufferconcatlist-totallength).

@example
```
import {concatUint8Arrays} from 'uint8array-extras';

const a = new Uint8Array([1, 2, 3]);
const b = new Uint8Array([4, 5, 6]);

console.log(concatUint8Arrays([a, b]));
//=> Uint8Array [1, 2, 3, 4, 5, 6]
```
*/
export function concatUint8Arrays(
  arrays: Uint8Array[],
  totalLength?: number,
): Uint8Array {
  if (arrays.length === 0) {
    return new Uint8Array(0);
  }

  totalLength ??= arrays.reduce(
    (accumulator, currentValue) => accumulator + currentValue.length,
    0,
  );

  const returnValue = new Uint8Array(totalLength);

  let offset = 0;
  for (const array of arrays) {
    assertUint8Array(array);
    returnValue.set(array, offset);
    offset += array.length;
  }

  return returnValue;
}

/**
Convert a `Uint8Array` (containing a UTF-8 string) to a string.

Replacement for [`Buffer#toString()`](https://nodejs.org/api/buffer.html#buftostringencoding-start-end).

@example
```
import {uint8ArrayToString} from 'uint8array-extras';

const byteArray = new Uint8Array([72, 101, 108, 108, 111]);

console.log(uint8ArrayToString(byteArray));
//=> 'Hello'
```
*/
export function uint8ArrayToString(array: Uint8Array): string {
  assertUint8Array(array);
  return getCachedTextDecoder().decode(array);
}

function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}

function base64ToBase64Url(base64: string): string {
  return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function base64UrlToBase64(base64url: string): string {
  return base64url.replaceAll("-", "+").replaceAll("_", "/");
}

// Reference: https://phuoc.ng/collection/this-vs-that/concat-vs-push/
const MAX_BLOCK_SIZE = 65_535;

/**
Convert a `Uint8Array` to a Base64-encoded string.

Specify `{urlSafe: true}` to get a [Base64URL](https://base64.guru/standards/base64url)-encoded string.

Replacement for [`Buffer#toString('base64')`](https://nodejs.org/api/buffer.html#buftostringencoding-start-end).

@example
```
import {uint8ArrayToBase64} from 'uint8array-extras';

const byteArray = new Uint8Array([72, 101, 108, 108, 111]);

console.log(uint8ArrayToBase64(byteArray));
//=> 'SGVsbG8='
```
*/
export function uint8ArrayToBase64(
  array: Uint8Array,
  { urlSafe = false } = {},
): string {
  assertUint8Array(array);

  let base64;

  if (array.length < MAX_BLOCK_SIZE) {
    // Required as `btoa` and `atob` don't properly support Unicode: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    // @ts-expect-error - this works fine
    base64 = globalThis.btoa(String.fromCodePoint.apply(this, array));
  } else {
    base64 = "";
    for (const value of array) {
      base64 += String.fromCodePoint(value);
    }

    base64 = globalThis.btoa(base64);
  }

  return urlSafe ? base64ToBase64Url(base64) : base64;
}

/**
Convert a Base64-encoded or [Base64URL](https://base64.guru/standards/base64url)-encoded string to a `Uint8Array`.

Replacement for [`Buffer.from('SGVsbG8=', 'base64')`](https://nodejs.org/api/buffer.html#static-method-bufferfromstring-encoding).

@example
```
import {base64ToUint8Array} from 'uint8array-extras';

console.log(base64ToUint8Array('SGVsbG8='));
//=> Uint8Array [72, 101, 108, 108, 111]
```
*/
export function base64ToUint8Array(base64String: string): Uint8Array {
  assertString(base64String);
  return Uint8Array.from(
    globalThis.atob(base64UrlToBase64(base64String)),
    (x) => x.codePointAt(0) as number,
  );
}

const byteToHexLookupTable = Array.from({ length: 256 }, (_, index) =>
  index.toString(16).padStart(2, "0"),
);

/**
Convert a `Uint8Array` to a Hex string.

Replacement for [`Buffer#toString('hex')`](https://nodejs.org/api/buffer.html#buftostringencoding-start-end).

@example
```
import {uint8ArrayToHex} from 'uint8array-extras';

const byteArray = new Uint8Array([72, 101, 108, 108, 111]);

console.log(uint8ArrayToHex(byteArray));
//=> '48656c6c6f'
```
*/
export function uint8ArrayToHex(array: Uint8Array): string {
  assertUint8Array(array);

  // Concatenating a string is faster than using an array.
  let hexString = "";

  for (let index = 0; index < array.length; index++) {
    hexString += byteToHexLookupTable[array[index]];
  }

  return hexString;
}

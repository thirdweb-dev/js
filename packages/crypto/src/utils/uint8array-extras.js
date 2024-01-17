// taken from: https://github.com/sindresorhus/uint8array-extras
// to make it work across CJS and ESM -> once we're fully ESM we can remove this and instead use the package directly

import { getCachedTextDecoder, getCachedTextEncoder } from "./cache";

const objectToString = Object.prototype.toString;
const uint8ArrayStringified = "[object Uint8Array]";

export function isUint8Array(value) {
  if (!value) {
    return false;
  }

  if (value.constructor === Uint8Array) {
    return true;
  }

  return objectToString.call(value) === uint8ArrayStringified;
}

export function assertUint8Array(value) {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}

export function toUint8Array(value) {
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }

  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }

  throw new TypeError(`Unsupported value, got \`${typeof value}\`.`);
}

export function concatUint8Arrays(arrays, totalLength) {
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

export function areUint8ArraysEqual(a, b) {
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

export function compareUint8Arrays(a, b) {
  assertUint8Array(a);
  assertUint8Array(b);

  const length = Math.min(a.length, b.length);

  for (let index = 0; index < length; index++) {
    if (a[index] < b[index]) {
      return -1;
    }

    if (a[index] > b[index]) {
      return 1;
    }
  }

  // At this point, all the compared elements are equal.
  // The shorter array should come first if the arrays are of different lengths.
  if (a.length > b.length) {
    return 1;
  }

  if (a.length < b.length) {
    return -1;
  }

  return 0;
}

export function uint8ArrayToString(array) {
  assertUint8Array(array);
  return getCachedTextDecoder().decode(array);
}

function assertString(value) {
  if (typeof value !== "string") {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}

export function stringToUint8Array(string) {
  assertString(string);
  return getCachedTextEncoder().encode(string);
}

function base64ToBase64Url(base64) {
  return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function base64UrlToBase64(base64url) {
  return base64url.replaceAll("-", "+").replaceAll("_", "/");
}

// Reference: https://phuoc.ng/collection/this-vs-that/concat-vs-push/
const MAX_BLOCK_SIZE = 65_535;

export function uint8ArrayToBase64(array, { urlSafe = false } = {}) {
  assertUint8Array(array);

  let base64;

  if (array.length < MAX_BLOCK_SIZE) {
    // Required as `btoa` and `atob` don't properly support Unicode: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
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

export function base64ToUint8Array(base64String) {
  assertString(base64String);
  return Uint8Array.from(
    globalThis.atob(base64UrlToBase64(base64String)),
    (x) => x.codePointAt(0),
  );
}

export function stringToBase64(string, { urlSafe = false } = {}) {
  assertString(string);
  return uint8ArrayToBase64(stringToUint8Array(string), { urlSafe });
}

export function base64ToString(base64String) {
  assertString(base64String);
  return uint8ArrayToString(base64ToUint8Array(base64String));
}

const byteToHexLookupTable = Array.from({ length: 256 }, (_, index) =>
  index.toString(16).padStart(2, "0"),
);

export function uint8ArrayToHex(array) {
  assertUint8Array(array);

  // Concatenating a string is faster than using an array.
  let hexString = "";

  for (let index = 0; index < array.length; index++) {
    hexString += byteToHexLookupTable[array[index]];
  }

  return hexString;
}

const hexToDecimalLookupTable = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
};

export function hexToUint8Array(hexString) {
  assertString(hexString);

  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid Hex string length.");
  }

  const resultLength = hexString.length / 2;
  const bytes = new Uint8Array(resultLength);

  for (let index = 0; index < resultLength; index++) {
    const highNibble = hexToDecimalLookupTable[hexString[index * 2]];
    const lowNibble = hexToDecimalLookupTable[hexString[index * 2 + 1]];

    if (highNibble === undefined || lowNibble === undefined) {
      throw new Error(
        `Invalid Hex character encountered at position ${index * 2}`,
      );
    }

    bytes[index] = (highNibble << 4) | lowNibble; // eslint-disable-line no-bitwise
  }

  return bytes;
}

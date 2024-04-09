// ADAPTED FROM https://github.com/merkletreejs/merkletreejs

import { hexToUint8Array, isHex } from "../utils/encoding/hex.js";
import { numberToBytes, stringToBytes } from "../utils/encoding/to-bytes.js";
import { areUint8ArraysEqual, isUint8Array } from "../utils/uint8-array.js";

export class Base {
  /**
   * print
   * @desc Prints out a visual representation of the merkle tree.
   * @example
   *```js
   *tree.print()
   *```
   */
  print(): void {
    Base.print(this);
  }

  /**
   * bufferIndexOf
   * @desc Returns the first index of which given buffer is found in array.
   * @param {Uint8Array[]} haystack - Array of buffers.
   * @param {Uint8Array} needle - Buffer to find.
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.bufferIndexOf(haystack, needle)
   *```
   */
  protected bufferIndexOf(
    array: Uint8Array[],
    element: Uint8Array,
    isSorted = false,
  ): number {
    if (isSorted) {
      return this.binarySearch(array, element, Buffer.compare);
    }

    const eqChecker = (buffer1: Uint8Array, buffer2: Uint8Array) =>
      areUint8ArraysEqual(buffer1, buffer2);
    return this.linearSearch(array, element, eqChecker);
  }

  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.binarySearch(array, element, Buffer.compare)
   *```
   */
  static binarySearch(
    array: Uint8Array[],
    element: Uint8Array,
    compareFunction: (a: Uint8Array, b: Uint8Array) => number,
  ): number {
    let start = 0;
    let end = array.length - 1;

    // Iterate while start not meets end
    while (start <= end) {
      // Find the mid index
      const mid = Math.floor((start + end) / 2);

      // Check if the mid value is greater than, equal to, or less than search element.
      // biome-ignore lint/style/noNonNullAssertion: within bounds
      const ordering = compareFunction(array[mid]!, element);

      // If element is present at mid, start iterating for searching first appearance.
      if (ordering === 0) {
        // Linear reverse iteration until the first matching item index is found.
        for (let i = mid - 1; i >= 0; i--) {
          // biome-ignore lint/style/noNonNullAssertion: within bounds
          if (compareFunction(array[i]!, element) === 0) {
            continue;
          }
          return i + 1;
        }
        return 0;
      } /* Else look in left or right half accordingly */
      if (ordering < 0) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return -1;
  }

  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.binarySearch(array, element, Buffer.compare)
   *```
   */
  binarySearch(
    array: Uint8Array[],
    element: Uint8Array,
    compareFunction: (a: Uint8Array, b: Uint8Array) => number,
  ): number {
    return Base.binarySearch(array, element, compareFunction);
  }

  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  static linearSearch(
    array: Uint8Array[],
    element: Uint8Array,
    eqChecker: (a: Uint8Array, b: Uint8Array) => boolean,
  ): number {
    for (let i = 0; i < array.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: within bounds
      if (eqChecker(array[i]!, element)) {
        return i;
      }
    }

    return -1;
  }

  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Uint8Array[]} array - Array of items.
   * @param {Uint8Array} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  linearSearch(
    array: Uint8Array[],
    element: Uint8Array,
    eqChecker: (a: Uint8Array, b: Uint8Array) => boolean,
  ): number {
    return Base.linearSearch(array, element, eqChecker);
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer|ArrayBuffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = MerkleTree.bufferify('0x1234')
   *```
   */
  static bufferify(
    value: string | number | Uint8Array | ArrayBuffer,
  ): Uint8Array {
    if (!isUint8Array(value)) {
      // crypto-js support
      // TODO REMOVE
      // if (typeof value === "object" && value.words) {
      //   return Uint8Array.from(value.toString(convertWordsToBuffer));
      // } else
      if (isHex(value)) {
        return hexToUint8Array(value);
      }
      if (typeof value === "string") {
        return stringToBytes(value);
      }
      if (typeof value === "bigint" || typeof value === "number") {
        return numberToBytes(value);
      }
      if (ArrayBuffer.isView(value)) {
        return new Uint8Array(value);
      }
      if (value instanceof ArrayBuffer) {
        return new Uint8Array(value);
      }
    }

    return value;
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  static isHexString(v: string): boolean {
    return typeof v === "string" && /^(0x)?[0-9A-Fa-f]*$/.test(v);
  }

  /**
   * print
   * @desc Prints out a visual representation of the given merkle tree.
   * @param {Object} tree - Merkle tree instance.
   * @return {String}
   * @example
   *```js
   *MerkleTree.print(tree)
   *```
   */

  // biome-ignore lint/suspicious/noExplicitAny: debug print
  static print(tree: any): void {
    console.log(tree.toString());
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Uint8Array} value
   * @return {Uint8Array}
   *
   * @example
   * ```js
   *const buf = tree.bufferify('0x1234')
   *```
   */
  bufferify(value: string | number | Uint8Array | ArrayBuffer): Uint8Array {
    return Base.bufferify(value);
  }

  /**
   * bufferifyFn
   * @desc Returns a function that will bufferify the return value.
   * @param {Function}
   * @return {Function}
   *
   * @example
   * ```js
   *const fn = tree.bufferifyFn((value) => sha256(value))
   *```
   */
  // biome-ignore lint/suspicious/noExplicitAny: generic
  bufferifyFn(f: any) {
    // biome-ignore lint/suspicious/noExplicitAny: generic
    return (value: any): any => {
      const v = f(value);
      return this.bufferify(v);
    };
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  protected isHexString(value: string): boolean {
    return Base.isHexString(value);
  }

  /**
   * log2
   * @desc Returns the log2 of number.
   * @param {Number} value
   * @return {Number}
   */
  protected log2(n: number): number {
    return n === 1 ? 0 : 1 + this.log2((n / 2) | 0);
  }

  /**
   * zip
   * @desc Returns true if value is a hex string.
   * @param {String[]|Number[]|Uint8Array[]} a - first array
   * @param {String[]|Number[]|Uint8Array[]} b -  second array
   * @return {String[][]|Number[][]|Uint8Array[][]}
   *
   * @example
   * ```js
   *const zipped = tree.zip(['a', 'b'],['A', 'B'])
   *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
   *```
   */
  // biome-ignore lint/suspicious/noExplicitAny: generic
  protected zip(a: any[], b: any[]): any[][] {
    return a.map((e, i) => [e, b[i]]);
  }
}

export default Base;

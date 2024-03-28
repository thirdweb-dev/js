// ADAPTED FROM https://github.com/merkletreejs/merkletreejs

import { Buffer } from "buffer";

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
   * @param {Buffer[]} haystack - Array of buffers.
   * @param {Buffer} needle - Buffer to find.
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.bufferIndexOf(haystack, needle)
   *```
   */
  protected bufferIndexOf(
    array: Buffer[],
    element: Buffer,
    isSorted: boolean = false,
  ): number {
    if (isSorted) {
      return this.binarySearch(array, element, Buffer.compare);
    }

    const eqChecker = (buffer1: Buffer, buffer2: Buffer) =>
      buffer1.equals(buffer2);
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
    array: Buffer[],
    element: Buffer,
    compareFunction: (a: Buffer, b: Buffer) => number,
  ): number {
    let start = 0;
    let end = array.length - 1;

    // Iterate while start not meets end
    while (start <= end) {
      // Find the mid index
      const mid = Math.floor((start + end) / 2);

      // Check if the mid value is greater than, equal to, or less than search element.
      const ordering = compareFunction(array[mid], element);

      // If element is present at mid, start iterating for searching first appearance.
      if (ordering === 0) {
        // Linear reverse iteration until the first matching item index is found.
        for (let i = mid - 1; i >= 0; i--) {
          if (compareFunction(array[i], element) === 0) {
            continue;
          }
          return i + 1;
        }
        return 0;
      } /* Else look in left or right half accordingly */ else if (
        ordering < 0
      ) {
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
    array: Buffer[],
    element: Buffer,
    compareFunction: (a: Buffer, b: Buffer) => number,
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
    array: Buffer[],
    element: Buffer,
    eqChecker: (a: Buffer, b: Buffer) => boolean,
  ): number {
    for (let i = 0; i < array.length; i++) {
      if (eqChecker(array[i], element)) {
        return i;
      }
    }

    return -1;
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
   *const index = tree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  linearSearch(
    array: Buffer[],
    element: Buffer,
    eqChecker: (a: Buffer, b: Buffer) => boolean,
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
  static bufferify(value: any): Buffer {
    if (!Buffer.isBuffer(value)) {
      // crypto-js support
      if (typeof value === "object" && value.words) {
        return Buffer.from(value.toString(convertWordsToBuffer), "hex");
      } else if (Base.isHexString(value)) {
        return Buffer.from(value.replace(/^0x/, ""), "hex");
      } else if (typeof value === "string") {
        return Buffer.from(value);
      } else if (typeof value === "bigint") {
        return Buffer.from(value.toString(16), "hex");
      } else if (value instanceof Uint8Array) {
        return Buffer.from(value.buffer);
      } else if (typeof value === "number") {
        let s = value.toString();
        if (s.length % 2) {
          s = `0${s}`;
        }
        return Buffer.from(s, "hex");
      } else if (ArrayBuffer.isView(value)) {
        return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
      }
    }

    return value;
  }

  bigNumberify(value: any): bigint {
    return Base.bigNumberify(value);
  }

  static bigNumberify(value: any): bigint {
    if (typeof value === "bigint") {
      return value;
    }

    if (typeof value === "string") {
      if (value.startsWith("0x") && Base.isHexString(value)) {
        return BigInt("0x" + value.replace("0x", "").toString());
      }
      return BigInt(value);
    }

    if (Buffer.isBuffer(value)) {
      return BigInt("0x" + value.toString("hex"));
    }

    if (value instanceof Uint8Array) {
      return uint8ArrayToBigInt(value);
    }

    if (typeof value === "number") {
      return BigInt(value);
    }

    throw new Error("cannot bigNumberify");
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
  static print(tree: any): void {
    console.log(tree.toString());
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = tree.bufferToHex(Buffer.from('A'))
   *```
   */
  bufferToHex(value: Buffer, withPrefix: boolean = true): string {
    return Base.bufferToHex(value, withPrefix);
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = MerkleTree.bufferToHex(Buffer.from('A'))
   *```
   */
  static bufferToHex(value: Buffer, withPrefix: boolean = true): string {
    return `${withPrefix ? "0x" : ""}${(value || Buffer.alloc(0)).toString(
      "hex",
    )}`;
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = tree.bufferify('0x1234')
   *```
   */
  bufferify(value: any): Buffer {
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
  bufferifyFn(f: any): any {
    return (value: any): Buffer => {
      const v = f(value);
      if (Buffer.isBuffer(v)) {
        return v;
      }

      if (this.isHexString(v)) {
        return Buffer.from(v.replace("0x", ""), "hex");
      }

      if (typeof v === "string") {
        return Buffer.from(v);
      }

      if (typeof v === "bigint") {
        return Buffer.from(value.toString(16), "hex");
      }

      if (ArrayBuffer.isView(v)) {
        return Buffer.from(v.buffer, v.byteOffset, v.byteLength);
      }

      // crypto-js support
      const arrayBuffer = hexStringToArrayBuffer(value.toString("hex"));
      // Assuming f now works with ArrayBuffers
      const processedBuffer = f(arrayBuffer);

      const hexResult = arrayBufferToHexString(processedBuffer);

      return Buffer.from(hexResult, "hex");
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
   * @param {String[]|Number[]|Buffer[]} a - first array
   * @param {String[]|Number[]|Buffer[]} b -  second array
   * @return {String[][]|Number[][]|Buffer[][]}
   *
   * @example
   * ```js
   *const zipped = tree.zip(['a', 'b'],['A', 'B'])
   *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
   *```
   */
  protected zip(a: any[], b: any[]): any[][] {
    return a.map((e, i) => [e, b[i]]);
  }

  static hexZeroPad(hexStr: string, length: number) {
    return "0x" + hexStr.replace("0x", "").padStart(length, "0");
  }
}

export default Base;

// UTILS

// replaces CryptoJS.enc.Hex
function convertWordsToBuffer(value: { words: any }) {
  const wordArray = value.words;
  const arrayBuffer = new ArrayBuffer(wordArray.length * 4); // 4 bytes per word
  const uint8View = new Uint8Array(arrayBuffer);

  for (let i = 0; i < wordArray.length; i++) {
    uint8View[i * 4] = (wordArray[i] >> 24) & 0xff;
    uint8View[i * 4 + 1] = (wordArray[i] >> 16) & 0xff;
    uint8View[i * 4 + 2] = (wordArray[i] >> 8) & 0xff;
    uint8View[i * 4 + 3] = wordArray[i] & 0xff;
  }

  return arrayBuffer;
}

function hexStringToArrayBuffer(hexString: string) {
  const buffer = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    buffer[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return buffer.buffer;
}

function arrayBufferToHexString(arrayBuffer: ArrayBuffer) {
  const uint8View = new Uint8Array(arrayBuffer);
  return Array.from(uint8View)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function uint8ArrayToBigInt(u8a: Uint8Array) {
  const hex = Array.from(u8a)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return BigInt(`0x${hex}`);
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
// stripped down version of `js-md5`
// changes:
// - we know we always have ArrayBuffer available
// - we only care about `arrayBuffer` output
// - we want to behave the same regardless of NODE or non NODE env
// - transformed into class
// - typescript

/**
 * [js-md5]{@link https://github.com/emn178/js-md5}
 * @namespace md5
 * @version 0.8.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2023
 * @license MIT
 */

const INPUT_ERROR = "input is invalid type";
const FINALIZE_ERROR = "finalize already called";

const EXTRA = [128, 32768, 8388608, -2147483648];

// [message: string, isString: bool]
function formatMessage(
  message: string | any[] | ArrayBuffer | ArrayLike<number>,
): [string | Uint8Array | Array<any> | ArrayBufferView, boolean] {
  const type = typeof message;
  if (typeof message === "string") {
    return [message, true];
  }
  if (type !== "object" || message === null) {
    throw new Error(INPUT_ERROR);
  }
  if (message instanceof ArrayBuffer) {
    return [new Uint8Array(message), false];
  }
  if (!Array.isArray(message) && !ArrayBuffer.isView(message)) {
    throw new Error(INPUT_ERROR);
  }
  return [message, false];
}

/**
 * Md5 class
 * @class Md5
 * @description This is internal class.
 * @see {@link md5.create}
 */
class Md5 {
  buffer8: Uint8Array;
  blocks: Uint32Array;
  h0: number;
  h1: number;
  h2: number;
  h3: number;
  start: number;
  bytes: number;
  hBytes: number;
  finalized: boolean;
  hashed: boolean;
  first: boolean;
  lastByteIndex: number = 0;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const buffer = new ArrayBuffer(68);
    this.buffer8 = new Uint8Array(buffer);
    this.blocks = new Uint32Array(buffer);

    this.h0 =
      this.h1 =
      this.h2 =
      this.h3 =
      this.start =
      this.bytes =
      this.hBytes =
        0;
    this.finalized = this.hashed = false;
    this.first = true;
  }
  /**
   * @method update
   * @memberof Md5
   * @instance
   * @description Update hash
   * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
   * @returns {Md5} Md5 object.
   * @see {@link md5.update}
   * @internal
   */
  update(inputMessage: string | any[] | ArrayBuffer | ArrayLike<number>): Md5 {
    if (this.finalized) {
      throw new Error(FINALIZE_ERROR);
    }

    const [message, isString] = formatMessage(inputMessage);

    const blocks = this.blocks;
    let length = 0;
    if (ArrayBuffer.isView(message)) {
      length = message.byteLength;
    } else {
      length = message.length;
    }
    let code,
      index = 0,
      i;

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const buffer8 = this.buffer8;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = blocks[16]!;
        blocks[16] =
          blocks[1] =
          blocks[2] =
          blocks[3] =
          blocks[4] =
          blocks[5] =
          blocks[6] =
          blocks[7] =
          blocks[8] =
          blocks[9] =
          blocks[10] =
          blocks[11] =
          blocks[12] =
          blocks[13] =
          blocks[14] =
          blocks[15] =
            0;
      }

      if (isString) {
        for (i = this.start; index < length && i < 64; ++index) {
          code = (message as string).charCodeAt(index);
          if (code < 0x80) {
            buffer8[i++] = code;
          } else if (code < 0x800) {
            buffer8[i++] = 0xc0 | (code >>> 6);
            buffer8[i++] = 0x80 | (code & 0x3f);
          } else if (code < 0xd800 || code >= 0xe000) {
            buffer8[i++] = 0xe0 | (code >>> 12);
            buffer8[i++] = 0x80 | ((code >>> 6) & 0x3f);
            buffer8[i++] = 0x80 | (code & 0x3f);
          } else {
            code =
              0x10000 +
              (((code & 0x3ff) << 10) |
                ((message as string).charCodeAt(++index) & 0x3ff));
            buffer8[i++] = 0xf0 | (code >>> 18);
            buffer8[i++] = 0x80 | ((code >>> 12) & 0x3f);
            buffer8[i++] = 0x80 | ((code >>> 6) & 0x3f);
            buffer8[i++] = 0x80 | (code & 0x3f);
          }
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          // at this point we know it's not a string
          buffer8[i++] = (message as any)[index];
        }
      }
      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += (this.bytes / 4294967296) << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  }
  finalize() {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const blocks = this.blocks,
      i = this.lastByteIndex;
    blocks[i >>> 2] |= EXTRA[i & 3]!;
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = blocks[16]!;
      blocks[16] =
        blocks[1] =
        blocks[2] =
        blocks[3] =
        blocks[4] =
        blocks[5] =
        blocks[6] =
        blocks[7] =
        blocks[8] =
        blocks[9] =
        blocks[10] =
        blocks[11] =
        blocks[12] =
        blocks[13] =
        blocks[14] =
        blocks[15] =
          0;
    }
    blocks[14] = this.bytes << 3;
    blocks[15] = (this.hBytes << 3) | (this.bytes >>> 29);
    this.hash();
  }
  hash() {
    const blocks = this.blocks;
    let a, b, c, d, bc, da;

    if (this.first) {
      a = blocks[0]! - 680876937;
      a = (((a << 7) | (a >>> 25)) - 271733879) << 0;
      d = (-1732584194 ^ (a & 2004318071)) + blocks[1]! - 117830708;
      d = (((d << 12) | (d >>> 20)) + a) << 0;
      c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2]! - 1126478375;
      c = (((c << 17) | (c >>> 15)) + d) << 0;
      b = (a ^ (c & (d ^ a))) + blocks[3]! - 1316259209;
      b = (((b << 22) | (b >>> 10)) + c) << 0;
    } else {
      a = this.h0;
      b = this.h1;
      c = this.h2;
      d = this.h3;
      a += (d ^ (b & (c ^ d))) + blocks[0]! - 680876936;
      a = (((a << 7) | (a >>> 25)) + b) << 0;
      d += (c ^ (a & (b ^ c))) + blocks[1]! - 389564586;
      d = (((d << 12) | (d >>> 20)) + a) << 0;
      c += (b ^ (d & (a ^ b))) + blocks[2]! + 606105819;
      c = (((c << 17) | (c >>> 15)) + d) << 0;
      b += (a ^ (c & (d ^ a))) + blocks[3]! - 1044525330;
      b = (((b << 22) | (b >>> 10)) + c) << 0;
    }

    a += (d ^ (b & (c ^ d))) + blocks[4]! - 176418897;
    a = (((a << 7) | (a >>> 25)) + b) << 0;
    d += (c ^ (a & (b ^ c))) + blocks[5]! + 1200080426;
    d = (((d << 12) | (d >>> 20)) + a) << 0;
    c += (b ^ (d & (a ^ b))) + blocks[6]! - 1473231341;
    c = (((c << 17) | (c >>> 15)) + d) << 0;
    b += (a ^ (c & (d ^ a))) + blocks[7]! - 45705983;
    b = (((b << 22) | (b >>> 10)) + c) << 0;
    a += (d ^ (b & (c ^ d))) + blocks[8]! + 1770035416;
    a = (((a << 7) | (a >>> 25)) + b) << 0;
    d += (c ^ (a & (b ^ c))) + blocks[9]! - 1958414417;
    d = (((d << 12) | (d >>> 20)) + a) << 0;
    c += (b ^ (d & (a ^ b))) + blocks[10]! - 42063;
    c = (((c << 17) | (c >>> 15)) + d) << 0;
    b += (a ^ (c & (d ^ a))) + blocks[11]! - 1990404162;
    b = (((b << 22) | (b >>> 10)) + c) << 0;
    a += (d ^ (b & (c ^ d))) + blocks[12]! + 1804603682;
    a = (((a << 7) | (a >>> 25)) + b) << 0;
    d += (c ^ (a & (b ^ c))) + blocks[13]! - 40341101;
    d = (((d << 12) | (d >>> 20)) + a) << 0;
    c += (b ^ (d & (a ^ b))) + blocks[14]! - 1502002290;
    c = (((c << 17) | (c >>> 15)) + d) << 0;
    b += (a ^ (c & (d ^ a))) + blocks[15]! + 1236535329;
    b = (((b << 22) | (b >>> 10)) + c) << 0;
    a += (c ^ (d & (b ^ c))) + blocks[1]! - 165796510;
    a = (((a << 5) | (a >>> 27)) + b) << 0;
    d += (b ^ (c & (a ^ b))) + blocks[6]! - 1069501632;
    d = (((d << 9) | (d >>> 23)) + a) << 0;
    c += (a ^ (b & (d ^ a))) + blocks[11]! + 643717713;
    c = (((c << 14) | (c >>> 18)) + d) << 0;
    b += (d ^ (a & (c ^ d))) + blocks[0]! - 373897302;
    b = (((b << 20) | (b >>> 12)) + c) << 0;
    a += (c ^ (d & (b ^ c))) + blocks[5]! - 701558691;
    a = (((a << 5) | (a >>> 27)) + b) << 0;
    d += (b ^ (c & (a ^ b))) + blocks[10]! + 38016083;
    d = (((d << 9) | (d >>> 23)) + a) << 0;
    c += (a ^ (b & (d ^ a))) + blocks[15]! - 660478335;
    c = (((c << 14) | (c >>> 18)) + d) << 0;
    b += (d ^ (a & (c ^ d))) + blocks[4]! - 405537848;
    b = (((b << 20) | (b >>> 12)) + c) << 0;
    a += (c ^ (d & (b ^ c))) + blocks[9]! + 568446438;
    a = (((a << 5) | (a >>> 27)) + b) << 0;
    d += (b ^ (c & (a ^ b))) + blocks[14]! - 1019803690;
    d = (((d << 9) | (d >>> 23)) + a) << 0;
    c += (a ^ (b & (d ^ a))) + blocks[3]! - 187363961;
    c = (((c << 14) | (c >>> 18)) + d) << 0;
    b += (d ^ (a & (c ^ d))) + blocks[8]! + 1163531501;
    b = (((b << 20) | (b >>> 12)) + c) << 0;
    a += (c ^ (d & (b ^ c))) + blocks[13]! - 1444681467;
    a = (((a << 5) | (a >>> 27)) + b) << 0;
    d += (b ^ (c & (a ^ b))) + blocks[2]! - 51403784;
    d = (((d << 9) | (d >>> 23)) + a) << 0;
    c += (a ^ (b & (d ^ a))) + blocks[7]! + 1735328473;
    c = (((c << 14) | (c >>> 18)) + d) << 0;
    b += (d ^ (a & (c ^ d))) + blocks[12]! - 1926607734;
    b = (((b << 20) | (b >>> 12)) + c) << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[5]! - 378558;
    a = (((a << 4) | (a >>> 28)) + b) << 0;
    d += (bc ^ a) + blocks[8]! - 2022574463;
    d = (((d << 11) | (d >>> 21)) + a) << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[11]! + 1839030562;
    c = (((c << 16) | (c >>> 16)) + d) << 0;
    b += (da ^ c) + blocks[14]! - 35309556;
    b = (((b << 23) | (b >>> 9)) + c) << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[1]! - 1530992060;
    a = (((a << 4) | (a >>> 28)) + b) << 0;
    d += (bc ^ a) + blocks[4]! + 1272893353;
    d = (((d << 11) | (d >>> 21)) + a) << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[7]! - 155497632;
    c = (((c << 16) | (c >>> 16)) + d) << 0;
    b += (da ^ c) + blocks[10]! - 1094730640;
    b = (((b << 23) | (b >>> 9)) + c) << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[13]! + 681279174;
    a = (((a << 4) | (a >>> 28)) + b) << 0;
    d += (bc ^ a) + blocks[0]! - 358537222;
    d = (((d << 11) | (d >>> 21)) + a) << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[3]! - 722521979;
    c = (((c << 16) | (c >>> 16)) + d) << 0;
    b += (da ^ c) + blocks[6]! + 76029189;
    b = (((b << 23) | (b >>> 9)) + c) << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[9]! - 640364487;
    a = (((a << 4) | (a >>> 28)) + b) << 0;
    d += (bc ^ a) + blocks[12]! - 421815835;
    d = (((d << 11) | (d >>> 21)) + a) << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[15]! + 530742520;
    c = (((c << 16) | (c >>> 16)) + d) << 0;
    b += (da ^ c) + blocks[2]! - 995338651;
    b = (((b << 23) | (b >>> 9)) + c) << 0;
    a += (c ^ (b | ~d)) + blocks[0]! - 198630844;
    a = (((a << 6) | (a >>> 26)) + b) << 0;
    d += (b ^ (a | ~c)) + blocks[7]! + 1126891415;
    d = (((d << 10) | (d >>> 22)) + a) << 0;
    c += (a ^ (d | ~b)) + blocks[14]! - 1416354905;
    c = (((c << 15) | (c >>> 17)) + d) << 0;
    b += (d ^ (c | ~a)) + blocks[5]! - 57434055;
    b = (((b << 21) | (b >>> 11)) + c) << 0;
    a += (c ^ (b | ~d)) + blocks[12]! + 1700485571;
    a = (((a << 6) | (a >>> 26)) + b) << 0;
    d += (b ^ (a | ~c)) + blocks[3]! - 1894986606;
    d = (((d << 10) | (d >>> 22)) + a) << 0;
    c += (a ^ (d | ~b)) + blocks[10]! - 1051523;
    c = (((c << 15) | (c >>> 17)) + d) << 0;
    b += (d ^ (c | ~a)) + blocks[1]! - 2054922799;
    b = (((b << 21) | (b >>> 11)) + c) << 0;
    a += (c ^ (b | ~d)) + blocks[8]! + 1873313359;
    a = (((a << 6) | (a >>> 26)) + b) << 0;
    d += (b ^ (a | ~c)) + blocks[15]! - 30611744;
    d = (((d << 10) | (d >>> 22)) + a) << 0;
    c += (a ^ (d | ~b)) + blocks[6]! - 1560198380;
    c = (((c << 15) | (c >>> 17)) + d) << 0;
    b += (d ^ (c | ~a)) + blocks[13]! + 1309151649;
    b = (((b << 21) | (b >>> 11)) + c) << 0;
    a += (c ^ (b | ~d)) + blocks[4]! - 145523070;
    a = (((a << 6) | (a >>> 26)) + b) << 0;
    d += (b ^ (a | ~c)) + blocks[11]! - 1120210379;
    d = (((d << 10) | (d >>> 22)) + a) << 0;
    c += (a ^ (d | ~b)) + blocks[2]! + 718787259;
    c = (((c << 15) | (c >>> 17)) + d) << 0;
    b += (d ^ (c | ~a)) + blocks[9]! - 343485551;
    b = (((b << 21) | (b >>> 11)) + c) << 0;

    if (this.first) {
      this.h0 = (a + 1732584193) << 0;
      this.h1 = (b - 271733879) << 0;
      this.h2 = (c - 1732584194) << 0;
      this.h3 = (d + 271733878) << 0;
      this.first = false;
    } else {
      this.h0 = (this.h0 + a) << 0;
      this.h1 = (this.h1 + b) << 0;
      this.h2 = (this.h2 + c) << 0;
      this.h3 = (this.h3 + d) << 0;
    }
  }

  /**
   * @method arrayBuffer
   * @memberof Md5
   * @instance
   * @description Output hash as ArrayBuffer
   * @returns {ArrayBuffer} ArrayBuffer
   * @see {@link md5.arrayBuffer}
   * @example
   * hash.arrayBuffer();
   * @internal
   */
  arrayBuffer(): ArrayBuffer {
    this.finalize();

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const buffer = new ArrayBuffer(16);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const blocks = new Uint32Array(buffer);
    blocks[0] = this.h0;
    blocks[1] = this.h1;
    blocks[2] = this.h2;
    blocks[3] = this.h3;
    return buffer;
  }
}

/**
 * @internal
 */
export function arrayBuffer(uint8Arr: Uint8Array) {
  const md5 = new Md5();
  md5.update(uint8Arr);
  return md5.arrayBuffer();
}

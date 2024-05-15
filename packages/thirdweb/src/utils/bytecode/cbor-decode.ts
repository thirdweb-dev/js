// original source: https://github.com/kriszyp/cbor-x/blob/master/decode.js
// heavily modified to remove all non-essential code

// TODO: re-enable typescript and properly type this

// @ts-nocheck

let src;
let srcEnd;
let position = 0;

const EMPTY_ARRAY = [];

let strings = EMPTY_ARRAY;

let stringPosition = 0;
let currentDecoder = {};
let currentStructures;
let srcString;
const srcStringStart = 0;
let srcStringEnd = 0;
let bundledStrings;
let referenceMap;
const currentExtensions = [];

let packedValues;

let dataView;

const defaultOptions = {
  useRecords: false,
  mapsAsObjects: true,
};

class Decoder {
  constructor() {
    Object.assign(this, defaultOptions);
  }

  decodeKey(key) {
    return key;
  }

  decode(source, end? = -1) {
    srcEnd = end > -1 ? end : source.length;
    position = 0;
    stringPosition = 0;
    srcStringEnd = 0;
    srcString = null;
    strings = EMPTY_ARRAY;
    bundledStrings = null;
    src = source;
    // this provides cached access to the data view for a buffer if it is getting reused, which is a recommend
    // technique for getting data from a database where it can be copied into an existing buffer instead of creating
    // new ones
    try {
      dataView =
        source.dataView ||
        (source.dataView = new DataView(
          source.buffer,
          source.byteOffset,
          source.byteLength,
        ));
    } catch (error) {
      // if it doesn't have a buffer, maybe it is the wrong type of object
      src = null;
      if (source instanceof Uint8Array) {
        throw error;
      }
      throw new Error(
        `Source must be a Uint8Array or Buffer but was a ${source && typeof source === "object"
            ? source.constructor.name
            : typeof source}`,
      );
    }
    if (this instanceof Decoder) {
      currentDecoder = this;
      packedValues =
        this.sharedValues &&
        (this.pack
          ? new Array(this.maxPrivatePackedValues || 16).concat(
              this.sharedValues,
            )
          : this.sharedValues);
      if (!currentStructures || currentStructures.length > 0) {
        currentStructures = [];
      }
    } else {
      currentDecoder = defaultOptions;
      if (!currentStructures || currentStructures.length > 0) {
        currentStructures = [];
      }
      packedValues = null;
    }
    return checkedRead();
  }
}

function checkedRead() {
  try {
    const result = read();
    if (bundledStrings) {
      if (position >= bundledStrings.postBundlePosition) {
        const error = new Error("Unexpected bundle position");
        error.incomplete = true;
        throw error;
      }
      // bundled strings to skip past
      position = bundledStrings.postBundlePosition;
      bundledStrings = null;
    }

    if (position === srcEnd) {
      // finished reading this source, cleanup references
      currentStructures = null;
      src = null;
      if (referenceMap) {
        referenceMap = null;
      }
    } else if (position > srcEnd) {
      // over read
      const error = new Error("Unexpected end of CBOR data");
      error.incomplete = true;
      throw error;
    } else {
      throw new Error("Data read, but end of buffer not reached");
    }
    // else more to read, but we are reading sequentially, so don't clear source yet
    return result;
  } catch (error) {
    clearSource();
    if (
      error instanceof RangeError ||
      error.message.startsWith("Unexpected end of buffer")
    ) {
      error.incomplete = true;
    }
    throw error;
  }
}

function read() {
  let token = src[position++];
  const majorType = token >> 5;
  token = token & 0x1f;
  if (token > 0x17) {
    switch (token) {
      case 0x18:
        token = src[position++];
        break;

      default:
        throw new Error(`Unknown token ${token}`);
    }
  }
  switch (majorType) {
    case 0: // positive int
      return token;
    case 1: // negative int
      return ~token;
    case 2: // buffer
      return readBin(token);
    case 3: // string
      if (srcStringEnd >= position) {
        return srcString.slice(
          position - srcStringStart,
          (position += token) - srcStringStart,
        );
      }
      if (srcStringEnd === 0 && srcEnd < 140 && token < 32) {
        // for small blocks, avoiding the overhead of the extract call is helpful
        const string =
          token < 16 ? shortStringInJS(token) : longStringInJS(token);
        if (string !== null) {
          return string;
        }
      }
      return readFixedString(token);
    case 4: { // array
      const array = new Array(token);
      for (let i = 0; i < token; i++) {
        array[i] = read();
      }
      return array;
    }

    case 5: { // map
      const object = {};
      for (let i = 0; i < token; i++) {
        object[safeKey(read())] = read();
      }
      return object;
    }
    default: // negative int
      if (Number.isNaN(token)) {
        const error = new Error("Unexpected end of CBOR data");
        error.incomplete = true;
        throw error;
      }
      throw new Error(`Unknown CBOR token ${token}`);
  }
}

function safeKey(key) {
  // protect against prototype pollution
  if (typeof key === "string") {
    return key === "__proto__" ? "__proto_" : key;
  }
  if (typeof key !== "object") {
    return key.toString();
  }
  // protect against expensive (DoS) string conversions
  throw new Error(`Invalid property name type ${typeof key}`);
}

const fromCharCode = String.fromCharCode;
function longStringInJS(length) {
  const start = position;
  const bytes = new Array(length);
  for (let i = 0; i < length; i++) {
    const byte = src[position++];
    if ((byte & 0x80) > 0) {
      position = start;
      return;
    }
    bytes[i] = byte;
  }
  return fromCharCode.apply(String, bytes);
}
function shortStringInJS(length) {
  if (length < 4) {
    if (length < 2) {
      if (length === 0) {
        return "";
      }
        const a = src[position++];
        if ((a & 0x80) > 1) {
          position -= 1;
          return;
        }
        return fromCharCode(a);
    }
      const a = src[position++];
      const b = src[position++];
      if ((a & 0x80) > 0 || (b & 0x80) > 0) {
        position -= 2;
        return;
      }
      if (length < 3) {
        return fromCharCode(a, b);
      }
      const c = src[position++];
      if ((c & 0x80) > 0) {
        position -= 3;
        return;
      }
      return fromCharCode(a, b, c);
  }
    const a = src[position++];
    const b = src[position++];
    const c = src[position++];
    const d = src[position++];
    if ((a & 0x80) > 0 || (b & 0x80) > 0 || (c & 0x80) > 0 || (d & 0x80) > 0) {
      position -= 4;
      return;
    }
    if (length < 6) {
      if (length === 4) {
        return fromCharCode(a, b, c, d);
      }
        const e = src[position++];
        if ((e & 0x80) > 0) {
          position -= 5;
          return;
        }
        return fromCharCode(a, b, c, d, e);
    }if (length < 8) {
      const e = src[position++];
      const f = src[position++];
      if ((e & 0x80) > 0 || (f & 0x80) > 0) {
        position -= 6;
        return;
      }
      if (length < 7) {
        return fromCharCode(a, b, c, d, e, f);
      }
      const g = src[position++];
      if ((g & 0x80) > 0) {
        position -= 7;
        return;
      }
      return fromCharCode(a, b, c, d, e, f, g);
    }
      const e = src[position++];
      const f = src[position++];
      const g = src[position++];
      const h = src[position++];
      if (
        (e & 0x80) > 0 ||
        (f & 0x80) > 0 ||
        (g & 0x80) > 0 ||
        (h & 0x80) > 0
      ) {
        position -= 8;
        return;
      }
      if (length < 10) {
        if (length === 8) {
          return fromCharCode(a, b, c, d, e, f, g, h);
        }
          const i = src[position++];
          if ((i & 0x80) > 0) {
            position -= 9;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i);
      }if (length < 12) {
        const i = src[position++];
        const j = src[position++];
        if ((i & 0x80) > 0 || (j & 0x80) > 0) {
          position -= 10;
          return;
        }
        if (length < 11) {
          return fromCharCode(a, b, c, d, e, f, g, h, i, j);
        }
        const k = src[position++];
        if ((k & 0x80) > 0) {
          position -= 11;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
      }
        const i = src[position++];
        const j = src[position++];
        const k = src[position++];
        const l = src[position++];
        if (
          (i & 0x80) > 0 ||
          (j & 0x80) > 0 ||
          (k & 0x80) > 0 ||
          (l & 0x80) > 0
        ) {
          position -= 12;
          return;
        }
        if (length < 14) {
          if (length === 12) {
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
          }
            const m = src[position++];
            if ((m & 0x80) > 0) {
              position -= 13;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
        }
          const m = src[position++];
          const n = src[position++];
          if ((m & 0x80) > 0 || (n & 0x80) > 0) {
            position -= 14;
            return;
          }
          if (length < 15) {
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
          }
          const o = src[position++];
          if ((o & 0x80) > 0) {
            position -= 15;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
}

function readBin(length) {
  return currentDecoder.copyBuffers
    ? // specifically use the copying slice (not the node one)
      Uint8Array.prototype.slice.call(src, position, (position += length))
    : src.subarray(position, (position += length));
}

const glbl = { Error, RegExp };
currentExtensions[27] = (data) => {
  // http://cbor.schmorp.de/generic-object
  return (glbl[data[0]] || Error)(data[1], data[2]);
};
const packedTable = (read_) => {
  if (src[position++] !== 0x84) {
    const error = new Error(
      "Packed values structure must be followed by a 4 element array",
    );
    if (src.length < position) {
      error.incomplete = true;
    }
    throw error;
  }
  const newPackedValues = read_(); // packed values
  if (!newPackedValues || !newPackedValues.length) {
    const error = new Error(
      "Packed values structure must be followed by a 4 element array",
    );
    error.incomplete = true;
    throw error;
  }
  packedValues = packedValues
    ? newPackedValues.concat(packedValues.slice(newPackedValues.length))
    : newPackedValues;
  packedValues.prefixes = read_();
  packedValues.suffixes = read_();
  return read_(); // read the rump
};
packedTable.handlesRead = true;

currentExtensions[28] = (read_) => {
  // shareable http://cbor.schmorp.de/value-sharing (for structured clones)
  if (!referenceMap) {
    referenceMap = new Map();
    referenceMap.id = 0;
  }
  const id = referenceMap.id++;
  const token = src[position];
  let target;
  // TODO: handle Maps, Sets, and other types that can cycle; this is complicated, because you potentially need to read
  // ahead past references to record structure definitions
  if (token >> 5 === 4) {
    target = [];
  } else {
    target = {};
  }

  const refEntry = { target }; // a placeholder object
  referenceMap.set(id, refEntry);
  const targetProperties = read_(); // read the next value as the target object to id
  if (refEntry.used) {
    // there is a cycle, so we have to assign properties to original target
    return Object.assign(target, targetProperties);
  }
  refEntry.target = targetProperties; // the placeholder wasn't used, replace with the deserialized one
  return targetProperties; // no cycle, can just use the returned read object
};

function clearSource() {
  src = null;
  referenceMap = null;
  currentStructures = null;
}

const mult10 = new Array(147); // this is a table matching binary exponents to the multiplier to determine significant digit rounding
for (let i = 0; i < 256; i++) {
  mult10[i] = /* @__PURE__ */ (() =>
    Number(`1e${Math.floor(45.15 - i * 0.30103)}`))();
}
const defaultDecoder = new Decoder();
export const decode = defaultDecoder.decode;

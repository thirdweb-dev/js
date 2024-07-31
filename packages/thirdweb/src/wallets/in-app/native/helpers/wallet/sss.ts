// @ts-nocheck - TODO typescript-ify this file
// ported from https://github.com/34r7h/secrets.js/blob/master/secrets.js
// with minimal changes to only allow using our own randomBytesBuffer function
import { randomBytesBuffer } from "../../../../../utils/random.js";

var defaults, config, preGenPadding, runCSPRNGTest, CSPRNGTypes;

function reset() {
  defaults = {
    bits: 8, // default number of bits
    radix: 16, // work with HEX by default
    minBits: 3,
    maxBits: 20, // this permits 1,048,575 shares, though going this high is NOT recommended in JS!
    bytesPerChar: 2,
    maxBytesPerChar: 6, // Math.pow(256,7) > Math.pow(2,53)

    // Primitive polynomials (in decimal form) for Galois Fields GF(2^n), for 2 <= n <= 30
    // The index of each term in the array corresponds to the n for that polynomial
    // i.e. to get the polynomial for n=16, use primitivePolynomials[16]
    primitivePolynomials: [
      null,
      null,
      1,
      3,
      3,
      5,
      3,
      3,
      29,
      17,
      9,
      5,
      83,
      27,
      43,
      3,
      45,
      9,
      39,
      39,
      9,
      5,
      3,
      33,
      27,
      9,
      71,
      39,
      9,
      5,
      83,
    ],
  };
  config = {};
  preGenPadding = new Array(1024).join("0"); // Pre-generate a string of 1024 0's for use by padLeft().
  runCSPRNGTest = true;

  // WARNING : Never use 'testRandom' except for testing.
  CSPRNGTypes = [
    "nodeCryptoRandomBytes",
    "browserCryptoGetRandomValues",
    "testRandom",
  ];
}

function isSetRNG() {
  if (config && config.rng && typeof config.rng === "function") {
    return true;
  }

  return false;
}

// Pads a string `str` with zeros on the left so that its length is a multiple of `bits`
function padLeft(str, multipleOfBits) {
  var missing;

  if (multipleOfBits === 0 || multipleOfBits === 1) {
    return str;
  }

  if (multipleOfBits && multipleOfBits > 1024) {
    throw new Error("Padding must be multiples of no larger than 1024 bits.");
  }

  multipleOfBits = multipleOfBits || config.bits;

  if (str) {
    missing = str.length % multipleOfBits;
  }

  if (missing) {
    return (preGenPadding + str).slice(
      -(multipleOfBits - missing + str.length),
    );
  }

  return str;
}

function hex2bin(str) {
  var bin = "",
    num,
    i;

  for (i = str.length - 1; i >= 0; i--) {
    num = Number.parseInt(str[i], 16);

    if (isNaN(num)) {
      throw new Error("Invalid hex character.");
    }

    bin = padLeft(num.toString(2), 4) + bin;
  }
  return bin;
}

function bin2hex(str) {
  var hex = "",
    num,
    i;

  str = padLeft(str, 4);

  for (i = str.length; i >= 4; i -= 4) {
    num = Number.parseInt(str.slice(i - 4, i), 2);
    if (isNaN(num)) {
      throw new Error("Invalid binary character.");
    }
    hex = num.toString(16) + hex;
  }

  return hex;
}

// Returns a pseudo-random number generator of the form function(bits){}
// which should output a random string of 1's and 0's of length `bits`.
// `type` (Optional) : A string representing the CSPRNG that you want to
// force to be loaded, overriding feature detection. Can be one of:
//    "nodeCryptoRandomBytes"
//    "browserCryptoGetRandomValues"
//
function getRNG(type) {
  function construct(bits, arr, radix, size) {
    var i = 0,
      len,
      str = "",
      parsedInt;

    if (arr) {
      len = arr.length - 1;
    }

    while (i < len || str.length < bits) {
      // convert any negative nums to positive with Math.abs()
      parsedInt = Math.abs(Number.parseInt(arr[i], radix));
      str = str + padLeft(parsedInt.toString(2), size);
      i++;
    }

    str = str.substr(-bits);

    // return null so this result can be re-processed if the result is all 0's.
    if ((str.match(/0/g) || []).length === str.length) {
      return null;
    }

    return str;
  }

  // Node.js : crypto.randomBytes()
  // Note : Node.js and crypto.randomBytes() uses the OpenSSL RAND_bytes() function for its CSPRNG.
  //        Node.js will need to have been compiled with OpenSSL for this to work.
  // See : https://github.com/joyent/node/blob/d8baf8a2a4481940bfed0196308ae6189ca18eee/src/node_crypto.cc#L4696
  // See : https://www.openssl.org/docs/crypto/rand.html
  function nodeCryptoRandomBytes(bits) {
    var buf,
      bytes,
      radix,
      size,
      str = null;

    radix = 16;
    size = 4;
    bytes = Math.ceil(bits / 8);

    while (str === null) {
      buf = crypto.randomBytes(bytes);
      str = construct(bits, buf.toString("hex"), radix, size);
    }

    return str;
  }

  // Browser : crypto.getRandomValues()
  // See : https://dvcs.w3.org/hg/webcrypto-api/raw-file/tip/spec/Overview.html#dfn-Crypto
  // See : https://developer.mozilla.org/en-US/docs/Web/API/RandomSource/getRandomValues
  // Supported Browsers : http://caniuse.com/#search=crypto.getRandomValues
  function browserCryptoGetRandomValues(bits) {
    var elems,
      radix,
      size,
      str = null;

    radix = 10;
    size = 32;
    elems = Math.ceil(bits / 32);
    while (str === null) {
      str = construct(
        bits,
        randomBytesBuffer(elems),
        radix,
        size,
      );
    }

    return str;
  }
  // Return a random generator function for browsers that support
  // crypto.getRandomValues() or Node.js compiled with OpenSSL support.
  // WARNING : NEVER use testRandom outside of a testing context. Totally non-random!
  config.typeCSPRNG = "browserCryptoGetRandomValues";
  return browserCryptoGetRandomValues;
}

// Splits a number string `bits`-length segments, after first
// optionally zero-padding it to a length that is a multiple of `padLength.
// Returns array of integers (each less than 2^bits-1), with each element
// representing a `bits`-length segment of the input string from right to left,
// i.e. parts[0] represents the right-most `bits`-length segment of the input string.
function splitNumStringToIntArray(str, padLength) {
  var parts = [],
    i;

  if (padLength) {
    str = padLeft(str, padLength);
  }

  for (i = str.length; i > config.bits; i -= config.bits) {
    parts.push(Number.parseInt(str.slice(i - config.bits, i), 2));
  }

  parts.push(Number.parseInt(str.slice(0, i), 2));

  return parts;
}

// Polynomial evaluation at `x` using Horner's Method
// NOTE: fx=fx * x + coeff[i] ->  exp(log(fx) + log(x)) + coeff[i],
//       so if fx===0, just set fx to coeff[i] because
//       using the exp/log form will result in incorrect value
function horner(x, coeffs) {
  var logx = config.logs[x],
    fx = 0,
    i;

  for (i = coeffs.length - 1; i >= 0; i--) {
    if (fx !== 0) {
      fx = config.exps[(logx + config.logs[fx]) % config.maxShares] ^ coeffs[i];
    } else {
      fx = coeffs[i];
    }
  }

  return fx;
}

// Evaluate the Lagrange interpolation polynomial at x = `at`
// using x and y Arrays that are of the same length, with
// corresponding elements constituting points on the polynomial.
function lagrange(at, x, y) {
  var sum = 0,
    len,
    product,
    i,
    j;

  for (i = 0, len = x.length; i < len; i++) {
    if (y[i]) {
      product = config.logs[y[i]];

      for (j = 0; j < len; j++) {
        if (i !== j) {
          if (at === x[j]) {
            // happens when computing a share that is in the list of shares used to compute it
            product = -1; // fix for a zero product term, after which the sum should be sum^0 = sum, not sum^1
            break;
          }
          product =
            (product +
              config.logs[at ^ x[j]] -
              config.logs[x[i] ^ x[j]] +
              config.maxShares) %
            config.maxShares; // to make sure it's not negative
        }
      }

      // though exps[-1] === undefined and undefined ^ anything = anything in
      // chrome, this behavior may not hold everywhere, so do the check
      sum = product === -1 ? sum : sum ^ config.exps[product];
    }
  }

  return sum;
}

// This is the basic polynomial generation and evaluation function
// for a `config.bits`-length secret (NOT an arbitrary length)
// Note: no error-checking at this stage! If `secret` is NOT
// a NUMBER less than 2^bits-1, the output will be incorrect!
function getShares(secret, numShares, threshold) {
  var shares = [],
    coeffs = [secret],
    i,
    len;

  for (i = 1; i < threshold; i++) {
    coeffs[i] = Number.parseInt(config.rng(config.bits), 2);
  }

  for (i = 1, len = numShares + 1; i < len; i++) {
    shares[i - 1] = {
      x: i,
      y: horner(i, coeffs),
    };
  }

  return shares;
}

function constructPublicShareString(bits, id, data) {
  var bitsBase36, idHex, idMax, idPaddingLen, newShareString;

  id = Number.parseInt(id, config.radix);
  bits = Number.parseInt(bits, 10) || config.bits;
  bitsBase36 = bits.toString(36).toUpperCase();
  idMax = Math.pow(2, bits) - 1;
  idPaddingLen = idMax.toString(config.radix).length;
  idHex = padLeft(id.toString(config.radix), idPaddingLen);

  if (typeof id !== "number" || id % 1 !== 0 || id < 1 || id > idMax) {
    throw new Error(
      "Share id must be an integer between 1 and " + idMax + ", inclusive.",
    );
  }

  newShareString = bitsBase36 + idHex + data;

  return newShareString;
}

// EXPORTED FUNCTIONS
// //////////////////

export const secrets = {
  init: function (bits, rngType) {
    var logs = [],
      exps = [],
      x = 1,
      primitive,
      i;

    // reset all config back to initial state
    reset();

    if (
      bits &&
      (typeof bits !== "number" ||
        bits % 1 !== 0 ||
        bits < defaults.minBits ||
        bits > defaults.maxBits)
    ) {
      throw new Error(
        "Number of bits must be an integer between " +
          defaults.minBits +
          " and " +
          defaults.maxBits +
          ", inclusive.",
      );
    }

    if (rngType && CSPRNGTypes.indexOf(rngType) === -1) {
      throw new Error("Invalid RNG type argument : '" + rngType + "'");
    }

    config.radix = defaults.radix;
    config.bits = bits || defaults.bits;
    config.size = Math.pow(2, config.bits);
    config.maxShares = config.size - 1;

    // Construct the exp and log tables for multiplication.
    primitive = defaults.primitivePolynomials[config.bits];

    for (i = 0; i < config.size; i++) {
      exps[i] = x;
      logs[x] = i;
      x = x << 1; // Left shift assignment
      if (x >= config.size) {
        x = x ^ primitive; // Bitwise XOR assignment
        x = x & config.maxShares; // Bitwise AND assignment
      }
    }

    config.logs = logs;
    config.exps = exps;

    if (rngType) {
      this.setRNG(rngType);
    }

    if (!isSetRNG()) {
      this.setRNG();
    }

    if (
      !isSetRNG() ||
      !config.bits ||
      !config.size ||
      !config.maxShares ||
      !config.logs ||
      !config.exps ||
      config.logs.length !== config.size ||
      config.exps.length !== config.size
    ) {
      throw new Error("Initialization failed.");
    }
  },

  // Evaluates the Lagrange interpolation polynomial at x=`at` for
  // individual config.bits-length segments of each share in the `shares`
  // Array. Each share is expressed in base `inputRadix`. The output
  // is expressed in base `outputRadix'.
  combine: function (shares, at) {
    var i,
      j,
      len,
      len2,
      result = "",
      setBits,
      share,
      splitShare,
      x = [],
      y = [];

    at = at || 0;

    for (i = 0, len = shares.length; i < len; i++) {
      share = this.extractShareComponents(shares[i]);

      // All shares must have the same bits settings.
      if (setBits === undefined) {
        setBits = share.bits;
      } else if (share.bits !== setBits) {
        throw new Error("Mismatched shares: Different bit settings.");
      }

      // Reset everything to the bit settings of the shares.
      if (config.bits !== setBits) {
        this.init(setBits);
      }

      // Proceed if this share.id is not already in the Array 'x' and
      // then split each share's hex data into an Array of Integers,
      // then 'rotate' those arrays where the first element of each row is converted to
      // its own array, the second element of each to its own Array, and so on for all of the rest.
      // Essentially zipping all of the shares together.
      //
      // e.g.
      //   [ 193, 186, 29, 150, 5, 120, 44, 46, 49, 59, 6, 1, 102, 98, 177, 196 ]
      //   [ 53, 105, 139, 49, 187, 240, 91, 92, 98, 118, 12, 2, 204, 196, 127, 149 ]
      //   [ 146, 211, 249, 167, 209, 136, 118, 114, 83, 77, 10, 3, 170, 166, 206, 81 ]
      //
      // becomes:
      //
      // [ [ 193, 53, 146 ],
      //   [ 186, 105, 211 ],
      //   [ 29, 139, 249 ],
      //   [ 150, 49, 167 ],
      //   [ 5, 187, 209 ],
      //   [ 120, 240, 136 ],
      //   [ 44, 91, 118 ],
      //   [ 46, 92, 114 ],
      //   [ 49, 98, 83 ],
      //   [ 59, 118, 77 ],
      //   [ 6, 12, 10 ],
      //   [ 1, 2, 3 ],
      //   [ 102, 204, 170 ],
      //   [ 98, 196, 166 ],
      //   [ 177, 127, 206 ],
      //   [ 196, 149, 81 ] ]
      //
      if (x.indexOf(share.id) === -1) {
        x.push(share.id);
        splitShare = splitNumStringToIntArray(hex2bin(share.data));
        for (j = 0, len2 = splitShare.length; j < len2; j++) {
          y[j] = y[j] || [];
          y[j][x.length - 1] = splitShare[j];
        }
      }
    }

    // Extract the secret from the 'rotated' share data and return a
    // string of Binary digits which represent the secret directly. or in the
    // case of a newShare() return the binary string representing just that
    // new share.
    for (i = 0, len = y.length; i < len; i++) {
      result = padLeft(lagrange(at, x, y[i]).toString(2)) + result;
    }

    // If 'at' is non-zero combine() was called from newShare(). In this
    // case return the result (the new share data) directly.
    //
    // Otherwise find the first '1' which was added in the share() function as a padding marker
    // and return only the data after the padding and the marker. Convert this Binary string
    // to hex, which represents the final secret result (which can be converted from hex back
    // to the original string in user space using `hex2str()`).
    return bin2hex(at >= 1 ? result : result.slice(result.indexOf("1") + 1));
  },

  getConfig: () => {
    var obj = {};
    obj.radix = config.radix;
    obj.bits = config.bits;
    obj.maxShares = config.maxShares;
    obj.hasCSPRNG = isSetRNG();
    obj.typeCSPRNG = config.typeCSPRNG;
    return obj;
  },

  // Given a public share, extract the bits (Integer), share ID (Integer), and share data (Hex)
  // and return an Object containing those components.
  extractShareComponents: (share) => {
    var bits,
      id,
      idLen,
      max,
      obj = {},
      regexStr,
      shareComponents;

    // Extract the first char which represents the bits in Base 36
    bits = Number.parseInt(share.substr(0, 1), 36);

    if (
      bits &&
      (typeof bits !== "number" ||
        bits % 1 !== 0 ||
        bits < defaults.minBits ||
        bits > defaults.maxBits)
    ) {
      throw new Error(
        "Invalid share : Number of bits must be an integer between " +
          defaults.minBits +
          " and " +
          defaults.maxBits +
          ", inclusive.",
      );
    }

    // calc the max shares allowed for given bits
    max = Math.pow(2, bits) - 1;

    // Determine the ID length which is variable and based on the bit count.
    idLen = (Math.pow(2, bits) - 1).toString(config.radix).length;

    // Extract all the parts now that the segment sizes are known.
    regexStr = "^([a-kA-K3-9]{1})([a-fA-F0-9]{" + idLen + "})([a-fA-F0-9]+)$";
    shareComponents = new RegExp(regexStr).exec(share);

    // The ID is a Hex number and needs to be converted to an Integer
    if (shareComponents) {
      id = Number.parseInt(shareComponents[2], config.radix);
    }

    if (typeof id !== "number" || id % 1 !== 0 || id < 1 || id > max) {
      throw new Error(
        "Invalid share : Share id must be an integer between 1 and " +
          config.maxShares +
          ", inclusive.",
      );
    }

    if (shareComponents && shareComponents[3]) {
      obj.bits = bits;
      obj.id = id;
      obj.data = shareComponents[3];
      return obj;
    }

    throw new Error("The share data provided is invalid : " + share);
  },

  // Set the PRNG to use. If no RNG function is supplied, pick a default using getRNG()
  setRNG: (rng) => {
    var errPrefix = "Random number generator is invalid ",
      errSuffix =
        " Supply an CSPRNG of the form function(bits){} that returns a string containing 'bits' number of random 1's and 0's.";

    if (rng && typeof rng === "string" && CSPRNGTypes.indexOf(rng) === -1) {
      throw new Error("Invalid RNG type argument : '" + rng + "'");
    }

    // If RNG was not specified at all,
    // try to pick one appropriate for this env.
    if (!rng) {
      rng = getRNG();
    }

    // If `rng` is a string, try to forcibly
    // set the RNG to the type specified.
    if (rng && typeof rng === "string") {
      rng = getRNG(rng);
    }

    if (runCSPRNGTest) {
      if (rng && typeof rng !== "function") {
        throw new Error(errPrefix + "(Not a function)." + errSuffix);
      }

      if (rng && typeof rng(config.bits) !== "string") {
        throw new Error(errPrefix + "(Output is not a string)." + errSuffix);
      }

      if (rng && !Number.parseInt(rng(config.bits), 2)) {
        throw new Error(
          errPrefix +
            "(Binary string output not parseable to an Integer)." +
            errSuffix,
        );
      }

      if (rng && rng(config.bits).length > config.bits) {
        throw new Error(
          errPrefix +
            "(Output length is greater than config.bits)." +
            errSuffix,
        );
      }

      if (rng && rng(config.bits).length < config.bits) {
        throw new Error(
          errPrefix + "(Output length is less than config.bits)." + errSuffix,
        );
      }
    }

    config.rng = rng;

    return true;
  },

  // Converts a given UTF16 character string to the HEX representation.
  // Each character of the input string is represented by
  // `bytesPerChar` bytes in the output string which defaults to 2.
  str2hex: (str, bytesPerChar) => {
    var hexChars,
      max,
      out = "",
      neededBytes,
      num,
      i,
      len;

    if (typeof str !== "string") {
      throw new Error("Input must be a character string.");
    }

    if (!bytesPerChar) {
      bytesPerChar = defaults.bytesPerChar;
    }

    if (
      typeof bytesPerChar !== "number" ||
      bytesPerChar < 1 ||
      bytesPerChar > defaults.maxBytesPerChar ||
      bytesPerChar % 1 !== 0
    ) {
      throw new Error(
        "Bytes per character must be an integer between 1 and " +
          defaults.maxBytesPerChar +
          ", inclusive.",
      );
    }

    hexChars = 2 * bytesPerChar;
    max = Math.pow(16, hexChars) - 1;

    for (i = 0, len = str.length; i < len; i++) {
      num = str[i].charCodeAt();

      if (isNaN(num)) {
        throw new Error("Invalid character: " + str[i]);
      }

      if (num > max) {
        neededBytes = Math.ceil(Math.log(num + 1) / Math.log(256));
        throw new Error(
          "Invalid character code (" +
            num +
            "). Maximum allowable is 256^bytes-1 (" +
            max +
            "). To convert this character, use at least " +
            neededBytes +
            " bytes.",
        );
      }

      out = padLeft(num.toString(16), hexChars) + out;
    }
    return out;
  },

  // Converts a given HEX number string to a UTF16 character string.
  hex2str: (str, bytesPerChar) => {
    var hexChars,
      out = "",
      i,
      len;

    if (typeof str !== "string") {
      throw new Error("Input must be a hexadecimal string.");
    }
    bytesPerChar = bytesPerChar || defaults.bytesPerChar;

    if (
      typeof bytesPerChar !== "number" ||
      bytesPerChar % 1 !== 0 ||
      bytesPerChar < 1 ||
      bytesPerChar > defaults.maxBytesPerChar
    ) {
      throw new Error(
        "Bytes per character must be an integer between 1 and " +
          defaults.maxBytesPerChar +
          ", inclusive.",
      );
    }

    hexChars = 2 * bytesPerChar;

    str = padLeft(str, hexChars);

    for (i = 0, len = str.length; i < len; i += hexChars) {
      out =
        String.fromCharCode(Number.parseInt(str.slice(i, i + hexChars), 16)) +
        out;
    }

    return out;
  },

  // Generates a random bits-length number string using the PRNG
  random: (bits) => {
    if (
      typeof bits !== "number" ||
      bits % 1 !== 0 ||
      bits < 2 ||
      bits > 65536
    ) {
      throw new Error("Number of bits must be an Integer between 1 and 65536.");
    }

    return bin2hex(config.rng(bits));
  },

  // Divides a `secret` number String str expressed in radix `inputRadix` (optional, default 16)
  // into `numShares` shares, each expressed in radix `outputRadix` (optional, default to `inputRadix`),
  // requiring `threshold` number of shares to reconstruct the secret.
  // Optionally, zero-pads the secret to a length that is a multiple of padLength before sharing.
  share: (secret, numShares, threshold, padLength) => {
    var neededBits,
      subShares,
      x = new Array(numShares),
      y = new Array(numShares),
      i,
      j,
      len;

    // Security:
    // For additional security, pad in multiples of 128 bits by default.
    // A small trade-off in larger share size to help prevent leakage of information
    // about small-ish secrets and increase the difficulty of attacking them.
    padLength = padLength || 128;

    if (typeof secret !== "string") {
      throw new Error("Secret must be a string.");
    }

    if (typeof numShares !== "number" || numShares % 1 !== 0 || numShares < 2) {
      throw new Error(
        "Number of shares must be an integer between 2 and 2^bits-1 (" +
          config.maxShares +
          "), inclusive.",
      );
    }

    if (numShares > config.maxShares) {
      neededBits = Math.ceil(Math.log(numShares + 1) / Math.LN2);
      throw new Error(
        "Number of shares must be an integer between 2 and 2^bits-1 (" +
          config.maxShares +
          "), inclusive. To create " +
          numShares +
          " shares, use at least " +
          neededBits +
          " bits.",
      );
    }

    if (typeof threshold !== "number" || threshold % 1 !== 0 || threshold < 2) {
      throw new Error(
        "Threshold number of shares must be an integer between 2 and 2^bits-1 (" +
          config.maxShares +
          "), inclusive.",
      );
    }

    if (threshold > config.maxShares) {
      neededBits = Math.ceil(Math.log(threshold + 1) / Math.LN2);
      throw new Error(
        "Threshold number of shares must be an integer between 2 and 2^bits-1 (" +
          config.maxShares +
          "), inclusive.  To use a threshold of " +
          threshold +
          ", use at least " +
          neededBits +
          " bits.",
      );
    }

    if (threshold > numShares) {
      throw new Error(
        "Threshold number of shares was " +
          threshold +
          " but must be less than or equal to the " +
          numShares +
          " shares specified as the total to generate.",
      );
    }

    if (
      typeof padLength !== "number" ||
      padLength % 1 !== 0 ||
      padLength < 0 ||
      padLength > 1024
    ) {
      throw new Error(
        "Zero-pad length must be an integer between 0 and 1024 inclusive.",
      );
    }

    secret = "1" + hex2bin(secret); // prepend a 1 as a marker so that we can preserve the correct number of leading zeros in our secret
    secret = splitNumStringToIntArray(secret, padLength);

    for (i = 0, len = secret.length; i < len; i++) {
      subShares = getShares(secret[i], numShares, threshold);
      for (j = 0; j < numShares; j++) {
        x[j] = x[j] || subShares[j].x.toString(config.radix);
        y[j] = padLeft(subShares[j].y.toString(2)) + (y[j] || "");
      }
    }

    for (i = 0; i < numShares; i++) {
      x[i] = constructPublicShareString(config.bits, x[i], bin2hex(y[i]));
    }

    return x;
  },

  // Generate a new share with id `id` (a number between 1 and 2^bits-1)
  // `id` can be a Number or a String in the default radix (16)
  newShare: function (id, shares) {
    var share, radid;

    if (id && typeof id === "string") {
      id = Number.parseInt(id, config.radix);
    }

    radid = id.toString(config.radix);

    if (id && radid && shares && shares[0]) {
      share = this.extractShareComponents(shares[0]);
      return constructPublicShareString(
        share.bits,
        radid,
        this.combine(shares, id),
      );
    }

    throw new Error("Invalid 'id' or 'shares' Array argument to newShare().");
  },
};

// awlways init with defaults
secrets.init();

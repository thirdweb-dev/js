// modified version of isFQDN from validator.js that checks if given string is a valid domain name
// https://github.com/validatorjs/validator.js/blob/master/src/lib/isFQDN.js
// underscores are allowed, hyphens are allowed, no max length check

/**
 * Checks if a string is a valid ENS name.
 * It does not check if the ENS name is currently registered or resolves to an address - it only validates the string format.
 *
 * @param name - The ENS name to check.
 *
 * @example
 * ```ts
 * isValidENSName("thirdweb.eth"); // true
 * isValidENSName("foo.bar.com"); // true
 * isValidENSName("xyz"); // false
 */
export function isValidENSName(name: string) {
  const parts = name.split(".");
  const tld = parts[parts.length - 1];

  // disallow fqdns without tld
  if (parts.length < 2 || !tld) {
    return false;
  }

  // disallow spaces
  if (/\s/.test(tld)) {
    return false;
  }

  // reject numeric TLDs
  if (/^\d+$/.test(tld)) {
    return false;
  }

  return parts.every((part) => {
    // part must be at least 1 char long
    if (part.length < 1) {
      return false;
    }

    // disallow invalid chars
    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }

    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }

    return true;
  });
}

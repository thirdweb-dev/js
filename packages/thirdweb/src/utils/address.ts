import { LruMap } from "./caching/lru.js";
import { stringToBytes } from "./encoding/to-bytes.js";
import { keccak256 } from "./hashing/keccak256.js";

export type AddressInput = string;
export type Address = `0x${string}`;

const ADRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const IS_ADDRESS_CACHE = new LruMap<boolean>(4096);

/**
 * Checks if a given string is a valid address.
 * @param address The address to check.
 * @returns True if the address is valid, false otherwise.
 * @example
 * ```ts
 * import { isAddress } from 'thirdweb/utils';
 *
 * isAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
 * //=> true
 * ```
 * @utils
 */
export function isAddress(address: string): address is Address {
  if (IS_ADDRESS_CACHE.has(address)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return IS_ADDRESS_CACHE.get(address)!;
  }
  const result = (() => {
    if (!ADRESS_REGEX.test(address)) {
      return false;
    }
    if (address.toLowerCase() === address) {
      return true;
    }

    return checksumAddress(address) === address;
  })();
  IS_ADDRESS_CACHE.set(address, result);
  return result;
}

/**
 * Calculates the checksum address for the given address.
 * @param address - The address to calculate the checksum for.
 * @returns The checksum address.
 * @example
 * ```ts
 * import { checksumAddress } from 'thirdweb/utils';
 *
 * checksumAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
 * //=> '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
 * ```
 * @utils
 */
export function checksumAddress(address: string): Address {
  const hexAddress = address.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress), "bytes");

  const address_ = hexAddress.split("");
  for (let i = 0; i < 40; i += 2) {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    if (hash[i >> 1]! >> 4 >= 8 && address[i]) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      address_[i] = address_[i]!.toUpperCase();
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    if ((hash[i >> 1]! & 0x0f) >= 8 && address[i + 1]) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      address_[i + 1] = address_[i + 1]!.toUpperCase();
    }
  }

  return `0x${address_.join("")}`;
}

/**
 * Retrieves the address after performing validation and checksumming.
 * @param address - The address to be validated and checksummed.
 * @returns The validated and checksummed address.
 * @throws Error if the address is invalid.
 * @example
 * ```ts
 * import { getAddress } from 'thirdweb/utils';
 *
 * getAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed');
 * //=> '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
 * ```
 * @utils
 */
export function getAddress(address: string): Address {
  if (!isAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return checksumAddress(address);
}

/**
 * Checksums and formats an address if valid. Note this function does not check if the provided address is an ENS.
 * @param address - The address to shorten.
 * @param length - The number of characters to keep from the start and end of the address.
 * @returns The shortened address.
 * @example
 * ```ts
 * import { shortenAddress } from 'thirdweb/utils';
 *
 * shortenAddress('0xa0cf798816d4b9b9866b5330eea46a18382f251e');
 * //=> '0xA0Cf...251e'
 * ```
 * @utils
 */
export function shortenAddress(address: string, length = 4) {
  const _address = getAddress(address);
  return `${_address.slice(0, length + 2)}...${_address.slice(-length)}`;
}

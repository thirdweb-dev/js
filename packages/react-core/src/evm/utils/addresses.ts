import { utils } from "ethers";

/**
 * @internal
 */
export function shortenString(str: string, extraShort: boolean = true) {
  return `${str.substring(0, extraShort ? 4 : 6)}...${str.substring(
    str.length - (extraShort ? 3 : 4),
  )}`;
}

/**
 * This function shortens an address if it is a valid EVM address.
 *
 * @param address - The address to shorten
 * @param extraShort - If true, show the first 4 and last 3 characters
 * @returns The shortened address
 *
 * @remarks
 * Note that this function will not check if the address is an ENS.
 *
 * @example Calling shortenAddress with extraShort set to true
 * ```ts
 * const address = shortenIfAddress("0x1234567890123456789012345678901234567890", true); // result will be "0x1234...890"
 * ```
 */
export function shortenAddress(
  address?: string,
  extraShort: boolean = true,
): string {
  if (!address) {
    return "";
  }
  try {
    const formattedAddress = utils.getAddress(address);
    return shortenString(formattedAddress, extraShort);
  } catch {
    return address;
  }
}

/**
 * @internal
 */
export function shortenIfAddress(
  address?: string | null | false,
  extraShort: boolean = true,
): string {
  if (address && utils.isAddress(address)) {
    return shortenAddress(address, extraShort);
  }
  return address || "";
}

/**
 * @internal
 */
export function isEnsName(name: string): boolean {
  return name?.endsWith(".eth");
}

/**
 * @internal
 */
export function isPossibleEVMAddress(address?: string, ignoreEns?: boolean) {
  if (!address) {
    return false;
  }
  if (isEnsName(address) && !ignoreEns) {
    return true;
  }
  return utils.isAddress(address);
}

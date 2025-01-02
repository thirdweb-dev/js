import { isPossibleEVMAddress } from "lib/address-utils";

export function shortenString(str: string, extraShort = true) {
  return `${str.substring(0, extraShort ? 4 : 6)}...${str.substring(
    str.length - (extraShort ? 3 : 4),
  )}`;
}
export function shortenIfAddress(
  address?: string | null | false,
  extraShort?: true,
): string {
  if (!address) {
    return "";
  }
  if (isPossibleEVMAddress(address, true)) {
    return shortenString(address, extraShort);
  }
  return address;
}

import { utils } from "ethers";

export function shortenString(str: string, extraShort?: true) {
  return `${str.substring(0, extraShort ? 4 : 6)}...${str.substring(
    str.length - (extraShort ? 3 : 4),
  )}`;
}

export function shortenAddress(address: string, extraShort?: true): string {
  try {
    const formattedAddress = utils.getAddress(address);
    return shortenString(formattedAddress, extraShort);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
}

export function shortenIfAddress(
  address?: string | null | false,
  extraShort?: true,
): string {
  if (typeof address === "string" && address.length > 0) {
    return shortenAddress(address, extraShort);
  }
  return "";
}

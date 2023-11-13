import { utils } from "ethers";

export function shortenString(str: string, extraShort: boolean = true) {
  return `${str.substring(0, extraShort ? 4 : 6)}...${str.substring(
    str.length - (extraShort ? 3 : 4),
  )}`;
}

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

export function shortenIfAddress(
  address?: string | null | false,
  extraShort: boolean = true,
): string {
  if (address && utils.isAddress(address)) {
    return shortenAddress(address, extraShort);
  }
  return address || "";
}

export function isEnsName(name: string): boolean {
  return name?.endsWith(".eth");
}

export function isPossibleEVMAddress(address?: string, ignoreEns?: boolean) {
  if (!address) {
    return false;
  }
  if (isEnsName(address) && !ignoreEns) {
    return true;
  }
  return utils.isAddress(address);
}

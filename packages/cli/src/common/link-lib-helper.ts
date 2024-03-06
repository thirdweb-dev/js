import { utils } from "ethers";
import { isAddress } from "ethers/lib/utils";

export interface Link {
  library: string;
  address: string;
}

// Custom array option parser for --link-lib
export function parseLinkLibOption(
  value: string,
  previousValue: Link[] | undefined,
): Link[] {
  const links = previousValue || [];
  const [library, address] = value.split(":");
  if (!isAddress(address)) {
    throw new Error(`Invalid address ${address} `);
  }
  links.push({ library, address });
  return links;
}

// replace placeholder in bytecode with library address
export function linkLibrary(
  bytecode: string,
  libraries: {
    [key: string]: string;
  } = {},
): string {
  let linkedBytecode = bytecode;
  for (const [key, address] of Object.entries(libraries)) {
    const placeholder = `__\$${utils
      .solidityKeccak256(["string"], [key])
      .slice(2, 36)}\$__`;
    const formattedAddress = utils
      .getAddress(address)
      .toLowerCase()
      .replace("0x", "");

    linkedBytecode = linkedBytecode.replaceAll(placeholder, formattedAddress);
  }
  return linkedBytecode;
}

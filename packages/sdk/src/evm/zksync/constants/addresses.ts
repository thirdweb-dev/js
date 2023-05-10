/* eslint-disable no-useless-computed-key */

/**
 * @internal
 */
export const CONTRACT_ADDRESSES: Record<
  number,
  {
    openzeppelinForwarder: string;
    openzeppelinForwarderEOA: string;
    biconomyForwarder: string;
  }
> = {
  [280]: {
    openzeppelinForwarder: "",
    openzeppelinForwarderEOA: "",
    biconomyForwarder: "",
  },
};

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  [280]: {
    DropERC721: "0xA8E28D98203848401A4f924358e6c337153D0f04",
    DropERC1155: "",
    DropERC20: "",
    SignatureDrop: "",
    Marketplace: "",
    MarketplaceV3: "",
  },
};

/**
 * @internal
 * @param chainId
 * @param contractType
 */
export function getImplementation(
  chainId: number,
  contractName: string,
): string | null {
  if (chainId in IMPLEMENTATIONS) {
    const approvedImpls = IMPLEMENTATIONS[chainId];
    if (contractName in approvedImpls) {
      return approvedImpls[contractName as keyof typeof approvedImpls];
    }
  }
  return null;
}

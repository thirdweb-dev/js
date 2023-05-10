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
    DropERC1155: "0xf3C7d3F0AA374a2D32489929e24D3e9313Aec8bb",
    DropERC20: "0x4027561E163a420c4e5Db46E07EBd581CAa8Bb62",
    SignatureDrop: "",
    Marketplace: "0xA77041a7A34A67D7285c8d3550110e441009436e",
    MarketplaceV3: "0x292c324920d4120F928dA6f04548442fa10B8B0f",
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

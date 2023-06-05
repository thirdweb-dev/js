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
  // ZKSync Era Testnet
  [280]: {
    DropERC721: "0xA8E28D98203848401A4f924358e6c337153D0f04",
    DropERC1155: "0xf3C7d3F0AA374a2D32489929e24D3e9313Aec8bb",
    DropERC20: "0x4027561E163a420c4e5Db46E07EBd581CAa8Bb62",
    SignatureDrop: "",
    Marketplace: "0xA77041a7A34A67D7285c8d3550110e441009436e",
    MarketplaceV3: "0x292c324920d4120F928dA6f04548442fa10B8B0f",
    TokenERC721: "0xe04593be4c928769ACb157aab0214be1c4E7b6F6",
    TokenERC1155: "0x4e0C3577335961Ff800FFDA24981EB2F38D94483",
    TokenERC20: "0x0aecDe90BC11303871E6e4D7d83Ee84433BC115C",
  },

  // ZKSync Era Mainnet
  [324]: {
    DropERC721: "0x9742f5ac11958cFAd151eBF0Fc31302fA409036E",
    DropERC1155: "0x4027561E163a420c4e5Db46E07EBd581CAa8Bb62",
    DropERC20: "0xf3C7d3F0AA374a2D32489929e24D3e9313Aec8bb",
    SignatureDrop: "",
    Marketplace: "",
    MarketplaceV3: "0xF8fd1016420c2B7832714241d36Efe55D41df126",
    TokenERC721: "0x26279882D5E93045D4FA986847CAAC048b2Bac3b",
    TokenERC1155: "0xA8E28D98203848401A4f924358e6c337153D0f04",
    TokenERC20: "0x56Abb6a3f25DCcdaDa106191053b1CC54C196DEE",
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

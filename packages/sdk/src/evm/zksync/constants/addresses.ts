/* eslint-disable no-useless-computed-key */

const AddressZero = "0x0000000000000000000000000000000000000000";

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
    openzeppelinForwarder: "0x12A305cc7168fa3b7B172fE53c57b9a22716F667",
    openzeppelinForwarderEOA: AddressZero,
    biconomyForwarder: AddressZero,
  },
  [324]: {
    openzeppelinForwarder: "0x4e0C3577335961Ff800FFDA24981EB2F38D94483",
    openzeppelinForwarderEOA: AddressZero,
    biconomyForwarder: AddressZero,
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
    MarketplaceV3: "0x6026C3b81927f9f3bD943c32F8605C1774Df79f2",
    TokenERC721: "0xe04593be4c928769ACb157aab0214be1c4E7b6F6",
    TokenERC1155: "0x4e0C3577335961Ff800FFDA24981EB2F38D94483",
    TokenERC20: "0x0aecDe90BC11303871E6e4D7d83Ee84433BC115C",
    AirdropERC20: "0xcd3555c6058278E725A5b66d2D89aCc3b211768b",
    AirdropERC721: "0x3D9337181DC55fB1cD06D46b0738A8134295670d",
    AirdropERC1155: "0x8b0DBCf5b7D01eBB0F24525CE8AB72F16CE4F8C8",
  },

  // ZKSync Era Mainnet
  [324]: {
    DropERC721: "0x9742f5ac11958cFAd151eBF0Fc31302fA409036E",
    DropERC1155: "0x4027561E163a420c4e5Db46E07EBd581CAa8Bb62",
    DropERC20: "0xf3C7d3F0AA374a2D32489929e24D3e9313Aec8bb",
    SignatureDrop: "",
    Marketplace: "",
    MarketplaceV3: "0x13f25360dd3f9096c3e2cBe60b95c45b11ADB7E4",
    MarketplaceV3_aux: "0x5a2524Ca4E4f86a34382C5be871F34f50F014d84",
    TokenERC721: "0x26279882D5E93045D4FA986847CAAC048b2Bac3b",
    TokenERC1155: "0xA8E28D98203848401A4f924358e6c337153D0f04",
    TokenERC20: "0x56Abb6a3f25DCcdaDa106191053b1CC54C196DEE",
    AirdropERC20: "0xDD3E3BBa3bb4edcbbEa9d52Cd1E49289Ef3DfDE3",
    AirdropERC721: "0x8A4E9034BC6ac77E1408AC878e0603A32B5d4b73",
    AirdropERC1155: "0xcd3555c6058278E725A5b66d2D89aCc3b211768b",
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
  version?: string,
): string | null {
  if (chainId in IMPLEMENTATIONS) {
    const approvedImpls = IMPLEMENTATIONS[chainId];
    if (contractName in approvedImpls) {
      if (
        contractName === "MarketplaceV3" &&
        version === "1.1.2" &&
        chainId === 324
      ) {
        return approvedImpls["MarketplaceV3_aux"];
      }
      return approvedImpls[contractName as keyof typeof approvedImpls];
    }
  }
  return null;
}

/**
 *
 * @param chainId - chain id
 * @returns the array of trusted forwarders for the given chain id
 * @internal
 */
export function zkGetDefaultTrustedForwarders(
  chainId: number,
  contractName?: string,
): string[] {
  const biconomyForwarder = CONTRACT_ADDRESSES[chainId].biconomyForwarder;
  const openzeppelinForwarder =
    CONTRACT_ADDRESSES[chainId].openzeppelinForwarder;

  return contractName && contractName === "Pack"
    ? []
    : [openzeppelinForwarder, biconomyForwarder].filter(
        (a) => a !== AddressZero,
      );
}

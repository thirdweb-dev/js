/* eslint-disable no-useless-computed-key */

import { constants } from "ethers";
import { ChainId } from "../../constants/chains/ChainId";
import { NativeToken } from "../../types/currency";

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
    openzeppelinForwarder: AddressZero,
    openzeppelinForwarderEOA: AddressZero,
    biconomyForwarder: AddressZero,
  },
  [324]: {
    openzeppelinForwarder: AddressZero,
    openzeppelinForwarderEOA: AddressZero,
    biconomyForwarder: AddressZero,
  },
};

/**
 * @public
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/**
 * @public
 */
export const NATIVE_TOKENS: Record<number, NativeToken> = /* @__PURE__ */ {
  // eslint-disable-next-line no-useless-computed-key
  [280]: {
    name: "zkSync Era Testnet",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x20b28B1e4665FFf290650586ad76E977EAb90c5D",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
  [324]: {
    name: "zkSync Era Mainnet",
    symbol: "ETH",
    decimals: 18,
    wrapped: {
      address: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
      name: "Wrapped Ether",
      symbol: "WETH",
    },
  },
};

export const blockExplorerApiMap: Record<number, string> = {
  [324]: "https://block-explorer-api.mainnet.zksync.io/api",
  [280]: "https://block-explorer-api.testnets.zksync.dev/api",
  [300]: "https://block-explorer-api.sepolia.zksync.dev/api",
};

export const IMPLEMENTATIONS: Record<number, Record<string, string>> = {
  // ZKSync Era Goerli Testnet (Deprecated)
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

  // ZKSync Era Sepolia Testnet
  [300]: {
    DropERC721: "0x77121698E15e307D40eE1F1C6dF0ec7340F8eE71",
    DropERC1155: "0xFA0D78F98dEf58a4f458e3dCaa59D6778ea32c14",
    DropERC20: "0x6026C3b81927f9f3bD943c32F8605C1774Df79f2",
    SignatureDrop: "",
    Marketplace: "",
    MarketplaceV3: "0x58e0F289C7dD2025eBd0696d913ECC0fdc1CC8bc",
    TokenERC721: "0xA2bD9922fE19E441FF799D76B89Fa8495B60CcB3",
    TokenERC1155: "0x99E6dc722AeF030A4F8DCa5d8387b07E66A3991B",
    TokenERC20: "0xfCA4441848067f8dB83902Da0f177989ecc6328f",
    AirdropERC20: "0x4b14569c7B79DBe686Ac3Ba5996131E7EDaB7a93",
    AirdropERC721: "0xDD3E3BBa3bb4edcbbEa9d52Cd1E49289Ef3DfDE3",
    AirdropERC1155: "0x8A4E9034BC6ac77E1408AC878e0603A32B5d4b73",
    NFTStake: "0x62A032fd158EBC4044F6B4D3F42a0e5EE427803e",
    TokenStake: "0x364d188b53d5A37732f5e79C33270CAAF8Bf39D0",
    EditionStake: "0x81ED186CEBcC9428C6cB4859B9827636ff2e053F",
    VoteERC20: "0x2cf6e5ba0746Eb48B5066947E8C56982D8E4121E",
    Split: "0x13f25360dd3f9096c3e2cBe60b95c45b11ADB7E4",
    OpenEditionERC721: "0xA405a38A75194a8ea88bE695Aa8bdc74E905a903",
    Airdrop: "0x838Dbc16A6bc7B5B6f86B7f4818f6c4d41F31f91",
    Pack: "0x9Fdf34f552cdA8E2B0cD64e2EddcB732a5Ff8455",
    LoyaltyCard: "0xD5B1435b359c88FF69979166Cb6EC268Be79C6F7",
    Multiwrap: "0x5a2524Ca4E4f86a34382C5be871F34f50F014d84",
  },

  // ZKCandy Sepolia Testnet
  [302]: {
    DropERC721: "0xA8E28D98203848401A4f924358e6c337153D0f04",
    DropERC1155: "0xf3C7d3F0AA374a2D32489929e24D3e9313Aec8bb",
    DropERC20: "0x9742f5ac11958cFAd151eBF0Fc31302fA409036E",
    SignatureDrop: "",
    Marketplace: "",
    MarketplaceV3: "0x8b0DBCf5b7D01eBB0F24525CE8AB72F16CE4F8C8",
    TokenERC721: "0x4027561E163a420c4e5Db46E07EBd581CAa8Bb62",
    TokenERC1155: "0xA77041a7A34A67D7285c8d3550110e441009436e",
    TokenERC20: "0x0006BC0D8Bf9D91290Df89341F936c612D6978eb",
    AirdropERC20: "",
    AirdropERC721: "",
    AirdropERC1155: "",
    NFTStake: "0x0aecDe90BC11303871E6e4D7d83Ee84433BC115C",
    TokenStake: "0x12A305cc7168fa3b7B172fE53c57b9a22716F667",
    EditionStake: "0x4b14569c7B79DBe686Ac3Ba5996131E7EDaB7a93",
    VoteERC20: "0xF8fd1016420c2B7832714241d36Efe55D41df126",
    Split: "0xe0AD48286BF27AE0C5953d4417fB37f3FECABB4a",
    OpenEditionERC721: "0x26279882D5E93045D4FA986847CAAC048b2Bac3b",
    Airdrop: "0xB7387cF425eC8Da1b04b8E34De86245cb32bCA6D",
    Pack: "0xe04593be4c928769ACb157aab0214be1c4E7b6F6",
    LoyaltyCard: "0x292c324920d4120F928dA6f04548442fa10B8B0f",
    Multiwrap: "0x4e0C3577335961Ff800FFDA24981EB2F38D94483",
  },

  // ZKSync Era Mainnet
  [324]: {
    DropERC721: "0x9F92368dD2AbCD1f8067Ea7094f78CCe70bBa944",
    DropERC1155: "0xdb73302820d610c26242c9fbD0fCFA5C5acE3866",
    DropERC20: "0x5FC7d4642b37DfCe89A416775d36E023593c7dD5",
    SignatureDrop: "",
    Marketplace: "",
    MarketplaceV3: "0xBc02441a36Bb4029Cd191b20243c2e41B862F118",
    MarketplaceV3_aux: "0x5a2524Ca4E4f86a34382C5be871F34f50F014d84",
    TokenERC721: "0xAE6146cE093FfEED659a8d5f9904b18B770f5215",
    TokenERC1155: "0xdD60A8002086210e21FC4F7E73Ff0260D0252085",
    TokenERC20: "0x64c4aC19F2173E7c0B6eB922CF05DC410Feb2176",
    AirdropERC20: "0xDD3E3BBa3bb4edcbbEa9d52Cd1E49289Ef3DfDE3",
    AirdropERC721: "0x8A4E9034BC6ac77E1408AC878e0603A32B5d4b73",
    AirdropERC1155: "0xcd3555c6058278E725A5b66d2D89aCc3b211768b",
    NFTStake: "0x534548302852C9A311b8E74d05f71478a08D5107",
    TokenStake: "0x73DC91aD22F8d8c1048d9E8da1C055B9Bcc7E0ab",
    EditionStake: "0xfd8355dB4e86d36Bd06B7d0691C5d440E52F8885",
    VoteERC20: "0xff0AAe2734625AeF5C006235cb9Ce89aa389B5d2",
    Split: "0x22c0232257Be71224e668BA7B818395d1d33248F",
    OpenEditionERC721: "0x282eC3fD1F2650a5CC65300E1aC26A32013e7a81",
    Airdrop: "0xf74326EC19A0fEd89EE3A2232C7Cc5Fa7E3D8083",
    Pack: "0x9636a57A7A250C1EB93DfF8Ff21CB424Dec54e88",
    LoyaltyCard: "0x30995E43c78b92fd4F478A908b30b1e18926f4CE",
    Multiwrap: "0xffa87d4e9bEb7318199Dada520E9AC3bf897a3d7",
  },
};

/**
 * @internal
 * @param chainId - chain id
 * @param contractType - contract type
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
 * @returns The array of trusted forwarders for the given chain id
 * @internal
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export function zkGetDefaultTrustedForwarders(
  chainId: number,
  contractName?: string,
): string[] {
  //  Since ZkSync has gas sponsoring through native Account Abstraction,
  //  it doesn’t need a forwarder
  return [];
}

/**
 * Returns the native token for a given chain
 * @param chainId - the chain id
 * @public
 */
export function getZkNativeTokenByChainId(chainId: ChainId): NativeToken {
  return (
    NATIVE_TOKENS[chainId] || {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      wrapped: {
        address: constants.AddressZero,
        name: "Wrapped Ether",
        symbol: "WETH",
      },
    }
  );
}

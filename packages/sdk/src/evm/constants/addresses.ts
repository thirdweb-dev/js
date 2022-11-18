import { PrebuiltContractType } from "../core/types";
import { ChainId, SUPPORTED_CHAIN_ID } from "./chains";
import { constants } from "ethers";

/**
 * @internal
 */
export const OZ_DEFENDER_FORWARDER_ADDRESS =
  "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";

const TWRegistry_address = "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd";
const TWFactory_address = "0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0";
const ContractPublisher_address = "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7"; // Polygon only

/**
 * @internal
 */
export const CONTRACT_ADDRESSES: Record<
  SUPPORTED_CHAIN_ID,
  {
    openzeppelinForwarder: string;
    openzeppelinForwarderEOA: string;
    biconomyForwarder: string;
    twFactory: string;
    twRegistry: string;
    twBYOCRegistry: string;
  }
> = {
  [ChainId.Mainnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x76ce2CB1Ae48Fa067f4fb8c5f803111AE0B24BEA",
    biconomyForwarder: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: constants.AddressZero,
  },

  [ChainId.Goerli]: {
    openzeppelinForwarder: "0x5001A14CA6163143316a7C614e30e6041033Ac20",
    openzeppelinForwarderEOA: "0xe73c50cB9c5B378627ff625BB6e6725A4A5D65d2",
    biconomyForwarder: "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0xB1Bd9d7942A250BA2Dce27DD601F2ED4211A60C4",
  },
  [ChainId.Polygon]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x4f247c69184ad61036EC2Bb3213b69F10FbEDe1F",
    biconomyForwarder: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x308473Be900F4185A56587dE54bDFF5E8f7a6AE7",
  },
  [ChainId.Mumbai]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0xb1A2883fc4d287d9cB8Dbb96cFF60C76BEf2D250",
    biconomyForwarder: "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3F17972CB27506eb4a6a3D59659e0B57a43fd16C",
  },
  [ChainId.Avalanche]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0xb1A2883fc4d287d9cB8Dbb96cFF60C76BEf2D250",
    biconomyForwarder: "0x64CD353384109423a966dCd3Aa30D884C9b2E057",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.AvalancheFujiTestnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0xe73c50cB9c5B378627ff625BB6e6725A4A5D65d2",
    biconomyForwarder: "0x6271Ca63D30507f2Dcbf99B52787032506D75BBF",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3E6eE864f850F5e5A98bc950B68E181Cf4010F23",
  },
  [ChainId.Fantom]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0xb1A2883fc4d287d9cB8Dbb96cFF60C76BEf2D250",
    biconomyForwarder: "0x64CD353384109423a966dCd3Aa30D884C9b2E057",
    twFactory: "0x97EA0Fcc552D5A8Fb5e9101316AAd0D62Ea0876B",
    twRegistry: TWRegistry_address,
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.FantomTestnet]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x42D3048b595B6e1c28a588d70366CcC2AA4dB47b",
    biconomyForwarder: "0x69FB8Dca8067A5D38703b9e8b39cf2D51473E4b4",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3E6eE864f850F5e5A98bc950B68E181Cf4010F23",
  },
  [ChainId.Arbitrum]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x4f247c69184ad61036EC2Bb3213b69F10FbEDe1F",
    biconomyForwarder: "0xfe0fa3C06d03bDC7fb49c892BbB39113B534fB57",
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },

  [ChainId.ArbitrumGoerli]: {
    openzeppelinForwarder: "0x8cbc8B5d71702032904750A66AEfE8B603eBC538",
    openzeppelinForwarderEOA: "0x119704314Ef304EaAAE4b3c7C9ABd59272A28310",
    biconomyForwarder: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.Optimism]: {
    openzeppelinForwarder: OZ_DEFENDER_FORWARDER_ADDRESS,
    openzeppelinForwarderEOA: "0x7e80648EB2071E26937F9D42A513ccf4815fc702",
    biconomyForwarder: "0xefba8a2a82ec1fb1273806174f5e28fbb917cf95",
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },

  [ChainId.OptimismGoerli]: {
    openzeppelinForwarder: "0x8cbc8B5d71702032904750A66AEfE8B603eBC538",
    openzeppelinForwarderEOA: "0x119704314Ef304EaAAE4b3c7C9ABd59272A28310",
    biconomyForwarder: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.BinanceSmartChainMainnet]: {
    openzeppelinForwarder: "0x8cbc8B5d71702032904750A66AEfE8B603eBC538",
    openzeppelinForwarderEOA: "0xE8dd2Ff0212F86d3197b4AfDC6dAC6ac47eb10aC",
    biconomyForwarder: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
    twBYOCRegistry: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
  },
  [ChainId.BinanceSmartChainTestnet]: {
    openzeppelinForwarder: "0x8cbc8B5d71702032904750A66AEfE8B603eBC538",
    openzeppelinForwarderEOA: "0x7e80648EB2071E26937F9D42A513ccf4815fc702",
    biconomyForwarder: "0x61456BF1715C1415730076BB79ae118E806E74d2",
    twBYOCRegistry: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
  },
};

type DropContract = Extract<
  PrebuiltContractType,
  "nft-drop" | "token-drop" | "edition-drop" | "signature-drop"
>;
export const APPROVED_IMPLEMENTATIONS: Record<
  SUPPORTED_CHAIN_ID,
  Record<DropContract, string>
> = {
  [ChainId.Mainnet]: {
    "nft-drop": "0x60fF9952e0084A6DEac44203838cDC91ABeC8736",
    "edition-drop": "0x74af262d0671F378F97a1EDC3d0970Dbe8A1C550",
    "token-drop": "0xE1eE43D23f247b6A9aF81fcE2766E76709482728",
    "signature-drop": "0x6fD690EB509BdE4C50028C5D9C0dE3750C2Fad6A",
  },
  [ChainId.Polygon]: {
    "nft-drop": "0xB96508050Ba0925256184103560EBADA912Fcc69",
    "edition-drop": "0x74af262d0671F378F97a1EDC3d0970Dbe8A1C550",
    "token-drop": "0x5A8eA4Adad8289746D073947BA06D69A62499aaf",
    "signature-drop": "0xBE2fDc35410E268e41Bec62DBb01AEb43245c7d5",
  },
  [ChainId.Fantom]: {
    "nft-drop": "0x2A396b2D90BAcEF19cDa973586B2633d22710fC2",
    "edition-drop": "0x06395FCF9AC6ED827f9dD6e776809cEF1Be0d21B",
    "token-drop": "0x0148b28a38efaaC31b6aa0a6D9FEb70FE7C91FFa",
    "signature-drop": "0xe135Ef65C2B2213C3fD56d0Bd6500A2cA147aC10",
  },
  [ChainId.Avalanche]: {
    "nft-drop": "0x9cF91118C8ee2913F0588e0F10e36B3d63F68bF6",
    "edition-drop": "0x135fC9D26E5eC51260ece1DF4ED424E2f55c7766",
    "token-drop": "0xca0B071899E575BA86495D46c5066971b6f3A901",
    "signature-drop": "0x1d47526C3292B0130ef0afD5F02c1DA052A017B3",
  },
  [ChainId.Optimism]: {
    "nft-drop": "0xFBd7D24d80ee005671E731a7287DEB6073264dD1",
    "edition-drop": "0xe135Ef65C2B2213C3fD56d0Bd6500A2cA147aC10",
    "token-drop": "0x902Dd246e66d8C3CE652375a723F2a52b43b9AAE",
    "signature-drop": "0x8a4cd3549e548bbEEb38C16E041FFf040a5acabD",
  },
  [ChainId.Arbitrum]: {
    "nft-drop": "0xC4903c1Ff5367b9ac2c349B63DC2409421AaEE2a",
    "edition-drop": "0xCcddcec1831646Beff2753249f1B9C580327E89F",
    "token-drop": "0x1b5947e1a2d5a29D0df20931DeAB0B87818209B9",
    "signature-drop": "0x2dF9851af45dd41C8584ac55D983C604da985Bc7",
  },
  [ChainId.BinanceSmartChainMainnet]: {
    "nft-drop": "0x902Dd246e66d8C3CE652375a723F2a52b43b9AAE",
    "edition-drop": "0x2A396b2D90BAcEF19cDa973586B2633d22710fC2",
    "token-drop": "0xe135Ef65C2B2213C3fD56d0Bd6500A2cA147aC10",
    "signature-drop": "0xFBd7D24d80ee005671E731a7287DEB6073264dD1",
  },
  [ChainId.Goerli]: {
    "nft-drop": "0xD11c97DD5F5546B5bBd630D7D1d7327481B0b92C",
    "edition-drop": "0x5A8eA4Adad8289746D073947BA06D69A62499aaf",
    "token-drop": "0x5680933221B752EB443654a014f88B101F868d50",
    "signature-drop": "0x1b5947e1a2d5a29D0df20931DeAB0B87818209B9",
  },
  [ChainId.Mumbai]: {
    "nft-drop": "0xC4903c1Ff5367b9ac2c349B63DC2409421AaEE2a",
    "edition-drop": "0xCcddcec1831646Beff2753249f1B9C580327E89F",
    "token-drop": "0x1b5947e1a2d5a29D0df20931DeAB0B87818209B9",
    "signature-drop": "0x2dF9851af45dd41C8584ac55D983C604da985Bc7",
  },
  [ChainId.FantomTestnet]: {
    "nft-drop": "0x8a4cd3549e548bbEEb38C16E041FFf040a5acabD",
    "edition-drop": "0x902Dd246e66d8C3CE652375a723F2a52b43b9AAE",
    "token-drop": "0xFBd7D24d80ee005671E731a7287DEB6073264dD1",
    "signature-drop": "0x5A8eA4Adad8289746D073947BA06D69A62499aaf",
  },
  [ChainId.AvalancheFujiTestnet]: {
    "nft-drop": "0xD11c97DD5F5546B5bBd630D7D1d7327481B0b92C",
    "edition-drop": "0xE1eE43D23f247b6A9aF81fcE2766E76709482728",
    "token-drop": "0x6fD690EB509BdE4C50028C5D9C0dE3750C2Fad6A",
    "signature-drop": "0xCcddcec1831646Beff2753249f1B9C580327E89F",
  },
  [ChainId.OptimismGoerli]: {
    "nft-drop": "0xCcddcec1831646Beff2753249f1B9C580327E89F",
    "edition-drop": "0x6fD690EB509BdE4C50028C5D9C0dE3750C2Fad6A",
    "token-drop": "0xD11c97DD5F5546B5bBd630D7D1d7327481B0b92C",
    "signature-drop": "0x1b5947e1a2d5a29D0df20931DeAB0B87818209B9",
  },
  [ChainId.ArbitrumGoerli]: {
    "nft-drop": "0x9CfE807a5b124b962064Fa8F7FD823Cc701255b6",
    "edition-drop": "0x9cF91118C8ee2913F0588e0F10e36B3d63F68bF6",
    "token-drop": "0x1d47526C3292B0130ef0afD5F02c1DA052A017B3",
    "signature-drop": "0xE1eE43D23f247b6A9aF81fcE2766E76709482728",
  },
  [ChainId.BinanceSmartChainTestnet]: {
    "nft-drop": "",
    "edition-drop": "",
    "token-drop": "",
    "signature-drop": "", // TODO
  },
};

/**
 * @internal
 * @param chainId
 * @param contractType
 */
export function getApprovedImplementation(
  chainId: SUPPORTED_CHAIN_ID, // TODO use SupportedChainId once we deploy to all chains
  contractType: PrebuiltContractType,
): string | null {
  if (chainId in APPROVED_IMPLEMENTATIONS) {
    const approvedImpls = APPROVED_IMPLEMENTATIONS[chainId];
    if (contractType in approvedImpls) {
      return approvedImpls[contractType as keyof typeof approvedImpls];
    }
  }
  return null;
}

/**
 * @internal
 */
export function getContractAddressByChainId(
  chainId: SUPPORTED_CHAIN_ID | ChainId.Hardhat,
  contractName: keyof typeof CONTRACT_ADDRESSES[SUPPORTED_CHAIN_ID],
): string {
  // for testing only
  if (chainId === ChainId.Hardhat) {
    if (contractName === "twFactory") {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      return process.env.factoryAddress as string;
    } else if (contractName === "twRegistry") {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      return process.env.registryAddress as string;
    } else {
      return constants.AddressZero;
    }
  }
  // real output here
  return CONTRACT_ADDRESSES[chainId][contractName];
}

/**
 * @internal
 */
export function getContractPublisherAddress() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.contractPublisherAddress) {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return process.env.contractPublisherAddress as string;
  } else {
    return ContractPublisher_address;
  }
}

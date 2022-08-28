import { constants } from "ethers";
import { ChainId, SUPPORTED_CHAIN_ID } from "./chains";

/**
 * @internal
 */
export const OZ_DEFENDER_FORWARDER_ADDRESS =
  "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";

const TWRegistry_address = "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd";
const TWFactory_address = "0x5DBC7B840baa9daBcBe9D2492E45D7244B54A2A0";
const ContractPublisher_address = "0x58c892e6bc196371f7fb425177b0E2aA906BC007"; // Polygon only

/**
 * @internal
 */
export const CONTRACT_ADDRESSES: Record<
  SUPPORTED_CHAIN_ID,
  {
    biconomyForwarder: string;
    twFactory: string;
    twRegistry: string;
    twBYOCRegistry: string;
  }
> = {
  [ChainId.Mainnet]: {
    biconomyForwarder: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.Rinkeby]: {
    biconomyForwarder: "0xFD4973FeB2031D4409fB57afEE5dF2051b171104",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3E6eE864f850F5e5A98bc950B68E181Cf4010F23",
  },
  [ChainId.Goerli]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0xB1Bd9d7942A250BA2Dce27DD601F2ED4211A60C4",
  },
  [ChainId.Polygon]: {
    biconomyForwarder: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x308473Be900F4185A56587dE54bDFF5E8f7a6AE7",
  },
  [ChainId.Mumbai]: {
    biconomyForwarder: "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3F17972CB27506eb4a6a3D59659e0B57a43fd16C",
  },
  [ChainId.Avalanche]: {
    biconomyForwarder: "0x64CD353384109423a966dCd3Aa30D884C9b2E057",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.AvalancheFujiTestnet]: {
    biconomyForwarder: "0x6271Ca63D30507f2Dcbf99B52787032506D75BBF",
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3E6eE864f850F5e5A98bc950B68E181Cf4010F23",
  },
  [ChainId.Fantom]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: "0x97EA0Fcc552D5A8Fb5e9101316AAd0D62Ea0876B",
    twRegistry: TWRegistry_address,
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.FantomTestnet]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: TWFactory_address,
    twRegistry: TWRegistry_address,
    twBYOCRegistry: "0x3E6eE864f850F5e5A98bc950B68E181Cf4010F23",
  },
  [ChainId.Arbitrum]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.ArbitrumTestnet]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: "0xb0435b47ad26115A39c59735b814f3769F07C2c1",
    twRegistry: "0xcF4c511551aE4dab1F997866FC3900cd2aaeC40D",
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.Optimism]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },
  [ChainId.OptimismTestnet]: {
    biconomyForwarder: constants.AddressZero,
    twFactory: "0xd24b3de085CFd8c54b94feAD08a7962D343E6DE0",
    twRegistry: "0x7c487845f98938Bb955B1D5AD069d9a30e4131fd",
    twBYOCRegistry: constants.AddressZero,
  },
};

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
      return process.env.factoryAddress as string;
    } else if (contractName === "twRegistry") {
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
  if (process.env.contractPublisherAddress) {
    return process.env.contractPublisherAddress as string;
  } else {
    return ContractPublisher_address;
  }
}

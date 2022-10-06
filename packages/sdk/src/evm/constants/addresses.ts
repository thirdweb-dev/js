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

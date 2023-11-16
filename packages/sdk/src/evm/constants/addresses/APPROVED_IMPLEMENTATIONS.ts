import type { PrebuiltContractType } from "../../contracts";
import { SUPPORTED_CHAIN_ID } from "../chains/SUPPORTED_CHAIN_ID";
import { ChainId } from "../chains/ChainId";

type DropContract = Extract<
  PrebuiltContractType,
  "nft-drop" | "token-drop" | "edition-drop" | "signature-drop"
>;

// @deprecated - should not be needed anymore, rely on the publish data instead
export const APPROVED_IMPLEMENTATIONS: Record<
  SUPPORTED_CHAIN_ID,
  Record<DropContract, string>
> = /* @__PURE__ */ {
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
  [ChainId.ArbitrumSepolia]: {
    "nft-drop": "",
    "edition-drop": "",
    "token-drop": "",
    "signature-drop": "", // TODO
  },
  [ChainId.BinanceSmartChainTestnet]: {
    "nft-drop": "",
    "edition-drop": "",
    "token-drop": "",
    "signature-drop": "", // TODO
  },
  [ChainId.Hardhat]: {
    "nft-drop": "",
    "edition-drop": "",
    "token-drop": "",
    "signature-drop": "", // TODO
  },
  [ChainId.Localhost]: {
    "nft-drop": "",
    "edition-drop": "",
    "token-drop": "",
    "signature-drop": "", // TODO
  },
};

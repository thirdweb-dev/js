import { QuestionIcon } from "@chakra-ui/icons";
import {
  Arbitrum,
  Avalanche,
  BinanceCoin,
  Ethereum,
  Fantom,
  Optimism,
  Polygon,
} from "@thirdweb-dev/chain-icons";
import { ChainId, useAddress, useNetwork } from "@thirdweb-dev/react";
import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { useCallback } from "react";

interface NetworkMetadata {
  chainName: string;
  icon: React.ComponentType;
  symbol: string;
  isTestnet: boolean;
  chainId: ChainId;
}

export const FAUCETS: Partial<Record<ChainId, string>> = {
  [ChainId.Rinkeby]: "https://rinkebyfaucet.com",
  [ChainId.Goerli]: "https://faucet.paradigm.xyz/",
  [ChainId.Mumbai]: "https://mumbaifaucet.com",
  [ChainId.AvalancheFujiTestnet]: "https://faucet.avax.network/",
  [ChainId.FantomTestnet]: "https://faucet.fantom.network/",
  [ChainId.OptimismTestnet]: "https://kovan.optifaucet.com/",
  [ChainId.ArbitrumTestnet]: "https://faucet.paradigm.xyz/",
};

const defaultNetworkMetadata: Record<SUPPORTED_CHAIN_ID, NetworkMetadata> = {
  [ChainId.Mainnet]: {
    chainName: "Ethereum",
    icon: Ethereum,
    symbol: NATIVE_TOKENS[ChainId.Mainnet].symbol,
    isTestnet: false,
    chainId: ChainId.Mainnet,
  },
  [ChainId.Rinkeby]: {
    chainName: "Rinkeby",
    icon: Ethereum,
    symbol: NATIVE_TOKENS[ChainId.Rinkeby].symbol,
    isTestnet: true,
    chainId: ChainId.Rinkeby,
  },
  [ChainId.Goerli]: {
    chainName: "Goerli",
    icon: Ethereum,
    symbol: NATIVE_TOKENS[ChainId.Goerli].symbol,
    isTestnet: true,
    chainId: ChainId.Goerli,
  },
  [ChainId.Polygon]: {
    chainName: "Polygon",
    icon: Polygon,
    symbol: NATIVE_TOKENS[ChainId.Polygon].symbol,
    isTestnet: false,
    chainId: ChainId.Polygon,
  },
  [ChainId.Mumbai]: {
    chainName: "Mumbai",
    icon: Polygon,
    symbol: NATIVE_TOKENS[ChainId.Mumbai].symbol,
    isTestnet: true,
    chainId: ChainId.Mumbai,
  },
  [ChainId.Fantom]: {
    chainName: "Fantom",
    icon: Fantom,
    symbol: NATIVE_TOKENS[ChainId.Fantom].symbol,
    isTestnet: false,
    chainId: ChainId.Fantom,
  },
  [ChainId.FantomTestnet]: {
    chainName: "Fantom Testnet",
    icon: Fantom,
    symbol: NATIVE_TOKENS[ChainId.FantomTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.Fantom,
  },
  [ChainId.Avalanche]: {
    chainName: "Avalanche",
    icon: Avalanche,
    symbol: NATIVE_TOKENS[ChainId.Avalanche].symbol,
    isTestnet: false,
    chainId: ChainId.Avalanche,
  },
  [ChainId.AvalancheFujiTestnet]: {
    chainName: "Avalanche Fuji Testnet",
    icon: Avalanche,
    symbol: NATIVE_TOKENS[ChainId.AvalancheFujiTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.AvalancheFujiTestnet,
  },
  [ChainId.Optimism]: {
    chainName: "Optimism",
    icon: Optimism,
    symbol: NATIVE_TOKENS[ChainId.Optimism].symbol,
    isTestnet: false,
    chainId: ChainId.Optimism,
  },
  [ChainId.OptimismTestnet]: {
    chainName: "Optimism Testnet",
    icon: Optimism,
    symbol: NATIVE_TOKENS[ChainId.OptimismTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.OptimismTestnet,
  },
  [ChainId.Arbitrum]: {
    chainName: "Arbitrum",
    icon: Arbitrum,
    symbol: NATIVE_TOKENS[ChainId.Arbitrum].symbol,
    isTestnet: false,
    chainId: ChainId.Arbitrum,
  },
  [ChainId.ArbitrumTestnet]: {
    chainName: "Arbitrum Testnet",
    icon: Arbitrum,
    symbol: NATIVE_TOKENS[ChainId.ArbitrumTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.ArbitrumTestnet,
  },
  [ChainId.BinanceSmartChainMainnet]: {
    chainName: "Binance Smart Chain",
    icon: BinanceCoin,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet].symbol,
    isTestnet: false,
    chainId: ChainId.BinanceSmartChainMainnet,
  },
  [ChainId.BinanceSmartChainTestnet]: {
    chainName: "Binance Smart Chain Testnet",
    icon: BinanceCoin,
    symbol: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet].symbol,
    isTestnet: true,
    chainId: ChainId.BinanceSmartChainTestnet,
  },
};

export function useWeb3() {
  const address = useAddress();
  const [network] = useNetwork();

  const getNetworkMetadata = useCallback(
    (chainId: SUPPORTED_CHAIN_ID) => {
      const cData: NetworkMetadata = {
        chainName: "Unsupported Chain",
        icon: QuestionIcon,
        isTestnet: false,
        symbol: "",
        chainId,
      };
      const c = network.data.chains.find((chain) => chain.id === chainId);

      if (chainId in defaultNetworkMetadata) {
        cData.chainName = defaultNetworkMetadata[chainId].chainName;
        cData.isTestnet = defaultNetworkMetadata[chainId].isTestnet;
        cData.symbol = defaultNetworkMetadata[chainId].symbol;
        cData.icon = defaultNetworkMetadata[chainId].icon;
      } else if (c) {
        cData.chainName = c.name;
        cData.isTestnet = !!c.testnet;
        cData.symbol = c.nativeCurrency?.symbol || "";
      }
      return cData;
    },
    [network],
  );

  return {
    getNetworkMetadata,
    // error: account.error,
    address,
    chainId: network.data.chain?.id,
  };
}

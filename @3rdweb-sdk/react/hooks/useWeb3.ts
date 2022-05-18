import { QuestionIcon } from "@chakra-ui/icons";
import {
  Avalanche,
  Ethereum,
  Fantom,
  Polygon,
} from "@thirdweb-dev/chain-icons";
import { useAddress, useNetwork } from "@thirdweb-dev/react";
import { alchemyUrlMap } from "components/app-layouts/providers";
import { BigNumber, ethers, utils } from "ethers";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { ChainId, SUPPORTED_CHAIN_ID } from "utils/network";

interface NetworkMetadata {
  chainName: string;
  icon: React.ComponentType;
  symbol: string;
  isTestnet: boolean;
  chainId: ChainId;
}

const defaultNetworkMetadata: Record<SUPPORTED_CHAIN_ID, NetworkMetadata> = {
  [ChainId.Mainnet]: {
    chainName: "Ethereum",
    icon: Ethereum,
    symbol: "ETH",
    isTestnet: false,
    chainId: ChainId.Mainnet,
  },
  [ChainId.Rinkeby]: {
    chainName: "Rinkeby",
    icon: Ethereum,
    symbol: "ETH",
    isTestnet: true,
    chainId: ChainId.Rinkeby,
  },
  [ChainId.Goerli]: {
    chainName: "Goerli",
    icon: Ethereum,
    symbol: "ETH",
    isTestnet: true,
    chainId: ChainId.Goerli,
  },
  [ChainId.Polygon]: {
    chainName: "Polygon",
    icon: Polygon,
    symbol: "MATIC",
    isTestnet: false,
    chainId: ChainId.Polygon,
  },
  [ChainId.Fantom]: {
    chainName: "Fantom",
    icon: Fantom,
    symbol: "FTM",
    isTestnet: false,
    chainId: ChainId.Fantom,
  },
  [ChainId.Avalanche]: {
    chainName: "Avalanche",
    icon: Avalanche,
    symbol: "AVAX",
    isTestnet: false,
    chainId: ChainId.Avalanche,
  },
  [ChainId.Mumbai]: {
    chainName: "Mumbai",
    icon: Polygon,
    symbol: "MATIC",
    isTestnet: true,
    chainId: ChainId.Mumbai,
  },
};

const useBalance = (address?: string) => {
  const [network] = useNetwork();
  const chainId = network.data.chain?.id;
  return useQuery(
    ["balance", address, { chainId }],
    async () => {
      let balance = BigNumber.from(0);
      if (chainId) {
        const provider = ethers.getDefaultProvider(
          chainId in alchemyUrlMap
            ? alchemyUrlMap[chainId as SUPPORTED_CHAIN_ID]
            : chainId,
        );
        balance = await provider.getBalance(address || "");
      }

      balance = BigNumber.from(balance || 0);

      return {
        value: balance,
        formatted: utils.formatEther(balance).slice(0, 6),
      };
    },
    {
      enabled: !!chainId && !!address,
    },
  );
};

export function useWeb3() {
  const address = useAddress();
  const [network] = useNetwork();
  const balance = useBalance(address);

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
    balance,
  };
}

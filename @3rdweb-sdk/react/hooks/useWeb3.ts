import { ChainId } from "@thirdweb-dev/react";
import { useConfiguredChainsRecord } from "hooks/chains/configureChains";
import { useCallback } from "react";

interface NetworkMetadata {
  chainName: string;
  icon?: string;
  symbol: string;
  isTestnet: boolean | "unknown";
  chainId: ChainId;
  iconSizes?: readonly number[];
}

export const FAUCETS: Partial<Record<ChainId, string>> = {
  [ChainId.Goerli]: "https://faucet.paradigm.xyz/",
  [ChainId.Mumbai]: "https://mumbaifaucet.com",
  [ChainId.AvalancheFujiTestnet]: "https://faucet.avax.network/",
  [ChainId.FantomTestnet]: "https://faucet.fantom.network/",

  [ChainId.BinanceSmartChainTestnet]:
    "https://testnet.binance.org/faucet-smart",
  [ChainId.OptimismGoerli]: "https://app.optimism.io/bridge/deposit",
  [ChainId.ArbitrumGoerli]: "https://bridge.arbitrum.io/?l2ChainId=421613",
};

const defaultIcon = `https://gateway.ipfscdn.io/ipfs/QmNTemZCjCGyN8x9vFQFyAHVeZc9QZu4nCiSANNaZX5Buq/unknown-logo.png`;

export function useWeb3() {
  const configuredChainsRecord = useConfiguredChainsRecord();

  const getNetworkMetadata = useCallback(
    (chainId: number, includeAutoConfiguredChains = true): NetworkMetadata => {
      const isKnown = chainId in configuredChainsRecord;
      const canUse =
        isKnown &&
        (includeAutoConfiguredChains ||
          !configuredChainsRecord[chainId].isAutoConfigured);

      if (canUse) {
        const configuredChain = configuredChainsRecord[chainId];
        const iconUrl = configuredChain.icon?.url;

        return {
          chainName: configuredChain.name,
          icon: iconUrl,
          isTestnet: configuredChain.testnet,
          symbol: configuredChain.nativeCurrency.symbol,
          chainId,
          iconSizes: configuredChain.icon?.sizes,
        };
      }

      // Defaults for Unresolved chain
      return {
        chainName: `Chain ID #${chainId}`,
        icon: defaultIcon,
        isTestnet: "unknown",
        symbol: "",
        chainId,
      };
    },
    [configuredChainsRecord],
  );

  return {
    getNetworkMetadata,
  };
}

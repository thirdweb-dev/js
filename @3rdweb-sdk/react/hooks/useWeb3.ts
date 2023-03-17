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

const defaultIcon = `https://ipfs.thirdwebcdn.com/ipfs/QmNTemZCjCGyN8x9vFQFyAHVeZc9QZu4nCiSANNaZX5Buq/unknown-logo.png`;

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

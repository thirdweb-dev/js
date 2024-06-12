import { popularChains } from "@3rdweb-sdk/react/components/popularChains";
import { useColorMode } from "@chakra-ui/react";
import { NetworkSelector } from "@thirdweb-dev/react";
import { ChainIcon } from "components/icons/ChainIcon";
import type { StoredChain } from "contexts/configured-chains";
import { useSupportedChains } from "hooks/chains/configureChains";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useActiveWallet } from "thirdweb/react";
import { Button } from "tw-components";
import { useFavoriteChains } from "../../@3rdweb-sdk/react/hooks/useFavoriteChains";
import { useActiveChainAsDashboardChain } from "../../lib/v5-adapter";
import { CustomChainRenderer } from "./CustomChainRenderer";

interface NetworkSelectorButtonProps {
  disabledChainIds?: number[];
  networksEnabled?: number[];
  isDisabled?: boolean;
  onSwitchChain?: (chain: StoredChain) => void;
}

export const NetworkSelectorButton: React.FC<NetworkSelectorButtonProps> = ({
  disabledChainIds,
  networksEnabled,
  isDisabled,
  onSwitchChain,
}) => {
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const recentlyUsedChains = useRecentlyUsedChains();
  const addRecentlyUsedChains = useAddRecentlyUsedChainId();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const { colorMode } = useColorMode();
  const supportedChains = useSupportedChains();
  const favoriteChainsQuery = useFavoriteChains();

  const chains = useMemo(() => {
    if (disabledChainIds && disabledChainIds.length > 0) {
      const disabledChainIdsSet = new Set(disabledChainIds);
      return supportedChains.filter(
        (chain) => !disabledChainIdsSet.has(chain.chainId),
      );
    }

    if (networksEnabled && networksEnabled.length > 0) {
      const networksEnabledSet = new Set(networksEnabled);
      return supportedChains.filter((chain) =>
        networksEnabledSet.has(chain.chainId),
      );
    }
  }, [disabledChainIds, networksEnabled, supportedChains]);

  const filteredRecentlyUsedChains = useMemo(() => {
    if (recentlyUsedChains && recentlyUsedChains.length > 0) {
      if (disabledChainIds && disabledChainIds.length > 0) {
        const disabledChainIdsSet = new Set(disabledChainIds);
        return recentlyUsedChains.filter(
          (chain) => !disabledChainIdsSet.has(chain.chainId),
        );
      }

      if (networksEnabled && networksEnabled.length > 0) {
        const networksEnabledSet = new Set(networksEnabled);
        return recentlyUsedChains.filter((chain) =>
          networksEnabledSet.has(chain.chainId),
        );
      }
    }
  }, [recentlyUsedChains, disabledChainIds, networksEnabled]);

  const chain = useActiveChainAsDashboardChain();
  const prevChain = useRef(chain);

  // handle switch network done from wallet app/extension
  // TODO: legitimate use-case, but maybe theres a better way to hook into this?
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!chain) {
      return;
    }
    if (prevChain.current?.chainId !== chain.chainId) {
      if (onSwitchChain) {
        onSwitchChain(chain);
      }
      addRecentlyUsedChains(chain.chainId);
      prevChain.current = chain;
    }
  }, [chain, onSwitchChain, addRecentlyUsedChains]);

  const wallet = useActiveWallet();

  return (
    <>
      <Button
        isDisabled={isDisabled || !wallet}
        display="flex"
        bg="inputBg"
        _hover={{
          bg: "inputBgHover",
        }}
        width="100%"
        variant="solid"
        style={{
          textAlign: "left",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onClick={() => {
          setShowNetworkSelector(true);
        }}
        leftIcon={<ChainIcon ipfsSrc={chain?.icon?.url} size={20} />}
      >
        {chain?.name || "Select Network"}

        <BiChevronDown
          style={{
            marginLeft: "auto",
          }}
        />
      </Button>

      {showNetworkSelector && (
        <NetworkSelector
          open={showNetworkSelector}
          theme={colorMode}
          chains={chains}
          sections={[
            {
              label: "Recently Used",
              chains: filteredRecentlyUsedChains ?? [],
            },
            {
              label: "Favorites",
              chains: favoriteChainsQuery.data ?? [],
            },
            {
              label: "Popular",
              chains: networksEnabled ? [] : popularChains,
            },
          ]}
          renderChain={CustomChainRenderer}
          onCustomClick={
            networksEnabled
              ? undefined
              : () => {
                  setIsNetworkConfigModalOpen(true);
                }
          }
          onClose={() => {
            setShowNetworkSelector(false);
          }}
          onSwitch={(_chain) => {
            onSwitchChain?.(_chain);
            addRecentlyUsedChains(_chain.chainId);
          }}
        />
      )}
    </>
  );
};

import { Button } from "@/components/ui/button";
import { thirdwebClient } from "@/constants/client";
import { popularChains } from "@3rdweb-sdk/react/components/popularChains";
import { useFavoriteChains } from "@3rdweb-sdk/react/hooks/useFavoriteChains";
import { ChainIcon } from "components/icons/ChainIcon";
import type { StoredChain } from "contexts/configured-chains";
import {
  useSupportedChains,
  useSupportedChainsRecord,
} from "hooks/chains/configureChains";
import {
  useAddRecentlyUsedChainId,
  useRecentlyUsedChains,
} from "hooks/chains/recentlyUsedChains";
import { useSetIsNetworkConfigModalOpen } from "hooks/networkConfigModal";
import { useActiveChainAsDashboardChain } from "lib/v5-adapter";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useActiveWallet } from "thirdweb/react";
import { useNetworkSwitcherModal } from "thirdweb/react";
import { getSDKTheme } from "../../app/components/sdk-component-theme";
import { mapV4ChainToV5Chain } from "../../contexts/map-chains";
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
  const recentlyUsedChains = useRecentlyUsedChains();
  const addRecentlyUsedChains = useAddRecentlyUsedChainId();
  const setIsNetworkConfigModalOpen = useSetIsNetworkConfigModalOpen();
  const { theme } = useTheme();
  const supportedChains = useSupportedChains();
  const supportedChainsRecord = useSupportedChainsRecord();
  const favoriteChainsQuery = useFavoriteChains();
  const networkSwitcherModal = useNetworkSwitcherModal();

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

    // if no restrictions, show all supported chains
    return supportedChains;
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
        variant="secondary"
        disabled={isDisabled || !wallet}
        className="w-full text-left justify-start gap-2"
        onClick={() => {
          networkSwitcherModal.open({
            theme: getSDKTheme(theme === "light" ? "light" : "dark"),
            sections: [
              {
                label: "Recently Used",
                chains: (filteredRecentlyUsedChains ?? []).map(
                  mapV4ChainToV5Chain,
                ),
              },
              {
                label: "Favorites",
                chains: (favoriteChainsQuery.data ?? []).map(
                  mapV4ChainToV5Chain,
                ),
              },
              {
                label: "Popular",
                chains: networksEnabled ? [] : popularChains,
              },
              {
                label: "All Networks",
                chains: (chains ?? []).map(mapV4ChainToV5Chain),
              },
            ],
            renderChain: CustomChainRenderer,
            onCustomClick: networksEnabled
              ? undefined
              : () => {
                  setIsNetworkConfigModalOpen(true);
                },
            async onSwitch(chain) {
              addRecentlyUsedChains(chain.id);
              if (onSwitchChain) {
                if (supportedChainsRecord[chain.id]) {
                  onSwitchChain(supportedChainsRecord[chain.id]);
                }
              }
            },
            client: thirdwebClient,
          });
        }}
      >
        <ChainIcon ipfsSrc={chain?.icon?.url} size={20} />
        {chain?.name || "Select Network"}

        <BiChevronDown className="ml-auto size-3" />
      </Button>
    </>
  );
};

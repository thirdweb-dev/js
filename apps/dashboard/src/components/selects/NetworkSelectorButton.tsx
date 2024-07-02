import { popularChains } from "@3rdweb-sdk/react/components/popularChains";
import { useColorMode } from "@chakra-ui/react";
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
import { useEffect, useMemo, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import type { Chain } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import { useNetworkSwitcherModal } from "thirdweb/react";
import { Button } from "tw-components";
import { thirdwebClient } from "../../@/constants/client";
import { useFavoriteChains } from "../../@3rdweb-sdk/react/hooks/useFavoriteChains";
import { useActiveChainAsDashboardChain } from "../../lib/v5-adapter";

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
  const { colorMode } = useColorMode();
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
          networkSwitcherModal.open({
            theme: colorMode === "dark" ? "dark" : "light",
            sections: [
              {
                label: "Recently Used",
                chains: (filteredRecentlyUsedChains ?? []).map(
                  mapStoredChainTov5Chain,
                ),
              },
              {
                label: "Favorites",
                chains: (favoriteChainsQuery.data ?? []).map(
                  mapStoredChainTov5Chain,
                ),
              },
              {
                label: "Popular",
                chains: (networksEnabled ? [] : popularChains).map(
                  mapStoredChainTov5Chain,
                ),
              },
              {
                label: "All Networks",
                chains: (chains ?? []).map(mapStoredChainTov5Chain),
              },
            ],
            // TODO: bring this back when it works reliably
            // renderChain: CustomChainRenderer,
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
        leftIcon={<ChainIcon ipfsSrc={chain?.icon?.url} size={20} />}
      >
        {chain?.name || "Select Network"}

        <BiChevronDown
          style={{
            marginLeft: "auto",
          }}
        />
      </Button>
    </>
  );
};

function mapStoredChainTov5Chain(v4Chain: StoredChain) {
  const chain: Chain = {
    id: v4Chain.chainId,
    rpc: v4Chain.rpc[0],
    // TypeScript shenanigans, just avoiding as string assertion here
    blockExplorers: v4Chain.explorers?.map((x) => x),
    // TypeScript shenanigans, just avoiding as string assertion here
    faucets: v4Chain.faucets?.map((x) => x),
    name: v4Chain.name,
    icon: v4Chain.icon,
    testnet: v4Chain.testnet === true ? true : undefined,
    nativeCurrency: v4Chain.nativeCurrency,
  };

  return chain;
}

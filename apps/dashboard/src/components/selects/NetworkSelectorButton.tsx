"use client";

import { popularChains } from "@3rdweb-sdk/react/components/popularChains";
import { ChainIconClient } from "components/icons/ChainIcon";
import { useAllChainsData } from "hooks/chains/allChains";
import { useActiveChainAsDashboardChain } from "lib/v5-adapter";
import { ChevronDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveWallet, useNetworkSwitcherModal } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/reactive";
import { cn } from "@/lib/utils";
import { useFavoriteChainIds } from "../../app/(app)/(dashboard)/(chain)/components/client/star-button";
import { getSDKTheme } from "../../app/(app)/components/sdk-component-theme";
import { mapV4ChainToV5Chain } from "../../contexts/map-chains";
import {
  addRecentlyUsedChainId,
  recentlyUsedChainIdsStore,
  type StoredChain,
} from "../../stores/chainStores";
import { LazyConfigureNetworkModal } from "../configure-networks/LazyConfigureNetworkModal";
import { CustomChainRenderer } from "./CustomChainRenderer";

interface NetworkSelectorButtonProps {
  disabledChainIds?: number[];
  networksEnabled?: number[];
  isDisabled?: boolean;
  onSwitchChain?: (chain: StoredChain) => void;
  className?: string;
  client: ThirdwebClient;
}

export const NetworkSelectorButton: React.FC<NetworkSelectorButtonProps> = ({
  disabledChainIds,
  networksEnabled,
  isDisabled,
  onSwitchChain,
  className,
  client,
}) => {
  const { idToChain, allChains } = useAllChainsData();

  // recently used chains
  const recentlyUsedChainIds = useStore(recentlyUsedChainIdsStore);
  const recentlyUsedChains = useMemo(() => {
    return recentlyUsedChainIds
      .map((id) => idToChain.get(id))
      .filter((v) => !!v);
  }, [recentlyUsedChainIds, idToChain]);

  // configure network modal
  const [isNetworkConfigModalOpen, setIsNetworkConfigModalOpen] =
    useState(false);
  const [editChain, setEditChain] = useState<StoredChain | undefined>(
    undefined,
  );

  const { theme } = useTheme();
  const favoriteChainIdsQuery = useFavoriteChainIds();

  const popularChainsWithMetadata = useMemo(() => {
    // eslint-disable-next-line no-restricted-syntax
    return popularChains.map((x) =>
      // eslint-disable-next-line no-restricted-syntax
      {
        const v4Chain = idToChain.get(x.id);
        // eslint-disable-next-line no-restricted-syntax
        return v4Chain ? mapV4ChainToV5Chain(v4Chain) : x;
      },
    );
  }, [idToChain]);

  const favoriteChainsWithMetadata = useMemo(() => {
    return (favoriteChainIdsQuery.data || [])
      .map((id) => {
        const c = idToChain.get(Number(id));
        // eslint-disable-next-line no-restricted-syntax
        return c ? mapV4ChainToV5Chain(c) : undefined;
      })
      .filter((x) => !!x);
  }, [idToChain, favoriteChainIdsQuery.data]);

  const networkSwitcherModal = useNetworkSwitcherModal();

  const chains = useMemo(() => {
    if (disabledChainIds && disabledChainIds.length > 0) {
      const disabledChainIdsSet = new Set(disabledChainIds);
      return allChains.filter(
        (chain) => !disabledChainIdsSet.has(chain.chainId),
      );
    }

    if (networksEnabled && networksEnabled.length > 0) {
      const networksEnabledSet = new Set(networksEnabled);
      return allChains.filter((chain) => networksEnabledSet.has(chain.chainId));
    }

    // if no restrictions, show all supported chains
    return allChains;
  }, [disabledChainIds, networksEnabled, allChains]);

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

  // handle switch network done from wallet app/(app)/extension
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
      addRecentlyUsedChainId(chain.chainId);
      prevChain.current = chain;
    }
  }, [chain, onSwitchChain]);

  const wallet = useActiveWallet();

  return (
    <>
      <Button
        className={cn("w-full justify-start gap-2 text-left", className)}
        disabled={isDisabled || !wallet}
        onClick={() => {
          networkSwitcherModal.open({
            client,
            onCustomClick: networksEnabled
              ? undefined
              : () => {
                  setEditChain(undefined);
                  setIsNetworkConfigModalOpen(true);
                },
            async onSwitch(chain) {
              addRecentlyUsedChainId(chain.id);
              if (onSwitchChain) {
                const storedChain = idToChain.get(chain.id);
                if (storedChain) {
                  onSwitchChain(storedChain);
                }
              }
            },
            renderChain(props) {
              return (
                <CustomChainRenderer
                  {...props}
                  client={client}
                  openEditChainModal={(c) => {
                    setIsNetworkConfigModalOpen(true);
                    setEditChain(c);
                  }}
                />
              );
            },
            sections: [
              {
                chains: (filteredRecentlyUsedChains ?? []).map(
                  mapV4ChainToV5Chain,
                ),
                label: "Recently Used",
              },
              {
                chains: favoriteChainsWithMetadata,
                label: "Favorites",
              },
              {
                chains: networksEnabled ? [] : popularChainsWithMetadata,
                label: "Popular",
              },
              {
                chains: (chains ?? []).map(mapV4ChainToV5Chain),
                label: "All Networks",
              },
            ],
            theme: getSDKTheme(theme === "light" ? "light" : "dark"),
          });
        }}
        variant="outline"
      >
        <ChainIconClient
          className="size-5"
          client={client}
          src={chain?.icon?.url}
        />
        {chain?.name || "Select Network"}

        <ChevronDownIcon className="ml-auto size-4" />
      </Button>

      <LazyConfigureNetworkModal
        client={client}
        editChain={editChain}
        onOpenChange={setIsNetworkConfigModalOpen}
        open={isNetworkConfigModalOpen}
      />
    </>
  );
};

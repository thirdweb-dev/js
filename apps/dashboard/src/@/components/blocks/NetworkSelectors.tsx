"use client";

import { useCallback, useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { MultiSelect } from "@/components/blocks/multi-select";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

type Option = { label: string; value: string };

export function MultiNetworkSelector(props: {
  selectedChainIds: number[];
  onChange: (chainIds: number[]) => void;
  disableChainId?: boolean;
  className?: string;
  priorityChains?: number[];
  hideTestnets?: boolean;
  popoverContentClassName?: string;
  customTrigger?: React.ReactNode;
  align?: "center" | "start" | "end";
  side?: "left" | "right" | "top" | "bottom";
  showSelectedValuesInModal?: boolean;
  client: ThirdwebClient;
  chainIds?: number[];
}) {
  const { allChains, idToChain } = useAllChainsData();

  const options = useMemo(() => {
    let chains = allChains.filter((chain) => chain.status !== "deprecated");

    if (props.chainIds && props.chainIds.length > 0) {
      chains = allChains.filter((chain) =>
        props.chainIds?.includes(chain.chainId),
      );
    }

    let sortedChains = chains;

    if (props.priorityChains) {
      const priorityChainsSet = new Set();
      for (const chainId of props.priorityChains || []) {
        priorityChainsSet.add(chainId);
      }

      const priorityChains = (props.priorityChains || [])
        .map((chainId) => {
          return idToChain.get(chainId);
        })
        .filter((v) => !!v);

      const otherChains = allChains.filter(
        (chain) => !priorityChainsSet.has(chain.chainId),
      );

      sortedChains = [...priorityChains, ...otherChains];
    }

    if (props.hideTestnets) {
      sortedChains = sortedChains.filter((chain) => !chain.testnet);
    }

    return sortedChains.map((chain) => {
      return {
        label: cleanChainName(chain.name),
        value: String(chain.chainId),
      };
    });
  }, [
    allChains,
    props.priorityChains,
    idToChain,
    props.hideTestnets,
    props.chainIds,
  ]);

  const searchFn = useCallback(
    (option: Option, searchValue: string) => {
      const chain = idToChain.get(Number(option.value));
      if (!chain) {
        return false;
      }

      if (Number.isInteger(Number(searchValue))) {
        return String(chain.chainId).startsWith(searchValue);
      }
      return chain.name.toLowerCase().includes(searchValue.toLowerCase());
    },
    [idToChain],
  );

  const renderOption = useCallback(
    (option: Option) => {
      const chain = idToChain.get(Number(option.value));
      if (!chain) {
        return option.label;
      }

      return (
        <div className="flex justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <ChainIconClient
              className="size-5"
              client={props.client}
              loading="lazy"
              src={chain.icon?.url}
            />
            {cleanChainName(chain.name)}
          </span>

          {!props.disableChainId && (
            <Badge className="gap-2" variant="outline">
              <span className="text-muted-foreground">Chain ID</span>
              {chain.chainId}
            </Badge>
          )}
        </div>
      );
    },
    [idToChain, props.disableChainId, props.client],
  );

  return (
    <MultiSelect
      align={props.align}
      className={props.className}
      customTrigger={props.customTrigger}
      disabled={allChains.length === 0}
      onSelectedValuesChange={(chainIds) => {
        props.onChange(chainIds.map(Number));
      }}
      options={options}
      overrideSearchFn={searchFn}
      placeholder={
        allChains.length === 0 ? "Loading Chains..." : "Select Chains"
      }
      popoverContentClassName={props.popoverContentClassName}
      renderOption={renderOption}
      searchPlaceholder="Search by Name or Chain Id"
      selectedValues={props.selectedChainIds.map(String)}
      showSelectedValuesInModal={props.showSelectedValuesInModal}
      side={props.side}
    />
  );
}

export function SingleNetworkSelector(props: {
  chainId: number | undefined;
  onChange: (chainId: number) => void;
  className?: string;
  popoverContentClassName?: string;
  // if specified - only these chains will be shown
  chainIds?: number[];
  side?: "left" | "right" | "top" | "bottom";
  disableChainId?: boolean;
  align?: "center" | "start" | "end";
  disableTestnets?: boolean;
  disableDeprecated?: boolean;
  placeholder?: string;
  client: ThirdwebClient;
  priorityChains?: number[];
}) {
  const { allChains, idToChain } = useAllChainsData();

  const chainsToShow = useMemo(() => {
    let chains = allChains;

    chains = chains.filter((chain) => chain.status !== "deprecated");

    if (props.disableTestnets) {
      chains = chains.filter((chain) => !chain.testnet);
    }

    if (props.priorityChains) {
      const priorityChainsSet = new Set();
      for (const chainId of props.priorityChains || []) {
        priorityChainsSet.add(chainId);
      }

      const priorityChains = (props.priorityChains || [])
        .map((chainId) => {
          return idToChain.get(chainId);
        })
        .filter((v) => !!v);

      const otherChains = allChains.filter(
        (chain) => !priorityChainsSet.has(chain.chainId),
      );

      chains = [...priorityChains, ...otherChains];
    }

    if (props.chainIds) {
      const chainIdSet = new Set(props.chainIds);
      chains = chains.filter((chain) => chainIdSet.has(chain.chainId));
    }

    if (props.disableDeprecated) {
      chains = chains.filter((chain) => chain.status !== "deprecated");
    }

    return chains;
  }, [
    allChains,
    props.chainIds,
    props.disableTestnets,
    props.disableDeprecated,
    props.priorityChains,
    idToChain,
  ]);

  const options = useMemo(() => {
    return chainsToShow.map((chain) => {
      return {
        label: chain.name,
        value: String(chain.chainId),
      };
    });
  }, [chainsToShow]);

  const searchFn = useCallback(
    (option: Option, searchValue: string) => {
      const chain = idToChain.get(Number(option.value));
      if (!chain) {
        return false;
      }

      if (Number.isInteger(Number(searchValue))) {
        return String(chain.chainId).startsWith(searchValue);
      }
      return chain.name.toLowerCase().includes(searchValue.toLowerCase());
    },
    [idToChain],
  );

  const renderOption = useCallback(
    (option: Option) => {
      const chain = idToChain.get(Number(option.value));
      if (!chain) {
        return option.label;
      }

      return (
        <div className="flex justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <ChainIconClient
              className="size-5"
              client={props.client}
              loading="lazy"
              src={chain.icon?.url}
            />
            {cleanChainName(chain.name)}
          </span>

          {!props.disableChainId && (
            <Badge className="gap-2 max-sm:hidden" variant="outline">
              <span className="text-muted-foreground">Chain ID</span>
              {chain.chainId}
            </Badge>
          )}
        </div>
      );
    },
    [idToChain, props.disableChainId, props.client],
  );

  const isLoadingChains = allChains.length === 0;

  return (
    <SelectWithSearch
      align={props.align}
      className={props.className}
      closeOnSelect={true}
      disabled={isLoadingChains}
      onValueChange={(chainId) => {
        props.onChange(Number(chainId));
      }}
      options={options}
      overrideSearchFn={searchFn}
      placeholder={
        isLoadingChains
          ? "Loading Chains..."
          : props.placeholder || "Select Chain"
      }
      popoverContentClassName={props.popoverContentClassName}
      renderOption={renderOption}
      searchPlaceholder="Search by Name or Chain ID"
      showCheck={false}
      side={props.side}
      value={String(props.chainId)}
    />
  );
}

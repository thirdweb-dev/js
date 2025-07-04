"use client";

import { useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useAllChainsData } from "../../app/hooks/chains";
import { SelectWithSearch } from "../ui/select-with-search";
import { ChainIcon } from "./ChainIcon";
import { MultiSelect } from "./multi-select";

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
  popoverContentClassName?: string;
  chainIds?: number[];
  selectedBadgeClassName?: string;
}) {
  const { allChains, idToChain } = useAllChainsData().data;

  const chainsToShow = useMemo(() => {
    if (!props.chainIds) {
      return allChains;
    }
    const chainIdSet = new Set(props.chainIds);
    return allChains.filter((chain) => chainIdSet.has(chain.chainId));
  }, [allChains, props.chainIds]);

  const options = useMemo(() => {
    let sortedChains = chainsToShow;

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

      const otherChains = chainsToShow.filter(
        (chain) => !priorityChainsSet.has(chain.chainId),
      );

      sortedChains = [...priorityChains, ...otherChains];
    }

    return sortedChains.map((chain) => {
      return {
        label: cleanChainName(chain.name),
        value: String(chain.chainId),
      };
    });
  }, [chainsToShow, props.priorityChains, idToChain]);

  const searchFn = useCallback(
    (option: Option, searchValue: string) => {
      const chain = idToChain.get(Number(option.value));
      if (!chain) {
        return false;
      }

      if (Number.isInteger(Number.parseInt(searchValue))) {
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
            <ChainIcon
              className="size-5"
              ipfsSrc={chain.icon?.url}
              loading="lazy"
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
    [idToChain, props.disableChainId],
  );

  return (
    <MultiSelect
      className={props.className}
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
      selectedBadgeClassName={props.selectedBadgeClassName}
      selectedValues={props.selectedChainIds.map(String)}
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
  placeholder?: string;
}) {
  const { allChains, idToChain } = useAllChainsData().data;

  const chainsToShow = useMemo(() => {
    let chains = allChains;

    if (props.disableTestnets) {
      chains = chains.filter((chain) => !chain.testnet);
    }

    if (props.chainIds) {
      const chainIdSet = new Set(props.chainIds);
      chains = chains.filter((chain) => chainIdSet.has(chain.chainId));
    }

    return chains;
  }, [allChains, props.chainIds, props.disableTestnets]);

  const options = useMemo(() => {
    return chainsToShow.map((chain) => {
      return {
        label: cleanChainName(chain.name),
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

      if (Number.isInteger(Number.parseInt(searchValue))) {
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
            <ChainIcon
              className="size-5"
              ipfsSrc={chain.icon?.url}
              loading="lazy"
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
    [idToChain, props.disableChainId],
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
      value={props.chainId?.toString()}
    />
  );
}

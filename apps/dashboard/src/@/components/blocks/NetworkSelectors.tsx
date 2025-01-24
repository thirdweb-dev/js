"use client";

import { MultiSelect } from "@/components/blocks/multi-select";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo } from "react";
import { ChainIcon } from "../../../components/icons/ChainIcon";
import { useAllChainsData } from "../../../hooks/chains/allChains";

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

type Option = { label: string; value: string };

export function MultiNetworkSelector(props: {
  selectedChainIds: number[];
  onChange: (chainIds: number[]) => void;
}) {
  const { allChains, idToChain } = useAllChainsData();

  const options = useMemo(() => {
    return allChains.map((chain) => {
      return {
        label: cleanChainName(chain.name),
        value: String(chain.chainId),
      };
    });
  }, [allChains]);

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
            {cleanChainName(chain.name)}
          </span>
          <Badge variant="outline" className="gap-2">
            <span className="text-muted-foreground">Chain ID</span>
            {chain.chainId}
          </Badge>
        </div>
      );
    },
    [idToChain],
  );

  return (
    <MultiSelect
      searchPlaceholder="Search by Name or Chain Id"
      selectedValues={props.selectedChainIds.map(String)}
      options={options}
      onSelectedValuesChange={(chainIds) => {
        props.onChange(chainIds.map(Number));
      }}
      placeholder={
        allChains.length === 0 ? "Loading Chains..." : "Select Chains"
      }
      disabled={allChains.length === 0}
      overrideSearchFn={searchFn}
      renderOption={renderOption}
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
}) {
  const { allChains, idToChain } = useAllChainsData();

  const chainsToShow = useMemo(() => {
    if (!props.chainIds) {
      return allChains;
    }
    const chainIdSet = new Set(props.chainIds);
    return allChains.filter((chain) => chainIdSet.has(chain.chainId));
  }, [allChains, props.chainIds]);

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
            {chain.name}
          </span>

          {!props.disableChainId && (
            <Badge variant="outline" className="gap-2 max-sm:hidden">
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
      searchPlaceholder="Search by Name or Chain ID"
      value={String(props.chainId)}
      options={options}
      onValueChange={(chainId) => {
        props.onChange(Number(chainId));
      }}
      placeholder={isLoadingChains ? "Loading Chains..." : "Select Chain"}
      overrideSearchFn={searchFn}
      renderOption={renderOption}
      className={props.className}
      popoverContentClassName={props.popoverContentClassName}
      disabled={isLoadingChains}
      side={props.side}
      align={props.align}
    />
  );
}

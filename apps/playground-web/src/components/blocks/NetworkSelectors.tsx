"use client";

import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo } from "react";
import { useAllChainsData } from "../../app/hooks/chains";
import { ChainIcon } from "./ChainIcon";
import { SelectWithSearch } from "./select-with-search";

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

type Option = { label: string; value: string };

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
  const { data } = useAllChainsData();
  const { allChains, idToChain } = data;

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
            {cleanChainName(chain.name)}
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
      closeOnSelect={true}
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

"use client";

import { MultiSelect } from "@/components/blocks/multi-select";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useAllChainsData } from "../../hooks/chains";
import { ChainIconClient } from "./ChainIcon";

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
  let { allChains, idToChain } = useAllChainsData();

  if (props.chainIds && props.chainIds.length > 0) {
    allChains = allChains.filter((chain) =>
      props.chainIds?.includes(chain.chainId),
    );
  }

  const options = useMemo(() => {
    let sortedChains = allChains;

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
  }, [allChains, props.priorityChains, idToChain, props.hideTestnets]);

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
              loading="lazy"
              src={chain.icon?.url}
              client={props.client}
            />
            {cleanChainName(chain.name)}
          </span>

          {!props.disableChainId && (
            <Badge variant="outline" className="gap-2">
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
      searchPlaceholder="Search by Name or Chain Id"
      selectedValues={props.selectedChainIds.map(String)}
      popoverContentClassName={props.popoverContentClassName}
      customTrigger={props.customTrigger}
      options={options}
      align={props.align}
      side={props.side}
      showSelectedValuesInModal={props.showSelectedValuesInModal}
      onSelectedValuesChange={(chainIds) => {
        props.onChange(chainIds.map(Number));
      }}
      placeholder={
        allChains.length === 0 ? "Loading Chains..." : "Select Chains"
      }
      disabled={allChains.length === 0}
      overrideSearchFn={searchFn}
      renderOption={renderOption}
      className={props.className}
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
  client: ThirdwebClient;
}) {
  const { allChains, idToChain } = useAllChainsData();

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
              src={chain.icon?.url}
              client={props.client}
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
    [idToChain, props.disableChainId, props.client],
  );

  const isLoadingChains = allChains.length === 0;

  return (
    <SelectWithSearch
      searchPlaceholder="Search by Name or Chain ID"
      value={props.chainId?.toString()}
      showCheck={false}
      options={options}
      onValueChange={(chainId) => {
        props.onChange(Number(chainId));
      }}
      closeOnSelect={true}
      placeholder={
        isLoadingChains
          ? "Loading Chains..."
          : props.placeholder || "Select Chain"
      }
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

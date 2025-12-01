"use client";

import { Badge } from "@workspace/ui/components/badge";
import { useCallback, useMemo } from "react";
import { ChainIcon } from "@/components/blocks/ChainIcon";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import { useBridgeSupportedChains } from "@/hooks/chains";
import { useAllChainsData } from "../../hooks/allChains";

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
  disableTestnets?: boolean;
  disableDeprecated?: boolean;
  placeholder?: string;
}) {
  const allChains = useAllChainsData();

  const chainsToShow = useMemo(() => {
    let chains = allChains || [];

    if (props.disableTestnets) {
      chains = chains.filter((chain) => !chain.testnet);
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
      const chain = chainsToShow.find(
        (chain) => chain.chainId === Number(option.value),
      );
      if (!chain) {
        return false;
      }

      if (Number.isInteger(Number(searchValue))) {
        return String(chain.chainId).startsWith(searchValue);
      }
      return chain.name.toLowerCase().includes(searchValue.toLowerCase());
    },
    [chainsToShow],
  );

  const renderOption = useCallback(
    (option: Option) => {
      const chain = chainsToShow.find(
        (chain) => chain.chainId === Number(option.value),
      );
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
    [chainsToShow, props.disableChainId],
  );

  const isLoadingChains = !allChains || allChains.length === 0;

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
      value={props.chainId ? String(props.chainId) : undefined}
    />
  );
}

export function BridgeNetworkSelector(props: {
  chainId: number | undefined;
  onChange: (chainId: number) => void;
  className?: string;
  popoverContentClassName?: string;
  side?: "left" | "right" | "top" | "bottom";
  align?: "center" | "start" | "end";
  placeholder?: string;
}) {
  const chainsQuery = useBridgeSupportedChains();

  const options = useMemo(() => {
    return (chainsQuery.data || [])?.map((chain) => {
      return {
        label: cleanChainName(chain.name),
        value: String(chain.chainId),
      };
    });
  }, [chainsQuery.data]);

  const searchFn = useCallback(
    (option: Option, searchValue: string) => {
      const chain = chainsQuery.data?.find(
        (chain) => chain.chainId === Number(option.value),
      );
      if (!chain) {
        return false;
      }

      if (Number.isInteger(Number.parseInt(searchValue))) {
        return String(chain.chainId).startsWith(searchValue);
      }
      return chain.name.toLowerCase().includes(searchValue.toLowerCase());
    },
    [chainsQuery.data],
  );

  const renderOption = useCallback(
    (option: Option) => {
      const chain = chainsQuery.data?.find(
        (chain) => chain.chainId === Number(option.value),
      );
      if (!chain) {
        return option.label;
      }

      return (
        <div className="flex justify-between gap-4">
          <span className="flex grow gap-2 truncate text-left">
            <ChainIcon className="size-5" ipfsSrc={chain.icon} loading="lazy" />
            {cleanChainName(chain.name)}
          </span>
        </div>
      );
    },
    [chainsQuery.data],
  );

  const isLoadingChains = chainsQuery.isPending;

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

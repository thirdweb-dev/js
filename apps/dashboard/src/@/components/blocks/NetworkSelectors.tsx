"use client";

import { MultiSelect } from "@/components/blocks/multi-select";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo } from "react";
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
          <span className="grow truncate text-left">
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
      placeholder="Select Chains"
      overrideSearchFn={searchFn}
      renderOption={renderOption}
    />
  );
}

export function SingleNetworkSelector(props: {
  chainId: number | undefined;
  onChange: (chainId: number) => void;
}) {
  const { allChains, idToChain } = useAllChainsData();

  const options = useMemo(() => {
    return allChains.map((chain) => {
      return {
        label: chain.name,
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
          <span className="grow truncate text-left">{chain.name}</span>
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
    <SelectWithSearch
      searchPlaceholder="Search by Name or Chain Id"
      value={String(props.chainId)}
      options={options}
      onValueChange={(chainId) => {
        props.onChange(Number(chainId));
      }}
      placeholder="Select Chain"
      overrideSearchFn={searchFn}
      renderOption={renderOption}
    />
  );
}

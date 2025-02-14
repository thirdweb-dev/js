import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { ChainIcon } from "components/icons/ChainIcon";
import { useAllChainsData } from "hooks/chains/allChains";
import { useCallback, useMemo } from "react";

type Option = { label: string; value: string };

export function SingleNetworkSelector(props: {
  onAddRow: (chain: { chainId: number; name: string }) => void;
  className?: string;
}) {
  const { allChains, idToChain } = useAllChainsData();

  const options = useMemo(() => {
    return allChains.map((chain) => ({
      label: chain.name,
      value: String(chain.chainId),
    }));
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
            <ChainIcon
              className="size-5"
              ipfsSrc={chain.icon?.url}
              loading="lazy"
            />
            {chain.name}
          </span>
          <Badge variant="outline" className="gap-2 max-sm:hidden">
            <span className="text-muted-foreground">Chain ID</span>
            {chain.chainId}
          </Badge>
        </div>
      );
    },
    [idToChain],
  );

  const handleChange = (chainId: string) => {
    const chain = idToChain.get(Number(chainId));
    if (chain) {
      props.onAddRow({ chainId: chain.chainId, name: chain.name });
    }
  };

  return (
    <SelectWithSearch
      searchPlaceholder="Search by Name or Chain ID"
      value={undefined} // Reset the search field after selection
      options={options}
      onValueChange={handleChange}
      placeholder={
        allChains.length === 0
          ? "Loading chains..."
          : "Select chain to deploy on"
      }
      overrideSearchFn={searchFn}
      renderOption={renderOption}
      className={props.className}
      disabled={allChains.length === 0}
      closeOnSelect={true}
    />
  );
}

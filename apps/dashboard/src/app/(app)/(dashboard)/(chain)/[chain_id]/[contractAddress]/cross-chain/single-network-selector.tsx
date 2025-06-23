import { useCallback, useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { SelectWithSearch } from "@/components/blocks/select-with-search";
import { Badge } from "@/components/ui/badge";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";

type Option = { label: string; value: string };

export function SingleNetworkSelector(props: {
  onAddRow: (chain: { chainId: number; name: string }) => void;
  isAddingRow: boolean;
  className?: string;
  client: ThirdwebClient;
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
            {chain.name}
          </span>
          <Badge className="gap-2 max-sm:hidden" variant="outline">
            <span className="text-muted-foreground">Chain ID</span>
            {chain.chainId}
          </Badge>
        </div>
      );
    },
    [idToChain, props.client],
  );

  const handleChange = async (chainId: string) => {
    const chain = idToChain.get(Number(chainId));
    if (chain) {
      props.onAddRow({ chainId: chain.chainId, name: chain.name });
    }
  };

  return (
    <SelectWithSearch
      className={props.className}
      closeOnSelect={true}
      disabled={props.isAddingRow || allChains.length === 0}
      onValueChange={handleChange}
      options={options}
      overrideSearchFn={searchFn}
      placeholder={
        allChains.length === 0
          ? "Loading chains..."
          : "Select chain to deploy on"
      }
      renderOption={renderOption}
      searchPlaceholder="Search by Name or Chain ID"
      value={undefined}
    />
  );
}

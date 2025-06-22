import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";

interface NetworkSelectDropdownProps {
  enabledChainIds?: number[];
  disabledChainIds?: number[];
  useCleanChainName?: boolean;
  isDisabled?: boolean;
  onSelect: (chain: string | undefined) => void;
  selectedChain: string | undefined;
  client: ThirdwebClient;
}

export const NetworkSelectDropdown: React.FC<NetworkSelectDropdownProps> = ({
  enabledChainIds,
  disabledChainIds,
  useCleanChainName,
  isDisabled,
  selectedChain,
  onSelect,
  client,
}) => {
  const { allChains } = useAllChainsData();

  const chains = useMemo(() => {
    // return only enabled chains if enabled chains are specified
    if (enabledChainIds && enabledChainIds.length > 0) {
      const enabledChainIdsSet = new Set(enabledChainIds);
      return allChains.filter((chain) => enabledChainIdsSet.has(chain.chainId));
    }
    // return supported chains that are not disabled if disabled chains are specified
    if (disabledChainIds && disabledChainIds.length > 0) {
      const disabledChainIdsSet = new Set(disabledChainIds);
      return allChains.filter(
        (chain) => !disabledChainIdsSet.has(chain.chainId),
      );
    }
    // if no enabled or disabled chains are specified, return all supported chains
    return allChains;
  }, [allChains, enabledChainIds, disabledChainIds]);

  const cleanChainName = (chainName: string) => {
    return chainName.replace("Mainnet", "");
  };

  return (
    <Select
      disabled={isDisabled}
      onValueChange={(v) => {
        onSelect(v === "all-chains" ? undefined : v);
      }}
      value={selectedChain || "all-chains"}
    >
      <SelectTrigger className="-translate-x-3 !h-auto inline-flex w-auto border-none bg-transparent px-1 py-0.5 font-medium hover:bg-accent focus:ring-0 focus:ring-offset-0">
        <SelectValue />
      </SelectTrigger>

      <SelectContent
        align="center"
        className="min-w-[280px] rounded-lg shadow-lg"
      >
        <SelectItem value="all-chains">
          <div className="flex items-center gap-2 py-1" data-all-chains>
            <ChainIconClient
              className="size-5"
              client={client}
              src={undefined}
            />
            All Networks
          </div>
        </SelectItem>

        {chains.map((chain) => (
          <SelectItem key={chain.chainId} value={String(chain.chainId)}>
            <div className="flex items-center gap-2 py-1">
              <ChainIconClient
                className="size-5"
                client={client}
                src={chain.icon?.url}
              />
              {useCleanChainName ? cleanChainName(chain.name) : chain.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

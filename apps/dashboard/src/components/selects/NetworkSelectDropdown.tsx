import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChainIcon } from "components/icons/ChainIcon";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useMemo } from "react";

interface NetworkSelectDropdownProps {
  enabledChainIds?: number[];
  disabledChainIds?: number[];
  useCleanChainName?: boolean;
  isDisabled?: boolean;
  onSelect: (chain: string | undefined) => void;
  selectedChain: string | undefined;
}

export const NetworkSelectDropdown: React.FC<NetworkSelectDropdownProps> = ({
  enabledChainIds,
  disabledChainIds,
  useCleanChainName,
  isDisabled,
  selectedChain,
  onSelect,
}) => {
  const supportedChains = useSupportedChains();

  const chains = useMemo(() => {
    // return only enabled chains if enabled chains are specified
    if (enabledChainIds && enabledChainIds.length > 0) {
      const enabledChainIdsSet = new Set(enabledChainIds);
      return supportedChains.filter((chain) =>
        enabledChainIdsSet.has(chain.chainId),
      );
    }
    // return supported chains that are not disabled if disabled chains are specified
    if (disabledChainIds && disabledChainIds.length > 0) {
      const disabledChainIdsSet = new Set(disabledChainIds);
      return supportedChains.filter(
        (chain) => !disabledChainIdsSet.has(chain.chainId),
      );
    }
    // if no enabled or disabled chains are specified, return all supported chains
    return supportedChains;
  }, [supportedChains, enabledChainIds, disabledChainIds]);

  const cleanChainName = (chainName: string) => {
    return chainName.replace("Mainnet", "");
  };

  return (
    <Select
      disabled={isDisabled}
      value={selectedChain || "all-chains"}
      onValueChange={(v) => {
        onSelect(v === "all-chains" ? undefined : v);
      }}
    >
      <SelectTrigger className="inline-flex w-auto border-none bg-transparent hover:bg-muted -translate-x-3 py-1 !h-auto font-medium">
        <SelectValue />
      </SelectTrigger>

      <SelectContent align="center" className="rounded-lg shadow-lg">
        <SelectItem value="all-chains">
          <div className="flex items-center gap-2 py-1" data-all-chains>
            <ChainIcon ipfsSrc={undefined} size={24} />
            All Networks
          </div>
        </SelectItem>
        {chains.map((chain) => (
          <SelectItem key={chain.chainId} value={String(chain.chainId)}>
            <div className="flex items-center gap-2 py-1">
              <ChainIcon ipfsSrc={chain.icon?.url} size={24} />
              {useCleanChainName ? cleanChainName(chain.name) : chain.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

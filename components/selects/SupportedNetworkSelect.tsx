import { Select, SelectProps, forwardRef } from "@chakra-ui/react";
import { defaultChains } from "@thirdweb-dev/chains";
import { StoredChain } from "contexts/configured-chains";
import { useConfiguredChains } from "hooks/chains/configureChains";
import { useMemo } from "react";

export interface SupportedNetworkSelectProps
  extends Omit<SelectProps, "children"> {
  disabledChainIds?: number[];
  disabledChainIdText?: string;
}

export const SupportedNetworkSelect = forwardRef<
  SupportedNetworkSelectProps,
  "select"
>(
  (
    { disabledChainIds, disabledChainIdText = "Unsupported", ...selectProps },
    ref,
  ) => {
    const configuredNetworks = useConfiguredChains();

    const testnets = useMemo(() => {
      return configuredNetworks.filter((n) => !n.isAutoConfigured && n.testnet);
    }, [configuredNetworks]);

    const mainnets = useMemo(() => {
      return configuredNetworks.filter(
        (n) => !n.isAutoConfigured && !n.testnet,
      );
    }, [configuredNetworks]);

    const value =
      selectProps.value === undefined || selectProps.value === -1
        ? -1
        : configuredNetworks?.some(
            (chain) =>
              !chain.isAutoConfigured && chain.chainId === selectProps.value,
          )
        ? (selectProps.value as number)
        : -2;

    return (
      <Select {...selectProps} value={value} ref={ref}>
        {value === -1 && (
          <option disabled value={-1}>
            Select Network
          </option>
        )}

        {value === -2 && (
          <option disabled value={-2}>
            Unknown Network - Chain ID #{selectProps.value}
          </option>
        )}

        <NetworkOptGroup
          label="Mainnets"
          chains={mainnets}
          disabledChainIdText={disabledChainIdText}
          disabledChainIds={disabledChainIds}
        />

        <NetworkOptGroup
          label="Testnets"
          chains={testnets}
          disabledChainIdText={disabledChainIdText}
          disabledChainIds={disabledChainIds}
        />
      </Select>
    );
  },
);

const isDefaultChain = (chainId: number) =>
  defaultChains.some((c) => c.chainId === chainId);

const NetworkOptGroup: React.FC<{
  disabledChainIds?: number[];
  chains: StoredChain[];
  disabledChainIdText: string;
  label: string;
}> = ({ disabledChainIds, chains, disabledChainIdText, label }) => {
  return (
    <optgroup label={label}>
      {chains.map((network) => {
        const isDisabledChain = disabledChainIds?.includes(network.chainId);

        // disable the option it if it is either in the list of disabled chains
        // or if the list of disabled chains is given and chain is not a default chain ( custom chain )
        const disableOption =
          isDisabledChain ||
          (disabledChainIds &&
            disabledChainIds.length > 0 &&
            !isDefaultChain(network.chainId));

        const tag = disableOption ? ` - ${disabledChainIdText}` : "";

        return (
          <option
            key={network.name}
            value={network.chainId}
            disabled={disableOption}
          >
            {network.name} ({network.nativeCurrency.symbol}) {tag}
          </option>
        );
      })}
    </optgroup>
  );
};

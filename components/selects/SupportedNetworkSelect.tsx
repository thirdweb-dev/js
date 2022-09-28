import { useWeb3 } from "@3rdweb-sdk/react";
import { Select, SelectProps, forwardRef } from "@chakra-ui/react";
import {
  ChainId,
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_IDS,
} from "@thirdweb-dev/sdk";
import { deprecatedChains } from "constants/mappings";
import { useMemo } from "react";

export interface SupportedNetworkSelectProps
  extends Omit<SelectProps, "children"> {
  disabledChainIds?: ChainId[];
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
    const { getNetworkMetadata } = useWeb3();
    const testnets = useMemo(() => {
      return SUPPORTED_CHAIN_IDS.map((supportedChain) => {
        return getNetworkMetadata(supportedChain);
      }).filter((n) => n.isTestnet);
    }, [getNetworkMetadata]);

    const mainnets = useMemo(() => {
      return SUPPORTED_CHAIN_IDS.map((supportedChain) => {
        return getNetworkMetadata(supportedChain);
      }).filter((n) => !n.isTestnet);
    }, [getNetworkMetadata]);

    return (
      <Select {...selectProps} ref={ref}>
        <option disabled value={-1}>
          Select Network
        </option>
        <optgroup label="Mainnets">
          {mainnets.map((mn) => (
            <option
              key={mn.chainId}
              value={mn.chainId}
              disabled={disabledChainIds?.includes(mn.chainId)}
            >
              {mn.chainName} ({mn.symbol})
              {disabledChainIds?.includes(mn.chainId)
                ? ` - ${disabledChainIdText}`
                : ""}
            </option>
          ))}
        </optgroup>
        <optgroup label="Testnets">
          {testnets.map((tn) => (
            <option
              key={tn.chainId}
              value={tn.chainId}
              disabled={disabledChainIds?.includes(tn.chainId)}
            >
              {tn.chainName} ({tn.symbol})
              {deprecatedChains.includes(tn.chainId as SUPPORTED_CHAIN_ID) &&
                " - Deprecated"}
              {disabledChainIds?.includes(tn.chainId) &&
              !deprecatedChains.includes(tn.chainId as SUPPORTED_CHAIN_ID)
                ? ` - ${disabledChainIdText}`
                : ""}
            </option>
          ))}
        </optgroup>
      </Select>
    );
  },
);

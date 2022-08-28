import { getChainFromChainId } from "../../constants/chain";
import { Select, SelectProps } from "../shared/Select";
import { ChainId, SUPPORTED_CHAIN_IDS } from "@thirdweb-dev/sdk";
import { useMemo } from "react";

export interface SupportedNetworkSelectProps extends SelectProps {
  disabledChainIds?: ChainId[];
}

export const SupportedNetworkSelect: React.FC<SupportedNetworkSelectProps> = ({
  disabledChainIds,
  ...selectProps
}) => {
  const deprecatedNetworks = useMemo(() => {
    return SUPPORTED_CHAIN_IDS.map((supportedChain) => {
      return getChainFromChainId(supportedChain);
    }).filter((n) => n.id === ChainId.Rinkeby);
  }, []);

  const testnets = useMemo(() => {
    return SUPPORTED_CHAIN_IDS.map((supportedChain) => {
      return getChainFromChainId(supportedChain);
    }).filter((n) => n.testnet && n.id !== ChainId.Rinkeby);
  }, []);

  const mainnets = useMemo(() => {
    return SUPPORTED_CHAIN_IDS.map((supportedChain) => {
      return getChainFromChainId(supportedChain);
    }).filter((n) => !n.testnet);
  }, []);
  return (
    <Select {...selectProps}>
      <option disabled value={-1}>
        Select Network
      </option>
      <optgroup label="Mainnets">
        {mainnets.map((mn) => (
          <option
            key={mn.id}
            value={mn.id}
            disabled={disabledChainIds?.includes(mn.id)}
          >
            {mn.name} ({mn.nativeCurrency?.symbol})
          </option>
        ))}
      </optgroup>
      <optgroup label="Testnets">
        {testnets.map((tn) => (
          <option
            key={tn.id}
            value={tn.id}
            disabled={disabledChainIds?.includes(tn.id)}
          >
            {tn.name} ({tn.nativeCurrency?.symbol})
          </option>
        ))}
      </optgroup>
      <optgroup label="Deprecated">
        {deprecatedNetworks.map((tn) => (
          <option
            key={tn.id}
            value={tn.id}
            disabled={disabledChainIds?.includes(tn.id)}
          >
            {tn.name} ({tn.nativeCurrency?.symbol})
          </option>
        ))}
      </optgroup>
    </Select>
  );
};

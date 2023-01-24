import { useThirdwebConfigContext } from "../../contexts/thirdweb-config";
import { Select, SelectProps } from "../shared/Select";
import { useMemo } from "react";

export interface SupportedNetworkSelectProps extends SelectProps {
  disabledChainIds?: number[];
}

export const SupportedNetworkSelect: React.FC<SupportedNetworkSelectProps> = ({
  disabledChainIds,
  ...selectProps
}) => {
  const config = useThirdwebConfigContext();

  const { mainnets, testnets } = useMemo(() => {
    const networks = config.chains;

    return {
      mainnets: networks.filter((n) => !n.testnet),
      testnets: networks.filter((n) => n.testnet),
    };
  }, [config.chains]);

  return (
    <Select {...selectProps}>
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
            {mn.name} ({mn.nativeCurrency?.symbol})
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
            {tn.name} ({tn.nativeCurrency?.symbol})
          </option>
        ))}
      </optgroup>
    </Select>
  );
};

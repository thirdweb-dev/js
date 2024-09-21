import { Select } from "chakra-react-select";
import type { SizeProp } from "chakra-react-select";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useAllChainsData } from "../../../hooks/chains/allChains";

interface NetworkDropdownProps {
  useCleanChainName?: boolean;
  isDisabled?: boolean;
  onMultiChange?: (networksEnabled: number[]) => void;
  onSingleChange?: (networksEnabled: number) => void;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  value: any;
  size?: SizeProp;
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

export const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  useCleanChainName = true,
  onMultiChange,
  onSingleChange,
  value,
  size = "md",
}) => {
  const form = useFormContext();
  const { allChains } = useAllChainsData();

  const options = useMemo(() => {
    return allChains.map((chain) => {
      return {
        label: useCleanChainName
          ? cleanChainName(chain.name)
          : `${chain.name} (${chain.chainId})`,
        value: chain.chainId,
      };
    });
  }, [allChains, useCleanChainName]);

  const defaultValues = useMemo(() => {
    const networksEnabled = form?.watch(
      "networksForDeployment.networksEnabled",
    );

    if (networksEnabled) {
      return options.filter(({ value: val }) =>
        form.watch("networksForDeployment.networksEnabled")?.includes(val),
      );
    }
    return options;
  }, [form, options]);

  return (
    <div className="flex flex-row gap-2 items-center w-full">
      <Select
        size={size}
        placeholder={`${
          onSingleChange ? "Select a network" : "Select Networks"
        }`}
        isMulti={onMultiChange !== undefined}
        selectedOptionStyle="check"
        hideSelectedOptions={false}
        options={options}
        defaultValue={defaultValues}
        onChange={(selectedNetworks) => {
          if (selectedNetworks) {
            if (onMultiChange) {
              onMultiChange(
                // biome-ignore lint/suspicious/noExplicitAny: FIXME
                (selectedNetworks as any).map(
                  ({ value: val }: { value: string }) => val,
                ),
              );
            } else if (onSingleChange) {
              onSingleChange(
                (selectedNetworks as { label: string; value: number }).value,
              );
            }
          }
        }}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            width: "full",
          }),
          downChevron: (provided) => ({
            ...provided,
            color: "hsl(var(--text-muted-foreground)/50%)",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "hsl(var(--text-muted-foreground)/50%)",
          }),
          control: (provided) => ({
            ...provided,
            borderRadius: "lg",
            minWidth: "178px",
          }),
        }}
        value={
          onMultiChange
            ? options.filter(({ value: val }) => value?.includes(val))
            : options.find(({ value: val }) => val === value)
        }
      />
    </div>
  );
};

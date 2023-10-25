import { Flex } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useSupportedChains } from "hooks/chains/configureChains";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

interface NetworkDropdownProps {
  useCleanChainName?: boolean;
  isDisabled?: boolean;
  onMultiChange?: (networksEnabled: number[]) => void;
  onSingleChange?: (networksEnabled: number) => void;
  value: any;
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

export const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  useCleanChainName = true,
  onMultiChange,
  onSingleChange,
  value,
}) => {
  const form = useFormContext();
  const supportedChains = useSupportedChains();

  const options = useMemo(() => {
    return supportedChains.map((chain) => {
      return {
        label: useCleanChainName
          ? cleanChainName(chain.name)
          : `${chain.name} (${chain.chainId})`,
        value: chain.chainId,
      };
    });
  }, [supportedChains, useCleanChainName]);

  const defaultValues = useMemo(() => {
    const networksEnabled = form?.watch(
      "networksForDeployment.networksEnabled",
    );

    if (networksEnabled) {
      return options.filter(
        ({ value: val }) =>
          form.watch("networksForDeployment.networksEnabled")?.includes(val),
      );
    } else {
      return options;
    }
  }, [form, options]);

  return (
    <Flex gap={2} alignItems="center" w="full">
      <Select
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
            color: "gray.500",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "gray.500",
          }),
        }}
        value={
          onMultiChange
            ? options.filter(({ value: val }) => value?.includes(val))
            : options.find(({ value: val }) => val === value)
        }
      />
    </Flex>
  );
};

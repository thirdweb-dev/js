import { MultiSelect } from "@/components/blocks/multi-select";
import { Badge } from "@/components/ui/badge";
import { Select } from "chakra-react-select";
import type { SizeProp } from "chakra-react-select";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useAllChainsData } from "../../../hooks/chains/allChains";

interface NetworkDropdownProps {
  useCleanChainName?: boolean;
  isDisabled?: boolean;
  onSingleChange: (networksEnabled: number) => void;
  value: number | undefined;
  size?: SizeProp;
}

function cleanChainName(chainName: string) {
  return chainName.replace("Mainnet", "");
}

export const NetworkDropdown: React.FC<NetworkDropdownProps> = ({
  useCleanChainName = true,
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
    <div className="flex w-full flex-row items-center gap-2">
      <Select
        size={size}
        placeholder={"Select a network"}
        selectedOptionStyle="check"
        hideSelectedOptions={false}
        options={options}
        defaultValue={defaultValues}
        onChange={(selectedChain) => {
          if (selectedChain) {
            if (onSingleChange) {
              onSingleChange(selectedChain.value);
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
        value={options.find(({ value: val }) => val === value)}
      />
    </div>
  );
};

type Option = { label: string; value: string };

export function MultiNetworkSelector(props: {
  selectedChainIds: number[];
  onChange: (chainIds: number[]) => void;
}) {
  const { allChains, idToChain } = useAllChainsData();

  const options = useMemo(() => {
    return allChains.map((chain) => {
      return {
        label: cleanChainName(chain.name),
        value: String(chain.chainId),
      };
    });
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
          <span className="grow truncate text-left">
            {cleanChainName(chain.name)}
          </span>
          <Badge variant="outline" className="gap-2">
            <span className="text-muted-foreground">Chain ID</span>
            {chain.chainId}
          </Badge>
        </div>
      );
    },
    [idToChain],
  );

  return (
    <MultiSelect
      searchPlaceholder="Search by Name or Chain Id"
      selectedValues={props.selectedChainIds.map(String)}
      options={options}
      onSelectedValuesChange={(chainIds) => {
        props.onChange(chainIds.map(Number));
      }}
      placeholder="Select Chains"
      overrideSearchFn={searchFn}
      renderOption={renderOption}
    />
  );
}

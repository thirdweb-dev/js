import { Flex } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React, { useMemo } from "react";
import {
  useConstructorParamsFromABI,
  useFunctionParamsFromABI,
} from "../hooks";

interface ExtensionsParamSelectorProps {
  deployParams:
    | ReturnType<typeof useFunctionParamsFromABI>
    | ReturnType<typeof useConstructorParamsFromABI>;
  value: string;
  onChange: (fn: string) => void;
}

export const ExtensionsParamSelector: React.FC<ExtensionsParamSelectorProps> = ({
  deployParams,
  value,
  onChange,
}) => {
  const options = useMemo(() => {
    return deployParams.map((f) => ({
      label: f.name,
      value: f.name,
    }));
  }, [deployParams]);

  return (
    <Flex gap={2} alignItems="center" w="full">
      <Select
        placeholder="Select param"
        options={options}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            width: "full",
          }),
        }}
        value={options.find((o) => o.value === value)}
        onChange={(selectedParam) => {
          if (selectedParam) {
            onChange((selectedParam as { label: string; value: string }).value);
          }
        }}
      />
    </Flex>
  );
};

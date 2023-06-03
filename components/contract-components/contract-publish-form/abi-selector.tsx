import { Flex } from "@chakra-ui/react";
import { Abi } from "@thirdweb-dev/sdk";
import { Select } from "chakra-react-select";
import React, { useMemo } from "react";

interface AbiSelectorProps {
  abi: Abi;
  defaultValue: string;
  value: string;
  onChange: (fn: string) => void;
}

export const AbiSelector: React.FC<AbiSelectorProps> = ({
  abi,
  value,
  defaultValue,
  onChange,
}) => {
  const writeFunctions = abi.filter(
    (f) => f.type === "function" && f.stateMutability !== "view",
  );

  const options = useMemo(() => {
    return writeFunctions.map((f) => ({
      label: f.name,
      value: f.name,
    }));
  }, [writeFunctions]);

  return (
    <Flex gap={2} alignItems="center" w="full">
      <Select
        placeholder="Select function"
        options={options}
        defaultValue={options.find((o) => o.value === defaultValue)}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            width: "full",
          }),
        }}
        value={options.find((o) => o.value === value)}
        onChange={(selectedFn) => {
          if (selectedFn) {
            onChange((selectedFn as { label: string; value: string }).value);
          }
        }}
      />
    </Flex>
  );
};

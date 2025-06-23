import type { Abi } from "abitype";
import { Select } from "chakra-react-select";
import { useMemo } from "react";

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
  const options = useMemo(() => {
    return abi
      .filter((f) => f.type === "function")
      .filter((f) => f.stateMutability !== "view")
      .map((f) => ({
        label: f.name,
        value: f.name,
      }));
  }, [abi]);

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <Select
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            width: "full",
          }),
        }}
        defaultValue={options.find((o) => o.value === defaultValue)}
        onChange={(selectedFn) => {
          if (selectedFn) {
            onChange((selectedFn as { label: string; value: string }).value);
          }
        }}
        options={options}
        placeholder="Select function"
        value={options.find((o) => o.value === value)}
      />
    </div>
  );
};

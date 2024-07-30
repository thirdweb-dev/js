import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";
import type {
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

export const ExtensionsParamSelector: React.FC<
  ExtensionsParamSelectorProps
> = ({ deployParams, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Param" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {deployParams.map((param) => {
            return (
              <SelectItem key={param.name} value={param.name}>
                {param.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

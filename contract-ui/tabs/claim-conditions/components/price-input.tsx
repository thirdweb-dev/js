import { Input, InputGroup, InputProps } from "@chakra-ui/react";
import React from "react";

interface PriceInputProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value: string;
  onChange: (value: string) => void;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  isDisabled,
  ...restInputProps
}) => {
  return (
    <InputGroup>
      <Input
        step={0.000000000000000001}
        type="number"
        isDisabled={isDisabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...restInputProps}
      />
    </InputGroup>
  );
};

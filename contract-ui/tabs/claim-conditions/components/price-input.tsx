import { Input, InputGroup, InputProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface PriceInputProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value: number;
  onChange: (value: number) => void;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value = 0,
  onChange,
  isDisabled,
  ...restInputProps
}) => {
  const [stringValue, setStringValue] = useState<string>(
    isNaN(value) ? "0" : value.toString(),
  );

  useEffect(() => {
    if (value !== undefined) {
      setStringValue(value.toString());
    }
  }, [value]);
  useEffect(() => {
    const parsed = parseFloat(stringValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringValue]);

  return (
    <InputGroup {...restInputProps}>
      <Input
        isDisabled={isDisabled}
        value={stringValue}
        onChange={(e) => setStringValue(e.target.value)}
        onBlur={() => {
          if (!isNaN(value)) {
            setStringValue(value.toString());
          } else {
            setStringValue("0");
          }
        }}
      />
    </InputGroup>
  );
};

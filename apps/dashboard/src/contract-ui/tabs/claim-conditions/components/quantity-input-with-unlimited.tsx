import {
  Input,
  InputGroup,
  type InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Button } from "tw-components";

interface QuantityInputWithUnlimitedProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value: string;
  onChange: (value: string) => void;
  hideMaxButton?: true;
  decimals?: number;
}

export const QuantityInputWithUnlimited: React.FC<
  QuantityInputWithUnlimitedProps
> = ({
  value = "0",
  onChange,
  hideMaxButton,
  isDisabled,
  isRequired,
  decimals,
  ...restInputProps
}) => {
  const [stringValue, setStringValue] = useState<string>(
    Number.isNaN(Number(value)) ? "0" : value.toString(),
  );

  // FIXME: this needs a re-work
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (value !== undefined) {
      setStringValue(value.toString());
    }
  }, [value]);

  const updateValue = (_value: string) => {
    if (_value === "") {
      onChange(_value);
      setStringValue(_value);
      return;
    }

    setStringValue(_value);
    onChange(_value);
  };

  return (
    <InputGroup {...restInputProps}>
      <Input
        isRequired={isRequired}
        isDisabled={decimals === undefined || isDisabled}
        value={stringValue === "unlimited" ? "Unlimited" : stringValue}
        onChange={(e) => updateValue(e.currentTarget.value)}
        onBlur={() => {
          if (value === "unlimited") {
            setStringValue("unlimited");
          } else if (!Number.isNaN(Number(value))) {
            setStringValue(Number(Number(value).toFixed(decimals)).toString());
          } else {
            setStringValue("0");
          }
        }}
      />
      {hideMaxButton ? null : (
        <InputRightElement w="auto">
          <Button
            isDisabled={decimals === undefined || isDisabled}
            colorScheme="primary"
            variant="ghost"
            size="sm"
            mr={1}
            onClick={() => {
              updateValue("unlimited");
            }}
          >
            Unlimited
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};

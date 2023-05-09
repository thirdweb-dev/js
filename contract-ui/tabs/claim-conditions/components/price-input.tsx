import {
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputProps,
} from "@chakra-ui/react";

interface PriceInputProps
  extends Omit<NumberInputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
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
      <NumberInput
        defaultValue={0}
        isDisabled={isDisabled}
        {...restInputProps}
      >
        <NumberInputField
          value={value}
          onChange={(e) => onChange(e.target.value)}

        />
      </NumberInput>
    </InputGroup>
  );
};

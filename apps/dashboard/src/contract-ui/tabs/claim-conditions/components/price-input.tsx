import {
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputProps,
} from "@chakra-ui/react";

interface PriceInputProps
  extends Omit<
    NumberInputProps,
    "onChange" | "value" | "onBlur" | "max" | "min"
  > {
  value: string;
  onChange: (value: string) => void;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  ...restInputProps
}) => {
  return (
    <InputGroup>
      <NumberInput defaultValue={0} min={0} value={value} {...restInputProps}>
        <NumberInputField
          onChange={(e) => {
            if (e.target.value === "" || Number(e.target.value) < 0) {
              return onChange("0");
            }
            onChange(e.target.value);
          }}
        />
      </NumberInput>
    </InputGroup>
  );
};

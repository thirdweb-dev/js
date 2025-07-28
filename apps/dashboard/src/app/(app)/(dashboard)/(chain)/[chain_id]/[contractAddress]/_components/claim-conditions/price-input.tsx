import { DecimalInput } from "@/components/ui/decimal-input";

type InputProps = React.ComponentProps<typeof DecimalInput>;

interface PriceInputProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value: string;
  onChange: (value: string) => void;
}

export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  ...restInputProps
}) => {
  return (
    <DecimalInput
      {...restInputProps}
      onChange={(value) => {
        if (value === "" || Number(value) < 0) {
          return onChange("0");
        }
        onChange(value);
      }}
      value={value}
    />
  );
};

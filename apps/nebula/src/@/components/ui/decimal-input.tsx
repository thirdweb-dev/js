import { Input } from "./input";
export function DecimalInput(props: {
  value: string;
  onChange: (value: string) => void;
  maxValue?: number;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Input
      id={props.id}
      type="text"
      value={props.value}
      className={props.className}
      inputMode="decimal"
      placeholder={props.placeholder}
      disabled={props.disabled}
      onChange={(e) => {
        const number = Number(e.target.value);
        // ignore if string becomes invalid number
        if (Number.isNaN(number)) {
          return;
        }
        if (props.maxValue && number > props.maxValue) {
          return;
        }
        // replace leading multiple zeros with single zero
        let cleanedValue = e.target.value.replace(/^0+/, "0");
        // replace leading zero before decimal point
        if (!cleanedValue.includes(".")) {
          cleanedValue = cleanedValue.replace(/^0+/, "");
        }
        props.onChange(cleanedValue || "0");
      }}
    />
  );
}

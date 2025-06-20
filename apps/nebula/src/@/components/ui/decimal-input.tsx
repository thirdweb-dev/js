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
      className={props.className}
      disabled={props.disabled}
      id={props.id}
      inputMode="decimal"
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
      placeholder={props.placeholder}
      type="text"
      value={props.value}
    />
  );
}

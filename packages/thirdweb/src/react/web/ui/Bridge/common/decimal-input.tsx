import { Input } from "../../components/formElements.js";

type InputProps = React.JSX.IntrinsicElements["input"];

export function DecimalInput(
  props: Exclude<
    InputProps,
    "onChange" | "onClick" | "inputMode" | "pattern" | "type" | "value"
  > & {
    setValue: (value: string) => void;
  },
) {
  const handleAmountChange = (inputValue: string) => {
    let processedValue = inputValue;

    // Replace comma with period if it exists
    processedValue = processedValue.replace(",", ".");

    if (processedValue.startsWith(".")) {
      processedValue = `0${processedValue}`;
    }

    const numValue = Number(processedValue);
    if (Number.isNaN(numValue)) {
      return;
    }

    if (
      processedValue.length > 1 &&
      processedValue.startsWith("0") &&
      !processedValue.startsWith("0.")
    ) {
      props.setValue(processedValue.slice(1));
    } else {
      props.setValue(processedValue);
    }
  };

  return (
    <Input
      {...props}
      inputMode="decimal"
      onChange={(e) => {
        handleAmountChange(e.target.value);
      }}
      onClick={(e) => {
        // put cursor at the end of the input
        if (props.value === "") {
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length,
          );
        }
      }}
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder="0.0"
      type="text"
      variant="transparent"
    />
  );
}

import {
  Input,
  InputGroup,
  InputProps,
  InputRightAddon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface BasisPointsInputProps
  extends Omit<InputProps, "onChange" | "value" | "onBlur" | "max" | "min"> {
  value?: number;
  onChange: (value: number) => void;
}

export const BasisPointsInput: React.FC<BasisPointsInputProps> = ({
  value = 0,
  onChange,
  ...restInputProps
}) => {
  const initValue = value / 100;
  const [stringValue, setStringValue] = useState(
    isNaN(initValue) ? "0.00" : initValue.toFixed(2),
  );

  // This useEffect is necessary so the BasisPoints are
  // updated on the settings tab, when the value gets
  // changed from the default 0, but only then, and not
  // every time the value changes on user input
  useEffect(() => {
    if (value !== 0 && stringValue === "0.00") {
      setStringValue((value / 100).toFixed(2));
    }
  }, [value, stringValue]);

  useEffect(() => {
    const validValue = stringValue.match(
      /^100$|^100.00$|^\d{0,2}(\.\d{1,2})? *%?$/g,
    );
    if (validValue && validValue.length) {
      onChange(Math.floor(parseFloat(validValue[0] || "0") * 100));
    }
  }, [stringValue, onChange]);

  return (
    <InputGroup {...restInputProps}>
      <Input
        value={stringValue}
        onChange={(e) => setStringValue(e.target.value)}
        onBlur={(e) => {
          const val = e.target.value;
          const validValue = val.match(
            /^100$|^100.00$|^\d{0,2}(\.\d{1,2})? *%?$/g,
          );
          if (validValue && validValue.length) {
            setStringValue(validValue[0]);
          } else {
            setStringValue("0.00");
          }
        }}
        maxLength={5}
      />
      <InputRightAddon children="%" />
    </InputGroup>
  );
};

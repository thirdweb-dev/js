/* eslint-disable no-restricted-syntax */
import { Input } from "@/components/ui/input";
import { PercentIcon } from "lucide-react";
import { useEffect, useState } from "react";

type InputProps = React.ComponentProps<typeof Input>;

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
    Number.isNaN(initValue) ? "0.00" : initValue.toFixed(2),
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: we *cannot* add onChange to the dependencies here
  useEffect(() => {
    const validValue = stringValue.match(
      /^100$|^100.00$|^\d{0,2}(\.\d{1,2})? *%?$/g,
    );
    if (validValue?.length) {
      onChange(Math.floor(Number.parseFloat(validValue[0] || "0") * 100));
    }
  }, [stringValue]);

  return (
    <div className="flex overflow-hidden rounded-lg border border-border ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Input
        className="rounded-r-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        value={stringValue}
        {...restInputProps}
        onChange={(e) => setStringValue(e.target.value)}
        onBlur={(e) => {
          const val = e.target.value;
          const validValue = val.match(
            /^100$|^100.00$|^\d{0,2}(\.\d{1,2})? *%?$/g,
          );
          if (validValue?.length) {
            setStringValue(validValue[0]);
          } else {
            setStringValue("0.00");
          }
        }}
        maxLength={5}
      />
      <div className="flex items-center justify-center border-border border-l bg-card px-3 font-medium">
        <PercentIcon className="size-4" />
      </div>
    </div>
  );
};

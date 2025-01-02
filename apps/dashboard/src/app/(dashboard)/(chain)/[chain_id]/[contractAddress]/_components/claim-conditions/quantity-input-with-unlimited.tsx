import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface QuantityInputWithUnlimitedProps {
  value: string;
  onChange: (value: string) => void;
  hideMaxButton?: true;
  decimals?: number;
  isDisabled: boolean;
  isRequired: boolean;
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
    <div className="flex flex-row items-center rounded-md border border-border">
      <Input
        required={isRequired}
        disabled={isDisabled}
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
        className="border-none"
      />
      {hideMaxButton ? null : (
        <Button
          disabled={isDisabled}
          variant="ghost"
          size="sm"
          className="mr-1 text-primary"
          onClick={() => {
            updateValue("unlimited");
          }}
        >
          Unlimited
        </Button>
      )}
    </div>
  );
};

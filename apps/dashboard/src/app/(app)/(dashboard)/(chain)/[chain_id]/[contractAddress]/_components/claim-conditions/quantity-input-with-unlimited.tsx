import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuantityInputWithUnlimited(props: {
  value: string;
  onChange: (value: string) => void;
  hideMaxButton?: true;
  decimals?: number;
  isDisabled: boolean;
  isRequired: boolean;
}) {
  const {
    value = "0",
    onChange,
    hideMaxButton,
    isDisabled,
    isRequired,
    decimals,
  } = props;

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
    <div className="flex flex-row items-center rounded-md border border-border pr-1 bg-background max-w-sm">
      <Input
        className="border-none"
        disabled={isDisabled}
        onBlur={() => {
          if (value === "unlimited") {
            setStringValue("unlimited");
          } else if (!Number.isNaN(Number(value))) {
            setStringValue(Number(Number(value).toFixed(decimals)).toString());
          } else {
            setStringValue("0");
          }
        }}
        onChange={(e) => updateValue(e.currentTarget.value)}
        required={isRequired}
        value={stringValue === "unlimited" ? "Unlimited" : stringValue}
      />
      {hideMaxButton ? null : (
        <Button
          className="text-muted-foreground bg-transparent hover:accent"
          disabled={isDisabled}
          onClick={() => {
            updateValue("unlimited");
          }}
          size="sm"
          variant="ghost"
        >
          Unlimited
        </Button>
      )}
    </div>
  );
}

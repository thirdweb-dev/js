import { useMemo, useState } from "react";
import { isAddress, NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "thirdweb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, type CurrencyMetadata } from "@/constants/currencies";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  isDisabled?: boolean;
  small?: boolean;
  hideDefaultCurrencies?: boolean;
  showCustomCurrency?: boolean;
  isPaymentsSelector?: boolean;
  defaultCurrencies?: CurrencyMetadata[];
  contractChainId: number;
}

export function CurrencySelector({
  value,
  onChange,
  small,
  hideDefaultCurrencies,
  showCustomCurrency = true,
  isPaymentsSelector = false,
  defaultCurrencies = [],
  contractChainId: chainId,
  className,
  isDisabled,
}: CurrencySelectorProps) {
  const { idToChain } = useAllChainsData();
  const chain = chainId ? idToChain.get(chainId) : undefined;

  const helperCurrencies =
    defaultCurrencies.length > 0
      ? defaultCurrencies
      : chainId
        ? CURRENCIES[chainId] || []
        : [];

  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [editCustomCurrency, setEditCustomCurrency] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [initialValue] = useState(value);

  const isCustomCurrency: boolean = useMemo(() => {
    if (initialValue && chainId && initialValue !== customCurrency) {
      if (chainId in CURRENCIES) {
        return !CURRENCIES[chainId]?.find(
          (currency: CurrencyMetadata) =>
            currency.address.toLowerCase() === initialValue.toLowerCase(),
        );
      }

      // for non-default chains
      return true;
    }

    return false;
  }, [chainId, customCurrency, initialValue]);

  const currencyOptions: CurrencyMetadata[] = [
    ...(isPaymentsSelector
      ? []
      : [
          {
            address: NATIVE_TOKEN_ADDRESS.toLowerCase(),
            name: chain?.nativeCurrency.name || "Native Token",
            symbol: chain?.nativeCurrency.symbol || "",
          },
        ]),
    ...(hideDefaultCurrencies ? [] : helperCurrencies),
  ];

  const addCustomCurrency = () => {
    if (!isAddress(editCustomCurrency)) {
      return;
    }
    if (editCustomCurrency) {
      setCustomCurrency(editCustomCurrency);
      if (onChange) {
        onChange({
          target: { value: editCustomCurrency },
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
        } as any);
      }
    } else {
      setEditCustomCurrency(customCurrency);
    }

    setIsAddingCurrency(false);
    setEditCustomCurrency("");
  };

  if (isAddingCurrency && !hideDefaultCurrencies) {
    return (
      <div className="flex items-center">
        <Button
          className="rounded-r-none rounded-l-md"
          onClick={() => setIsAddingCurrency(false)}
        >
          &lt;-
        </Button>
        <Input
          className="w-full rounded-none"
          onChange={(e) => setEditCustomCurrency(e.target.value)}
          placeholder="ERC20 Address"
          required
          value={editCustomCurrency}
        />
        <Button
          className="rounded-r-md rounded-l-none"
          disabled={!isAddress(editCustomCurrency)}
          onClick={addCustomCurrency}
        >
          Save
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        small && !hideDefaultCurrencies && "mt-5",
        className,
      )}
    >
      <Select
        disabled={isDisabled}
        onValueChange={(val) => {
          if (val === "custom") {
            setIsAddingCurrency(true);
          } else {
            onChange?.({
              target: { value: val },
            } as React.ChangeEvent<HTMLSelectElement>);
          }
        }}
        value={
          isPaymentsSelector
            ? value
            : value?.toLowerCase() === ZERO_ADDRESS.toLowerCase()
              ? NATIVE_TOKEN_ADDRESS.toLowerCase()
              : value?.toLowerCase()
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          {chainId &&
            !hideDefaultCurrencies &&
            currencyOptions.map((currency: CurrencyMetadata, idx: number) => (
              <SelectItem
                key={`${currency.address}-${idx}`}
                value={
                  isPaymentsSelector
                    ? currency.symbol
                    : currency.address.toLowerCase()
                }
              >
                {currency.symbol} ({currency.name})
              </SelectItem>
            ))}
          {isCustomCurrency &&
            !isPaymentsSelector &&
            initialValue !== NATIVE_TOKEN_ADDRESS.toLowerCase() && (
              <SelectItem key={initialValue} value={initialValue}>
                {initialValue}
              </SelectItem>
            )}
          {customCurrency && (
            <SelectItem
              key={customCurrency}
              value={customCurrency.toLowerCase()}
            >
              {customCurrency}
            </SelectItem>
          )}
          {!hideDefaultCurrencies && showCustomCurrency && (
            <SelectItem value="custom">Custom ERC20</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

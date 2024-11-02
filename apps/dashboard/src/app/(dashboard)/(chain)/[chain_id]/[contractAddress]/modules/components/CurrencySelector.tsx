import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, type CurrencyMetadata } from "constants/currencies";
import { useMemo, useState } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS, isAddress } from "thirdweb";
import { useAllChainsData } from "../../../../../../../hooks/chains/allChains";

interface CurrencySelectorProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  small?: boolean;
  hideDefaultCurrencies?: boolean;
  showCustomCurrency?: boolean;
  isPaymentsSelector?: boolean;
  defaultCurrencies?: CurrencyMetadata[];
  contractChainId: number;
  field: ControllerRenderProps<TFieldValues>;
}

export function CurrencySelector<
  TFieldValues extends FieldValues = FieldValues,
>({
  small,
  hideDefaultCurrencies,
  showCustomCurrency = true,
  isPaymentsSelector = false,
  defaultCurrencies = [],
  field,
  contractChainId: chainId,
}: CurrencySelectorProps<TFieldValues>) {
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
  const [initialValue] = useState(field.value);

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
      if (field.onChange) {
        field.onChange({
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
          className="rounded-r-none rounded-l-lg"
          onClick={() => setIsAddingCurrency(false)}
        >
          &lt;-
        </Button>
        <Input
          {...field}
          className="w-full rounded-none"
          required
          placeholder="ERC20 Address"
          value={editCustomCurrency}
          onChange={(e) => setEditCustomCurrency(e.target.value)}
        />
        <Button
          className="rounded-r-lg rounded-l-none"
          onClick={addCustomCurrency}
          disabled={!isAddress(editCustomCurrency)}
        >
          Save
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${small && !hideDefaultCurrencies ? "mt-1" : "mt-0"}`}
    >
      <Select
        onValueChange={(value) =>
          value === "custom" ? setIsAddingCurrency(true) : field.onChange(value)
        }
        value={
          isPaymentsSelector
            ? field.value
            : field.value?.toLowerCase() === ZERO_ADDRESS.toLowerCase()
              ? NATIVE_TOKEN_ADDRESS.toLowerCase()
              : field.value?.toLowerCase()
        }
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
        </FormControl>
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

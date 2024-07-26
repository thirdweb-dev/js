import { Flex, Input, Select, type SelectProps } from "@chakra-ui/react";
import { useSDKChainId } from "@thirdweb-dev/react";
import { CURRENCIES, type CurrencyMetadata } from "constants/currencies";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useMemo, useState } from "react";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS, isAddress } from "thirdweb";
import { Button } from "tw-components";

interface CurrencySelectorProps extends SelectProps {
  value: string;
  small?: boolean;
  hideDefaultCurrencies?: boolean;
  showCustomCurrency?: boolean;
  isPaymentsSelector?: boolean;
  defaultCurrencies?: CurrencyMetadata[];
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  small,
  hideDefaultCurrencies,
  showCustomCurrency = true,
  isPaymentsSelector = false,
  defaultCurrencies = [],
  ...props
}) => {
  const chainId = useSDKChainId();
  const configuredChainsRecord = useSupportedChainsRecord();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;

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

  const currencyOptions: CurrencyMetadata[] =
    [
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
    ] || [];

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
      <Flex direction="column">
        <Flex align="center">
          <Button
            borderRadius="4px 0px 0px 4px"
            colorScheme="primary"
            onClick={() => setIsAddingCurrency(false)}
          >
            {"<-"}
          </Button>
          <Input
            w="auto"
            isRequired
            placeholder="ERC20 Address"
            borderRadius="none"
            value={editCustomCurrency}
            onChange={(e) => setEditCustomCurrency(e.target.value)}
          />
          <Button
            borderRadius="0px 4px 4px 0px"
            colorScheme="primary"
            onClick={addCustomCurrency}
            isDisabled={!isAddress(editCustomCurrency)}
          >
            Save
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" mt={small && !hideDefaultCurrencies ? 5 : 0}>
      <Select
        position="relative"
        value={
          isPaymentsSelector
            ? value
            : value?.toLowerCase() === ZERO_ADDRESS.toLowerCase()
              ? NATIVE_TOKEN_ADDRESS.toLowerCase()
              : value?.toLowerCase()
        }
        onChange={(e) => {
          if (e.target.value === "custom") {
            setIsAddingCurrency(true);
          } else {
            onChange?.(e);
          }
        }}
        placeholder="Select Currency"
        {...props}
      >
        {chainId &&
          !hideDefaultCurrencies &&
          currencyOptions.map((currency: CurrencyMetadata, idx: number) => (
            <option
              key={`${currency.address}-${idx}`}
              value={
                isPaymentsSelector
                  ? currency.symbol
                  : currency.address.toLowerCase()
              }
            >
              {currency.symbol} ({currency.name})
            </option>
          ))}
        {isCustomCurrency &&
          !isPaymentsSelector &&
          initialValue !== NATIVE_TOKEN_ADDRESS.toLowerCase() && (
            <option key={initialValue} value={initialValue}>
              {initialValue}
            </option>
          )}
        {customCurrency && (
          <option key={customCurrency} value={customCurrency.toLowerCase()}>
            {customCurrency}
          </option>
        )}
        {!hideDefaultCurrencies && showCustomCurrency && (
          <option value="custom">Custom ERC20</option>
        )}
      </Select>
    </Flex>
  );
};

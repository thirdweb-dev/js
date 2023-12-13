import { Flex, Input, Select, SelectProps } from "@chakra-ui/react";
import { useSDKChainId } from "@thirdweb-dev/react";
import { CURRENCIES, CurrencyMetadata } from "constants/currencies";
import { constants, utils } from "ethers";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import React, { useMemo, useState } from "react";
import { Button } from "tw-components";
import { OtherAddressZero } from "utils/zeroAddress";

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
              address: OtherAddressZero.toLowerCase(),
              name: chain?.nativeCurrency.name || "Native Token",
              symbol: chain?.nativeCurrency.symbol || "",
            },
          ]),
      ...(hideDefaultCurrencies ? [] : helperCurrencies),
    ] || [];

  const addCustomCurrency = () => {
    if (!utils.isAddress(editCustomCurrency)) {
      return;
    }
    if (editCustomCurrency) {
      setCustomCurrency(editCustomCurrency);
      if (onChange) {
        onChange({
          target: { value: editCustomCurrency },
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
            isDisabled={!utils.isAddress(editCustomCurrency)}
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
            : value?.toLowerCase() === constants.AddressZero.toLowerCase()
            ? OtherAddressZero.toLowerCase()
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
          initialValue !== OtherAddressZero.toLowerCase() && (
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

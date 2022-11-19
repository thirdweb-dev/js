import { useDashboardSOLNetworkId } from "@3rdweb-sdk/react";
import { Flex, Input, Select, SelectProps } from "@chakra-ui/react";
import { CurrencyMetadata, SOLANA_CURRENCIES } from "constants/currencies";
import React, { useMemo, useState } from "react";
import { Button } from "tw-components";

interface ProgramCurrencySelectorProps extends SelectProps {
  value: string;
  small?: boolean;
  hideDefaultCurrencies?: boolean;
  activeCurrency?: string;
}

export const ProgramCurrencySelector: React.FC<
  ProgramCurrencySelectorProps
> = ({
  value,
  onChange,
  small,
  hideDefaultCurrencies,
  activeCurrency,
  ...props
}) => {
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [editCustomCurrency, setEditCustomCurrency] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [initialValue] = useState(value);
  const dashboardNetwork = useDashboardSOLNetworkId();

  const currencies =
    SOLANA_CURRENCIES[dashboardNetwork as keyof typeof SOLANA_CURRENCIES];

  const isCustomCurrency: boolean = useMemo(() => {
    if (
      initialValue !== "SOLANA_NATIVE_TOKEN" &&
      initialValue !== customCurrency
    ) {
      return !currencies?.find(
        (currency: CurrencyMetadata) => currency.address === initialValue,
      );
    }

    return false;
  }, [initialValue, customCurrency, currencies]);

  const addCustomCurrency = () => {
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
  };

  if (isAddingCurrency && !hideDefaultCurrencies) {
    return (
      <Flex direction="column" mt={small ? 5 : 0}>
        <Button
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: "none" }}
          size="sm"
          variant="link"
          top="0"
          pos="absolute"
          alignSelf="flex-end"
          fontSize="12px"
          mb="2px"
          color="primary.500"
          cursor="pointer"
          onClick={() => setIsAddingCurrency(false)}
        >
          Cancel
        </Button>
        <Flex align="center">
          <Input
            isRequired
            placeholder="Enter account address..."
            borderRadius="4px 0px 0px 4px"
            value={editCustomCurrency}
            onChange={(e) => setEditCustomCurrency(e.target.value)}
          />
          <Button
            borderRadius="0px 4px 4px 0px"
            colorScheme="primary"
            onClick={addCustomCurrency}
            /*             isDisabled={!utils.isAddress(editCustomCurrency)} */
          >
            +
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" mt={small && !hideDefaultCurrencies ? 5 : 0}>
      {!hideDefaultCurrencies && (
        <Button
          _hover={{ textDecoration: "none" }}
          _focus={{ outline: "none" }}
          size="sm"
          variant="link"
          top="0"
          pos="absolute"
          alignSelf="flex-end"
          fontSize="12px"
          color="primary.500"
          cursor="pointer"
          onClick={() => setIsAddingCurrency(true)}
        >
          Use Custom Currency
        </Button>
      )}
      <Select
        position="relative"
        value={value}
        onChange={onChange}
        placeholder="Select Currency"
        {...props}
      >
        {dashboardNetwork &&
          !hideDefaultCurrencies &&
          currencies?.map((currency: CurrencyMetadata) => (
            <option key={currency.address} value={currency.address}>
              {currency.symbol} ({currency.name})
            </option>
          ))}
        {isCustomCurrency && (
          <option key={initialValue} value={initialValue}>
            {initialValue}
          </option>
        )}
        {customCurrency ? (
          <option key={customCurrency} value={customCurrency}>
            {customCurrency} (Custom)
          </option>
        ) : activeCurrency ? (
          <option key={activeCurrency} value={activeCurrency}>
            {activeCurrency} (Custom)
          </option>
        ) : null}
      </Select>
    </Flex>
  );
};

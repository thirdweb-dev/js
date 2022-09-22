import { Flex, Input, Select, SelectProps } from "@chakra-ui/react";
import { useSDKChainId } from "@thirdweb-dev/react";
import { CURRENCIES, CurrencyMetadata } from "constants/currencies";
import { constants, utils } from "ethers";
import React, { useMemo, useState } from "react";
import { Button } from "tw-components";
import { OtherAddressZero } from "utils/zeroAddress";

interface ICurrencySelector extends SelectProps {
  value: string;
  small?: boolean;
  hideDefaultCurrencies?: boolean;
}

export const CurrencySelector: React.FC<ICurrencySelector> = ({
  value,
  onChange,
  small,
  hideDefaultCurrencies,
  ...props
}) => {
  const chainId = useSDKChainId();

  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [editCustomCurrency, setEditCustomCurrency] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const [initialValue] = useState(value);

  const isCustomCurrency: boolean = useMemo(() => {
    if (initialValue && chainId && initialValue !== customCurrency) {
      return !CURRENCIES[chainId]?.find(
        (currency: CurrencyMetadata) =>
          currency.address.toLowerCase() === initialValue.toLowerCase(),
      );
    }

    return false;
  }, [chainId, customCurrency, initialValue]);

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
            placeholder="Enter contract address..."
            borderRadius="4px 0px 0px 4px"
            value={editCustomCurrency}
            onChange={(e) => setEditCustomCurrency(e.target.value)}
          />
          <Button
            borderRadius="0px 4px 4px 0px"
            colorScheme="primary"
            onClick={addCustomCurrency}
            isDisabled={!utils.isAddress(editCustomCurrency)}
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
        value={
          value?.toLowerCase() === constants.AddressZero.toLowerCase()
            ? OtherAddressZero.toLowerCase()
            : value?.toLowerCase()
        }
        onChange={onChange}
        placeholder="Select Currency"
        {...props}
      >
        {chainId &&
          !hideDefaultCurrencies &&
          CURRENCIES[chainId]
            .filter(
              (currency: CurrencyMetadata) =>
                currency.address.toLowerCase() !==
                constants.AddressZero.toLowerCase(),
            )
            .map((currency: CurrencyMetadata) => (
              <option
                key={currency.address}
                value={currency.address.toLowerCase()}
              >
                {currency.symbol} ({currency.name})
              </option>
            ))}
        {isCustomCurrency && (
          <option key={initialValue} value={initialValue.toLowerCase()}>
            {initialValue}
          </option>
        )}
        {customCurrency && (
          <option key={customCurrency} value={customCurrency.toLowerCase()}>
            {customCurrency}
          </option>
        )}
      </Select>
    </Flex>
  );
};

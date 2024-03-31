import { Flex } from "@chakra-ui/react";
import { useSDKChainId } from "@thirdweb-dev/react";
import { CURRENCIES } from "constants/currencies";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { isAddressZero } from "utils/zeroAddress";

interface PricePreviewProps {
  price: string | number | undefined;
  currencyAddress: string | undefined;
}

export const PricePreview: React.FC<PricePreviewProps> = ({
  price,
  currencyAddress,
}) => {
  const chainId = useSDKChainId();
  const configuredChainsRecord = useSupportedChainsRecord();
  const chain = chainId ? configuredChainsRecord[chainId] : undefined;

  const helperCurrencies = chainId ? CURRENCIES[chainId] || [] : [];

  const foundCurrency = helperCurrencies.find(
    (currency) =>
      currency.address.toLowerCase() === currencyAddress?.toLowerCase(),
  );

  return (
    <Flex direction="column">
      <Text fontWeight="bold">Default price</Text>
      {Number(price) === 0 ? (
        <Text>Free</Text>
      ) : (
        <Text>
          {price}{" "}
          {foundCurrency
            ? foundCurrency.symbol
            : isAddressZero(currencyAddress || "")
              ? chain?.nativeCurrency.symbol || "(Native Token)"
              : `(${shortenIfAddress(currencyAddress)})`}
        </Text>
      )}
    </Flex>
  );
};

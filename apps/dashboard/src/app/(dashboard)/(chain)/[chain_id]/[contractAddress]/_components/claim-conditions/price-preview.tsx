import { CURRENCIES } from "constants/currencies";
import { useAllChainsData } from "hooks/chains/allChains";
import { Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { isAddressZero } from "utils/zeroAddress";

interface PricePreviewProps {
  price: string | number | undefined;
  currencyAddress: string | undefined;
  contractChainId: number;
}

export const PricePreview: React.FC<PricePreviewProps> = ({
  price,
  currencyAddress,
  contractChainId,
}) => {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(contractChainId);
  const helperCurrencies = CURRENCIES[contractChainId] || [];

  const foundCurrency = helperCurrencies.find(
    (currency) =>
      currency.address.toLowerCase() === currencyAddress?.toLowerCase(),
  );

  return (
    <div className="flex flex-col">
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
    </div>
  );
};

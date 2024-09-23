import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { CURRENCIES } from "constants/currencies";
import { Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";
import { isAddressZero } from "utils/zeroAddress";
import { useAllChainsData } from "../../../../hooks/chains/allChains";

interface PricePreviewProps {
  price: string | number | undefined;
  currencyAddress: string | undefined;
}

export const PricePreview: React.FC<PricePreviewProps> = ({
  price,
  currencyAddress,
}) => {
  const chainId = useDashboardEVMChainId();
  const { idToChain } = useAllChainsData();
  const chain = chainId ? idToChain.get(chainId) : undefined;

  const helperCurrencies = chainId ? CURRENCIES[chainId] || [] : [];

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
          {price}
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

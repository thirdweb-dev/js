import { CURRENCIES } from "@/constants/currencies";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { shortenIfAddress } from "@/utils/usedapp-external";
import { isAddressZero } from "@/utils/zeroAddress";

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
    <div className="flex flex-col text-muted-foreground">
      <p className="font-bold">Default price</p>
      {Number(price) === 0 ? (
        <p>Free</p>
      ) : (
        <p>
          {price}{" "}
          {foundCurrency
            ? foundCurrency.symbol
            : isAddressZero(currencyAddress || "")
              ? chain?.nativeCurrency.symbol || "(Native Token)"
              : `(${shortenIfAddress(currencyAddress)})`}
        </p>
      )}
    </div>
  );
};

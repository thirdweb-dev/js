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
    <div className="flex flex-col space-y-0.5">
      <p className="font-medium text-foreground">Default price</p>
      {Number(price) === 0 ? (
        <p className="text-muted-foreground text-sm">Free</p>
      ) : (
        <p className="text-muted-foreground text-sm">
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

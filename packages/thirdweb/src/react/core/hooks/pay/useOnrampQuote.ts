import { useQuery } from "@tanstack/react-query";

export type OnRampQuote = {
  fromCurrency: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
  };
  toToken: {
    symbol?: string | undefined;
    priceUSDCents?: number | undefined;
    name?: string | undefined;
    chainId: number;
    tokenAddress: string;
    decimals: number;
  };
  toAddress: string;
  maxSlippageBPS: number;
  quoteId: string;
  toAmountMinWei: string;
  toAmountMin: string;
  onRampFees: {
    amount: string;
    amountUnits: string;
    decimals: number;
    currencySymbol: string;
    feeType: string;
  }[];
  estimatedDurationSeconds: number;
  onRampLink: string;
};

const stub: OnRampQuote = {
  quoteId: "5a03edad-5d10-4276-b42d-5fc807d356c5",
  toAddress: "0xCF3D06a19263976A540CFf8e7Be7b026801C52A6",
  fromCurrency: {
    amount: "15",
    amountUnits: "1500",
    decimals: 2,
    currencySymbol: "USD",
  },
  toToken: {
    chainId: 10,
    tokenAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    decimals: 6,
    priceUSDCents: 100,
    name: "USD Coin",
    symbol: "USDC",
  },
  toAmountMinWei: "7908995",
  onRampFees: [
    {
      amount: "5.739999999999999",
      amountUnits: "574",
      decimals: 2,
      currencySymbol: "USD",
      feeType: "ON_RAMP",
    },
  ],
  estimatedDurationSeconds: 1776,
  maxSlippageBPS: 500,
  onRampLink:
    "https://app.kado.money/?onPayAmount=15&onPayCurrency=USD&onRevCurrency=USDC&cryptoList=USDC&onToAddress=0xCF3D06a19263976A540CFf8e7Be7b026801C52A6&network=optimism&networkList=optimism&product=BUY&productList=BUY&mode=minimal",
  toAmountMin: "7.908995",
};

/**
 *
 * TODO
 * @internal
 */
export function useOnrampQuote() {
  return useQuery({
    queryKey: ["onrampQuote"],
    queryFn: () => {
      return stub;
    },
    enabled: true,
  });
}

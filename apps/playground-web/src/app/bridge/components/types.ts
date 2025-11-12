import type { Chain } from "thirdweb/chains";
import type { ThemeOverrides } from "thirdweb/react";
import type { Address } from "thirdweb/utils";

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "KRW",
  "CNY",
  "INR",
  "NOK",
  "SEK",
  "CHF",
  "AUD",
  "CAD",
  "NZD",
  "MXN",
  "BRL",
  "CLP",
  "CZK",
  "DKK",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "ISK",
] as const;

type SupportedFiatCurrency = (typeof CURRENCIES)[number];

export type BridgeComponentsPlaygroundOptions = {
  theme: {
    type: "dark" | "light";
    darkColorOverrides: ThemeOverrides["colors"];
    lightColorOverrides: ThemeOverrides["colors"];
  };
  payOptions: {
    title: string | undefined;
    image: string | undefined;
    description: string | undefined;
    buttonLabel: string | undefined;

    buyTokenAddress?: Address;
    buyTokenAmount: string;
    buyTokenChain: Chain;

    // direct_payment mode options
    sellerAddress: Address;
    receiverAddress: Address | undefined;

    // transaction mode options
    transactionData?: string; // Simplified for demo; could be more complex in real implementation

    paymentMethods: ("crypto" | "card")[];

    currency?: SupportedFiatCurrency;

    showThirdwebBranding: boolean;
  };
};

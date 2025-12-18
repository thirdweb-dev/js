import type {
  SupportedFiatCurrency,
  SwapWidgetProps,
  ThemeOverrides,
} from "thirdweb/react";

export type BridgeWidgetPlaygroundOptions = {
  integrationType: "iframe" | "script" | "react";
  theme: {
    type: "dark" | "light";
    darkColorOverrides: ThemeOverrides["colors"];
    lightColorOverrides: ThemeOverrides["colors"];
  };
  currency?: SupportedFiatCurrency;
  prefill?: {
    buyToken?: {
      tokenAddress?: string;
      chainId: number;
      amount?: string;
    };
    sellToken?: {
      tokenAddress?: string;
      chainId: number;
      amount?: string;
    };
  };
  showThirdwebBranding?: SwapWidgetProps["showThirdwebBranding"];
};

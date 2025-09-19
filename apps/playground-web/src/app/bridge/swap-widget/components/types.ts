import type { SwapWidgetProps, ThemeOverrides } from "thirdweb/react";

export type SwapWidgetPlaygroundOptions = {
  theme: {
    type: "dark" | "light";
    darkColorOverrides: ThemeOverrides["colors"];
    lightColorOverrides: ThemeOverrides["colors"];
  };
  currency?: SwapWidgetProps["currency"];
  prefill?: SwapWidgetProps["prefill"];
  showThirdwebBranding?: SwapWidgetProps["showThirdwebBranding"];
};

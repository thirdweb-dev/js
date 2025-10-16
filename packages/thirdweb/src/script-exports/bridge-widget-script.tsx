import { createThirdwebClient } from "../client/client.js";
import type { SupportedFiatCurrency } from "../pay/convert/type.js";
import type { PurchaseData } from "../pay/types.js";
import {
  darkTheme,
  lightTheme,
  type Theme,
  type ThemeOverrides,
} from "../react/core/design-system/index.js";
import type { CompletedStatusResult } from "../react/core/hooks/useStepExecutor.js";
import type { BuyOrOnrampPrepareResult } from "../react/web/ui/Bridge/BuyWidget.js";
import { BridgeWidget } from "../react/web/ui/Bridge/bridge-widget/bridge-widget.js";
import type { SwapPreparedQuote } from "../react/web/ui/Bridge/swap-widget/types.js";

// Note: do not use SwapWidgetProps or BuyWidgetProps references here to keep the output for bridge-widget.d.ts as simple as possible
// Note: these props will be configured buy user in a <script> tag, so they need to be as simple as possible and can not rely on utils like `darkTheme`, `createThirdwebClient` etc..
// For example, instead of having for a `Chain` prop, use `chainId` instead

export type BridgeWidgetScriptProps = {
  clientId: string;
  theme?: "light" | "dark" | ({ type: "light" | "dark" } & ThemeOverrides);
  showThirdwebBranding?: boolean;
  currency?: SupportedFiatCurrency;
  swap?: {
    className?: string;
    style?: React.CSSProperties;
    onSuccess?: (data: {
      quote: SwapPreparedQuote;
      statuses: CompletedStatusResult[];
    }) => void;
    onError?: (error: Error, quote: SwapPreparedQuote) => void;
    onCancel?: (quote: SwapPreparedQuote) => void;
    onDisconnect?: () => void;
    persistTokenSelections?: boolean;
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
  };
  buy?: {
    amount?: string;
    chainId?: number;
    tokenAddress?: string;
    buttonLabel?: string;
    onCancel?: (quote: BuyOrOnrampPrepareResult | undefined) => void;
    onError?: (
      error: Error,
      quote: BuyOrOnrampPrepareResult | undefined,
    ) => void;
    onSuccess?: (data: {
      quote: BuyOrOnrampPrepareResult;
      statuses: CompletedStatusResult[];
    }) => void;
    className?: string;
    country?: string;
    presetOptions?: [number, number, number];
    purchaseData?: PurchaseData;
  };
};

export function BridgeWidgetScript(props: BridgeWidgetScriptProps) {
  const client = createThirdwebClient({ clientId: props.clientId });
  const themeObj: Theme | "light" | "dark" | undefined =
    typeof props.theme === "object"
      ? props.theme.type === "dark"
        ? darkTheme(props.theme)
        : lightTheme(props.theme)
      : props.theme;

  return <BridgeWidget {...props} theme={themeObj} client={client} />;
}

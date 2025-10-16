import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trackPayEvent } from "../../../../../analytics/track/pay.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import type { PurchaseData } from "../../../../../pay/types.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
  type Theme,
} from "../../../../core/design-system/index.js";
import type { CompletedStatusResult } from "../../../../core/hooks/useStepExecutor.js";
import { EmbedContainer } from "../../ConnectWallet/Modal/ConnectEmbed.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { type BuyOrOnrampPrepareResult, BuyWidget } from "../BuyWidget.js";
import { SwapWidget } from "../swap-widget/SwapWidget.js";
import type { SwapPreparedQuote } from "../swap-widget/types.js";

/**
 * Props for the `BridgeWidget` component.
 */
export type BridgeWidgetProps = {
  /**
   * A client is the entry point to the thirdweb SDK. It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the
   * [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` for client-side usage and `secretKey` for server-side usage.
   *
   * @example
   * ```ts
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *   clientId: "<your_client_id>",
   * });
   * ```
   */
  client: ThirdwebClient;

  /**
   * Set the theme for the widget. By default it is set to `"dark"`.
   *
   * Theme can be set to either `"dark"`, `"light"` or a custom theme object.
   * You can also import [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme) from `thirdweb/react`
   * to use the default themes as base and override parts of it.
   *
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *   colors: { modalBg: "red" },
   * });
   * ```
   */
  theme?: "light" | "dark" | Theme;

  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;

  /**
   * The currency to use for fiat pricing in the widget.
   * @default "USD"
   */
  currency?: SupportedFiatCurrency;

  /**
   * Configuration for the Swap tab. This mirrors {@link SwapWidget} options where applicable.
   */
  swap?: {
    /** Optional class name applied to the Swap tab content container. */
    className?: string;
    /** Optional style overrides applied to the Swap tab content container. */
    style?: React.CSSProperties;
    /** Callback invoked when a swap is successful. */
    onSuccess?: (data: {
      quote: SwapPreparedQuote;
      statuses: CompletedStatusResult[];
    }) => void;
    /** Callback invoked when an error occurs during swapping. */
    onError?: (error: Error, quote: SwapPreparedQuote) => void;
    /** Callback invoked when the user cancels the swap. */
    onCancel?: (quote: SwapPreparedQuote) => void;
    /** Callback invoked when the user disconnects the active wallet. */
    onDisconnect?: () => void;
    /**
     * Whether to persist token selections to localStorage so that revisits pre-select last used tokens.
     * Prefill values take precedence over persisted selections.
     * @default true
     */
    persistTokenSelections?: boolean;
    /**
     * Prefill initial buy/sell token selections. If `tokenAddress` is not provided, the native token will be used.
     *
     * @example
     * ### Set an ERC20 token as the buy token
     * ```tsx
     * <BridgeWidget
     *   client={client}
     *   buy={{ amount: "0.1", chainId: 8453 }}
     *   swap={{
     *     prefill: {
     *       buyToken: {
     *         chainId: 8453,
     *         tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
     *       },
     *     },
     *   }}
     * />
     * ```
     *
     * ### Set a native token as the sell token
     * ```tsx
     * <BridgeWidget
     *   client={client}
     *   buy={{ amount: "0.1", chainId: 8453 }}
     *   swap={{
     *     prefill: {
     *       sellToken: { chainId: 8453 },
     *     },
     *   }}
     * />
     * ```
     */
    prefill?: {
      /** Buy token selection. If `tokenAddress` is omitted, the native token will be used. */
      buyToken?: {
        tokenAddress?: string;
        chainId: number;
        /** Optional human-readable amount to prefill for buy. */
        amount?: string;
      };
      /** Sell token selection. If `tokenAddress` is omitted, the native token will be used. */
      sellToken?: {
        tokenAddress?: string;
        chainId: number;
        /** Optional human-readable amount to prefill for sell. */
        amount?: string;
      };
    };
  };

  /**
   * Configuration for the Buy tab. This mirrors {@link BuyWidget} options where applicable.
   */
  buy?: {
    /**
     * The amount to buy (as a decimal string), e.g. "1.5" for 1.5 tokens.
     */
    amount?: string;
    /**
     * The chain the accepted token is on.
     */
    chainId?: number;
    /**
     * Address of the token to buy. Leave undefined for the native token, or use 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE.
     */
    tokenAddress?: string;
    /** Custom label for the main action button. */
    buttonLabel?: string;
    /** Callback triggered when the user cancels the purchase. */
    onCancel?: (quote: BuyOrOnrampPrepareResult | undefined) => void;
    /** Callback triggered when the purchase encounters an error. */
    onError?: (
      error: Error,
      quote: BuyOrOnrampPrepareResult | undefined,
    ) => void;
    /** Callback triggered when the purchase is successful. */
    onSuccess?: (data: {
      quote: BuyOrOnrampPrepareResult;
      statuses: CompletedStatusResult[];
    }) => void;
    /** Optional class name applied to the Buy tab content container. */
    className?: string;
    /** The user's ISO 3166 alpha-2 country code. Used to determine onramp provider support. */
    country?: string;
    /** Preset fiat amounts to display in the UI. Defaults to [5, 10, 20]. */
    presetOptions?: [number, number, number];
    /** Arbitrary data to be included in returned status and webhook events. */
    purchaseData?: PurchaseData;
  };
};

/**
 * A combined widget for swapping or buying tokens with cross-chain support.
 *
 * This component renders two tabs – "Swap" and "Buy" – and orchestrates the appropriate flow
 * by composing {@link SwapWidget} and {@link BuyWidget} under the hood.
 *
 * - The Swap tab enables token-to-token swaps (including cross-chain).
 * - The Buy tab enables purchasing a specific token; by default, it uses card onramp in this widget.
 *
 * @param props - Props of type {@link BridgeWidgetProps} to configure the BridgeWidget component.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * <BridgeWidget
 *   client={client}
 *   currency="USD"
 *   theme="dark"
 *   showThirdwebBranding
 *   buy={{
 *     // Buy 0.1 native tokens on Base
 *     amount: "0.1",
 *     chainId: 8453,
 *   }}
 * />
 * ```
 *
 * ### Prefill swap tokens and configure buy
 * ```tsx
 * <BridgeWidget
 *   client={client}
 *   swap={{
 *     prefill: {
 *       buyToken: {
 *         // Base USDC
 *         chainId: 8453,
 *         tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
 *       },
 *       sellToken: {
 *         // Polygon native token (MATIC)
 *         chainId: 137,
 *       },
 *     },
 *   }}
 *   buy={{
 *     amount: "100",
 *     chainId: 8453,
 *     tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
 *     buttonLabel: "Buy USDC",
 *   }}
 * />
 * ```
 *
 * @bridge
 */
export function BridgeWidget(props: BridgeWidgetProps) {
  const [tab, setTab] = useState<"swap" | "buy">("swap");

  useQuery({
    queryFn: () => {
      trackPayEvent({
        client: props.client,
        event: "ub:ui:bridge_widget:render",
      });
      return true;
    },
    queryKey: ["bridge_widget:render"],
  });

  return (
    <CustomThemeProvider theme={props.theme}>
      <EmbedContainer
        modalSize="compact"
        style={{
          borderRadius: radius.xl,
        }}
      >
        <Container
          px="md"
          py="md"
          flex="row"
          gap="xs"
          borderColor="borderColor"
          style={{
            borderBottomWidth: 1,
            borderBottomStyle: "dashed",
          }}
        >
          <TabButton isActive={tab === "swap"} onClick={() => setTab("swap")}>
            Swap
          </TabButton>
          <TabButton isActive={tab === "buy"} onClick={() => setTab("buy")}>
            Buy
          </TabButton>
        </Container>

        {tab === "swap" && (
          <SwapWidget
            client={props.client}
            prefill={props.swap?.prefill}
            className={props.swap?.className}
            showThirdwebBranding={props.showThirdwebBranding}
            currency={props.currency}
            theme={props.theme}
            onSuccess={props.swap?.onSuccess}
            onError={props.swap?.onError}
            onCancel={props.swap?.onCancel}
            onDisconnect={props.swap?.onDisconnect}
            persistTokenSelections={props.swap?.persistTokenSelections}
            style={{
              border: "none",
              ...props.swap?.style,
            }}
          />
        )}
        {tab === "buy" && (
          <BuyWidget
            client={props.client}
            amount={props.buy?.amount}
            showThirdwebBranding={props.showThirdwebBranding}
            chain={
              props.buy?.chainId ? defineChain(props.buy.chainId) : undefined
            }
            currency={props.currency}
            theme={props.theme}
            title="" // Keep it empty string to hide the title
            tokenAddress={props.buy?.tokenAddress as `0x${string}` | undefined}
            buttonLabel={props.buy?.buttonLabel}
            className={props.buy?.className}
            country={props.buy?.country}
            onCancel={props.buy?.onCancel}
            onError={props.buy?.onError}
            onSuccess={props.buy?.onSuccess}
            presetOptions={props.buy?.presetOptions}
            purchaseData={props.buy?.purchaseData}
            paymentMethods={["card"]}
            style={{
              border: "none",
            }}
          />
        )}
      </EmbedContainer>
    </CustomThemeProvider>
  );
}

function TabButton(props: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const theme = useCustomTheme();
  return (
    <Button
      variant="secondary"
      onClick={props.onClick}
      style={{
        borderRadius: radius.full,
        fontSize: fontSize.sm,
        fontWeight: 500,
        paddingInline: spacing["md+"],
        paddingBlock: spacing.sm,
        border: `1px solid ${
          props.isActive ? theme.colors.secondaryText : theme.colors.borderColor
        }`,
      }}
    >
      {props.children}
    </Button>
  );
}

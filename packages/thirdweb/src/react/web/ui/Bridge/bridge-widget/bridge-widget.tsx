import { useEffect, useRef, useState } from "react";
import { trackPayEvent } from "../../../../../analytics/track/pay.js";
import type { Chain } from "../../../../../chains/types.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import type { PurchaseData } from "../../../../../pay/types.js";
import type { Address } from "../../../../../utils/address.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../../wallets/types.js";
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
import type { SiweAuthOptions } from "../../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButton_connectModalOptions } from "../../../../core/hooks/connection/ConnectButtonProps.js";
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
  className?: string;
  style?: React.CSSProperties;
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
    /**
     * The receiver address for the swapped tokens. If not provided, defaults to the connected wallet address.
     */
    receiverAddress?: Address;
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

  connectOptions?: {
    /**
     * Configurations for the `ConnectButton`'s Modal that is shown for connecting a wallet
     * Refer to the [`ConnectButton_connectModalOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_connectModalOptions) type for more details
     */
    connectModal?: ConnectButton_connectModalOptions;

    /**
     * Configure options for WalletConnect
     *
     * By default WalletConnect uses the thirdweb's default project id.
     * Setting your own project id is recommended.
     *
     * You can create a project id by signing up on [walletconnect.com](https://walletconnect.com/)
     */
    walletConnect?: {
      projectId?: string;
    };

    /**
     * Enable Account abstraction for all wallets. This will connect to the users's smart account based on the connected personal wallet and the given options.
     *
     * This allows to sponsor gas fees for your user's transaction using the thirdweb account abstraction infrastructure.
     *
     */
    accountAbstraction?: SmartWalletOptions;

    /**
     * Array of wallets to show in Connect Modal. If not provided, default wallets will be used.
     */
    wallets?: Wallet[];
    /**
     * When the user has connected their wallet to your site, this configuration determines whether or not you want to automatically connect to the last connected wallet when user visits your site again in the future.
     *
     * By default it is set to `{ timeout: 15000 }` meaning that autoConnect is enabled and if the autoConnection does not succeed within 15 seconds, it will be cancelled.
     *
     * If you want to disable autoConnect, set this prop to `false`.
     *
     * If you want to customize the timeout, you can assign an object with a `timeout` key to this prop.
     */
    autoConnect?:
      | {
          timeout: number;
        }
      | boolean;

    /**
     * Metadata of the app that will be passed to connected wallet. Setting this is highly recommended.
     */
    appMetadata?: AppMetadata;

    /**
     * The [`Chain`](https://portal.thirdweb.com/references/typescript/v5/Chain) object of the blockchain you want the wallet to connect to
     *
     * If a `chain` is not specified, Wallet will be connected to whatever is the default set in the wallet.
     *
     * If a `chain` is specified, Wallet will be prompted to switch to given chain after connection if it is not already connected to it.
     * This ensures that the wallet is connected to the correct blockchain before interacting with your app.
     *
     * The `ConnectButton` also shows a "Switch Network" button until the wallet is connected to the specified chain. Clicking on the "Switch Network" button triggers the wallet to switch to the specified chain.
     *
     * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
     * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
     * ```
     */
    chain?: Chain;

    /**
     * Array of chains that your app supports.
     *
     * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
     * If your app only works on a single blockchain, you should only specify the `chain` prop.
     *
     * Given list of chains will used in various ways:
     * - They will be displayed in the network selector in the `ConnectButton`'s details modal post connection
     * - They will be sent to wallet at the time of connection if the wallet supports requesting multiple chains ( example: WalletConnect ) so that users can switch between the chains post connection easily
     *
     * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
     * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
     *
     * ```tsx
     * import { defineChain } from "thirdweb/react";
     *
     * const polygon = defineChain({
     *   id: 137,
     * });
     * ```
     */
    chains?: Chain[];

    /**
     * Wallets to show as recommended in the `ConnectButton`'s Modal
     */
    recommendedWallets?: Wallet[];

    /**
     * By default, ConnectButton modal shows a "All Wallets" button that shows a list of 500+ wallets.
     *
     * You can disable this button by setting `showAllWallets` prop to `false`
     */
    showAllWallets?: boolean;

    /**
     * Enable SIWE (Sign in with Ethererum) by passing an object of type `SiweAuthOptions` to
     * enforce the users to sign a message after connecting their wallet to authenticate themselves.
     *
     * Refer to the [`SiweAuthOptions`](https://portal.thirdweb.com/references/typescript/v5/SiweAuthOptions) for more details
     */
    auth?: SiweAuthOptions;
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

  const hasFiredRenderEvent = useRef(false);
  useEffect(() => {
    if (hasFiredRenderEvent.current) return;
    hasFiredRenderEvent.current = true;
    trackPayEvent({
      client: props.client,
      event: "ub:ui:bridge_widget:render",
    });
  }, [props.client]);

  return (
    <CustomThemeProvider theme={props.theme}>
      <EmbedContainer
        modalSize="compact"
        className={props.className}
        style={{
          borderRadius: radius.xl,
          ...props.style,
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
            receiverAddress={props.swap?.receiverAddress}
            connectOptions={props.connectOptions}
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
            connectOptions={props.connectOptions}
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
        paddingInline: spacing.md,
        paddingBlock: 0,
        height: "36px",
        color: props.isActive
          ? theme.colors.primaryText
          : theme.colors.secondaryText,
        border: `1px solid ${
          props.isActive ? theme.colors.secondaryText : theme.colors.borderColor
        }`,
      }}
    >
      {props.children}
    </Button>
  );
}

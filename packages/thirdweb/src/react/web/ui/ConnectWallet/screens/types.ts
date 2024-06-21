/**
 * Render custom Welcome Screen in "wide" `ConnectButton`'s Modal either by passing a custom React component or by passing an object with custom title, subtitle and image
 * @example
 *
 * ### Custom React component
 * ```tsx
 * <ConnectButton
 *   connectModal={{
 *     welcomeScreen: () => <CustomComponent />,
 *   }}
 * />;
 * ```
 *
 * ### Custom title, subtitle and image
 * ```tsx
 * <ConnectButton
 *   connectModal={{
 *     welcomeScreen: {
 *       title: "Custom Title",
 *       subtitle: "Custom Subtitle",
 *       img: {
 *         src: "https://example.com/image.png",
 *         width: 100,
 *         height: 100,
 *       },
 *     },
 *   }}
 * />;
 * ```
 * @connectWallet
 */
export type WelcomeScreen =
  | {
      /**
       * Custom title
       */
      title?: string;
      /**
       * Custom subtitle
       */
      subtitle?: string;
      /**
       * Custom image
       */
      img?: {
        /**
         * Image source
         */
        src: string;
        /**
         * Image width
         */
        width?: number;
        /**
         * Image height
         */
        height?: number;
      };
    }
  | (() => React.ReactNode);

export type WalletDetailsModalScreen =
  | "main"
  | "export"
  | "send"
  | "receive"
  | "buy"
  | "network-switcher"
  | "pending-tx"
  | "view-funds"
  | "private-key"
  | "manage-wallet"
  | "wallet-connect-receiver";

import { useState } from "react";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { PayUIOptions } from "./ConnectWallet/ConnectButtonProps.js";
import type { SupportedTokens } from "./ConnectWallet/defaultTokens.js";
import { useConnectLocale } from "./ConnectWallet/locale/getConnectLocale.js";
import BuyScreen from "./ConnectWallet/screens/Buy/BuyScreen.js";
import { BuyTxHistory } from "./ConnectWallet/screens/Buy/tx-history/BuyTxHistory.js";
import { DynamicHeight } from "./components/DynamicHeight.js";
import { Spinner } from "./components/Spinner.js";
import { Container } from "./components/basic.js";
import { CustomThemeProvider } from "./design-system/CustomThemeProvider.js";
import { type Theme, radius } from "./design-system/index.js";
import type { LocaleId } from "./types.js";

/**
 * Props of [`PayEmbedUI`](https://portal.thirdweb.com/references/typescript/v5/PayEmbed) component
 */
export type PayEmbedUIProps = {
  /**
   * Override the default tokens shown in PayEmbed uI
   *
   * By default, PayEmbed shows a few popular tokens for Pay supported chains
   * @example
   *
   * `supportedTokens` prop allows you to override this list as shown below.
   *
   * ```tsx
   * import { PayEmbed } from 'thirdweb/react';
   * import { NATIVE_TOKEN_ADDRESS } from 'thirdweb';
   *
   * function Example() {
   *   return (
   * 		<PayEmbed
   * 			supportedTokens={{
   *        // Override the tokens for Base Mainnet ( chaid id 84532 )
   * 				84532: [
   * 					{
   * 						address: NATIVE_TOKEN_ADDRESS, // use NATIVE_TOKEN_ADDRESS for native token
   * 						name: 'Base ETH',
   * 						symbol: 'ETH',
   * 						icon: 'https://...',
   * 					},
   *          {
   * 						address: '0x...', // token contract address
   * 						name: 'Dai Stablecoin',
   * 						symbol: 'DAI',
   * 						icon: 'https://...',
   * 					},
   * 				],
   * 			}}
   * 		/>
   * 	);
   * }
   * ```
   */
  supportedTokens?: SupportedTokens;
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;
  /**
   * By default - ConnectButton UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the ConnectButton UI by setting the `locale` prop.
   *
   * Refer to the [`LocaleId`](https://portal.thirdweb.com/references/typescript/v5/LocaleId) type for supported locales.
   */
  locale?: LocaleId;
  /**
   * Customize the Pay UI options. Refer to the [`PayUIOptions`](https://portal.thirdweb.com/references/typescript/v5/PayUIOptions) type for more details.
   */
  payOptions?: PayUIOptions;

  /**
   * Set the theme for the `PayEmbed` component. By default it is set to `"dark"`
   *
   * theme can be set to either `"dark"`, `"light"` or a custom theme object.
   * You can also import [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme)
   * functions from `thirdweb/react` to use the default themes as base and overrides parts of it.
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   *
   * function Example() {
   *  return <PayEmbed client={client} theme={customTheme} />
   * }
   * ```
   */
  theme?: "light" | "dark" | Theme;

  /**
   * Account from the connected wallet.
   */
  account: Account;

  /**
   * Chain that the wallet is connected to.
   */
  chain: Chain;

  /**
   * Switch the chain of the connected wallet.
   *
   * When switch chain is completed, pass the new `chain` and
   */
  switchChain: (chain: Chain) => Promise<void>;
};

/**
 * Embed thirdweb Pay UI for Buy tokens using Crypto or Credit Card.
 *
 * PayEmbed also renders a "Connect" button if the user is not connected to a wallet. You can customize the options for "Connect" button using the `connectOptions` prop.
 *
 * @param props - Props of type [`PayEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedProps) to configure the PayEmbed component.
 *
 * @example
 * ```tsx
 * <PayEmbed
 *   client={client}
 *   connectOptions={{
 *     connectModal: {
 *       size: 'compact',
 *     }
 *   }}
 *   payOptions={{
 *     buyWithCrypto: false,
 *   }}
 *  />
 * ```
 */
export function PayEmbedUI(props: PayEmbedUIProps) {
  const localeQuery = useConnectLocale(props.locale || "en_US");
  const [screen, setScreen] = useState<"buy" | "tx-history">("buy");

  let content = null;

  if (!localeQuery.data) {
    content = (
      <div
        style={{
          minHeight: "350px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size="xl" color="secondaryText" />
      </div>
    );
  } else if (screen === "tx-history") {
    content = (
      <BuyTxHistory
        client={props.client}
        onBack={() => {
          setScreen("buy");
        }}
        onDone={() => {
          // noop
        }}
        isBuyForTx={false}
        isEmbed={true}
        account={props.account}
        activeChain={props.chain}
        switchChain={props.switchChain}
      />
    );
  } else {
    content = (
      <BuyScreen
        isEmbed={true}
        supportedTokens={props.supportedTokens}
        theme={props.theme || "dark"}
        client={props.client}
        connectLocale={localeQuery.data}
        onViewPendingTx={() => {
          setScreen("tx-history");
        }}
        payOptions={props.payOptions || {}}
        onDone={() => {
          // noop
        }}
        account={props.account}
        activeChain={props.chain}
        switchChain={props.switchChain}
      />
    );
  }

  return (
    <CustomThemeProvider theme={props.theme || "dark"}>
      <Container
        bg="modalBg"
        style={{
          borderRadius: radius.lg,
          minWidth: "360px",
          borderWidth: "1px",
          borderStyle: "solid",
          position: "relative",
          overflow: "hidden",
        }}
        borderColor="borderColor"
      >
        <DynamicHeight>{content}</DynamicHeight>
      </Container>
    </CustomThemeProvider>
  );
}

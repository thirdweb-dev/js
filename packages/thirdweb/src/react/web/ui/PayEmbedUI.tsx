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
 * @internal
 */
export type PayEmbedUIProps = {
  supportedTokens?: SupportedTokens;
  client: ThirdwebClient;
  locale?: LocaleId;
  payOptions?: PayUIOptions;
  theme?: "light" | "dark" | Theme;
  account: Account;
  chain: Chain;
  switchChain: (chain: Chain) => Promise<void>;
};

/**
 * @internal
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

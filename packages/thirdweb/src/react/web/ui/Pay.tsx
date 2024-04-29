import { useState } from "react";
import type { ThirdwebClient } from "../../../client/client.js";
import { useActiveAccount } from "../../../exports/react-native.js";
import { LoadingScreen } from "../wallets/shared/LoadingScreen.js";
import {
  type SupportedTokens,
  defaultTokens,
} from "./ConnectWallet/defaultTokens.js";
import { useConnectLocale } from "./ConnectWallet/locale/getConnectLocale.js";
import { BuyScreen } from "./ConnectWallet/screens/Buy/SwapScreen.js";
import { BuyTxHistory } from "./ConnectWallet/screens/SwapTransactionsScreen.js";
import { DynamicHeight } from "./components/DynamicHeight.js";
import { Container } from "./components/basic.js";
import { CustomThemeProvider } from "./design-system/CustomThemeProvider.js";
import { type Theme, radius } from "./design-system/index.js";
import type { LocaleId } from "./types.js";

// TODO - JS doc
// TODO - add `account` as prop and use that only in Buy UI so that it's clear to only render this component when you have a connected wallet

export function PayEmbed(props: {
  supportedTokens: SupportedTokens;
  client: ThirdwebClient;
  buyWithCrypto?: false;
  locale?: LocaleId;
  buyWithFiat?:
    | {
        testMode?: boolean;
      }
    | false;
  theme: "light" | "dark" | Theme;
}) {
  const localeQuery = useConnectLocale(props.locale || "en_US");
  const [screen, setScreen] = useState<"buy" | "tx-history">("buy");
  const account = useActiveAccount();

  if (!account) {
    return null;
  }

  if (!localeQuery.data) {
    return <LoadingScreen />;
  }

  if (screen === "tx-history") {
    return <BuyTxHistory client={props.client} />;
  }

  return (
    <CustomThemeProvider theme={props.theme}>
      <Container
        bg="modalBg"
        style={{
          borderRadius: radius.lg,
          minWidth: "360px",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        borderColor="borderColor"
      >
        <DynamicHeight>
          <BuyScreen
            supportedTokens={props.supportedTokens || defaultTokens}
            theme={props.theme}
            client={props.client}
            connectLocale={localeQuery.data}
            onViewPendingTx={() => {
              setScreen("tx-history");
            }}
            payOptions={{
              buyWithCrypto: props.buyWithCrypto,
              buyWithFiat: props.buyWithFiat,
            }}
          />
        </DynamicHeight>
      </Container>
    </CustomThemeProvider>
  );
}

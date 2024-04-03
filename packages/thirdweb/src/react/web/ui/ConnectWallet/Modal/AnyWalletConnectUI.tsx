import { Suspense, lazy, useEffect, useState } from "react";
import { getMIPDStore } from "../../../../../wallets/injected/mipdStore.js";
import type {
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "../../../../../wallets/__generated__/wallet-ids.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { useWalletInfo } from "../../hooks/useWalletInfo.js";
import { InjectedConnectUI } from "./InjectedConnectUI.js";
import type { InjectedWalletLocale } from "../../../wallets/injected/locale/types.js";
import { getInjectedWalletLocale } from "../../../wallets/injected/locale/getInjectedWalletLocale.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { GetStartedScreen } from "../../../wallets/shared/GetStartedScreen.js";
import {
  WalletConnectConnection,
  WalletConnectStandaloneConnection,
} from "../../../wallets/shared/WalletConnectConnection.js";

const CoinbaseSDKWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/shared/CoinbaseSDKConnection.js"),
);
const EmbeddedWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/embedded/EmbeddedWalletConnectUI.js"),
);

/**
 * @internal
 */
export function AnyWalletConnectUI(props: {
  wallet: Wallet;
  done: () => void;
  onBack?: () => void;
  setModalVisibility: (value: boolean) => void;
}) {
  const [screen, setScreen] = useState<"main" | "get-started">("main");
  const walletInfo = useWalletInfo(props.wallet.id);
  const localeId = useWalletConnectionCtx().locale;
  const [locale, setLocale] = useState<InjectedWalletLocale | null>(null);

  useEffect(() => {
    if (!walletInfo.data) {
      return;
    }
    getInjectedWalletLocale(localeId).then((w) => {
      setLocale(w(walletInfo.data.name));
    });
  }, [localeId, walletInfo.data]);

  if (!walletInfo.data || !locale) {
    return <LoadingScreen />;
  }

  // if wallet can connect to injected wallet + wallet is injected
  const isInstalled = getMIPDStore()
    .getProviders()
    .find((w) => w.info.rdns === walletInfo.data.rdns);

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={locale}
        wallet={props.wallet}
        walletInfo={walletInfo.data}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  if (walletInfo.data.rdns && isInstalled) {
    return (
      <InjectedConnectUI
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletInfo={walletInfo.data}
        done={props.done}
        locale={locale}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
      />
    );
  }

  // coinbase wallet sdk
  if (props.wallet.id === "com.coinbase.wallet") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <CoinbaseSDKWalletConnectUI
          locale={locale}
          onGetStarted={() => {
            setScreen("get-started");
          }}
          onBack={props.onBack}
          done={props.done}
          wallet={props.wallet as Wallet<"com.coinbase.wallet">}
          walletInfo={walletInfo.data}
        />
      </Suspense>
    );
  }

  // wallet connect
  if (walletInfo.data.mobile.native || walletInfo.data.mobile.universal) {
    return (
      <WalletConnectConnection
        locale={locale}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
        done={props.done}
        wallet={props.wallet as Wallet<WCSupportedWalletIds>}
        walletInfo={walletInfo.data}
      />
    );
  }

  // wallet connect
  if (props.wallet.id === "walletConnect") {
    return (
      <WalletConnectStandaloneConnection
        locale={locale}
        onBack={props.onBack}
        done={props.done}
        wallet={props.wallet as Wallet<"walletConnect">}
        walletInfo={walletInfo.data}
        setModalVisibility={props.setModalVisibility}
      />
    );
  }

  if (props.wallet.id === "embedded") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EmbeddedWalletConnectUI
          wallet={props.wallet as Wallet<"embedded">}
          done={props.done}
          goBack={props.onBack}
        />
      </Suspense>
    );
  }

  // if can't connect in any way - show get started screen
  return (
    <GetStartedScreen
      locale={locale}
      wallet={props.wallet}
      walletInfo={walletInfo.data}
      onBack={() => {
        setScreen("main");
      }}
    />
  );
}

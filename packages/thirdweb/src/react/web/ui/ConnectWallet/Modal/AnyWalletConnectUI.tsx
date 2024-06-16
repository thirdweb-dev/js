"use client";
import { useQuery } from "@tanstack/react-query";
import { Suspense, lazy, useState } from "react";
import { isMobile } from "../../../../../utils/web/isMobile.js";
import type {
  DeepLinkSupportedWalletIds,
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "../../../../../wallets/__generated__/wallet-ids.js";
import { COINBASE } from "../../../../../wallets/constants.js";
import { getInstalledWalletProviders } from "../../../../../wallets/injected/mipdStore.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { getInjectedWalletLocale } from "../../../wallets/injected/locale/getInjectedWalletLocale.js";
import { GetStartedScreen } from "../../../wallets/shared/GetStartedScreen.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import {
  WalletConnectConnection,
  WalletConnectStandaloneConnection,
} from "../../../wallets/shared/WalletConnectConnection.js";
import { useWalletInfo } from "../../hooks/useWalletInfo.js";
import { DeepLinkConnectUI } from "./DeepLinkConnectUI.js";
import { InjectedConnectUI } from "./InjectedConnectUI.js";

const CoinbaseSDKWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/shared/CoinbaseSDKConnection.js"),
);
const InAppWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/in-app/InAppWalletConnectUI.js"),
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
  const { wallet } = props;
  const walletInfo = useWalletInfo(props.wallet.id);
  const localeId = useConnectUI().locale;

  const localeQuery = useQuery({
    queryKey: ["injectedWalletLocale", localeId, walletInfo.data?.name],
    queryFn: async () => {
      if (!walletInfo.data) {
        throw new Error("Wallet info not available");
      }
      const w = await getInjectedWalletLocale(localeId);
      return w(walletInfo.data.name);
    },
    enabled: !!walletInfo.data,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (!walletInfo.data || !localeQuery.data) {
    return <LoadingScreen />;
  }

  // if wallet can connect to injected wallet + wallet is injected
  const isInstalled = getInstalledWalletProviders().find(
    (w) => w.info.rdns === walletInfo.data.rdns,
  );

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={localeQuery.data}
        wallet={props.wallet}
        walletInfo={walletInfo.data}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  if (
    walletInfo.data.deepLink &&
    !isInstalled &&
    (wallet as Wallet<DeepLinkSupportedWalletIds>).getConfig()
      ?.preferDeepLink &&
    isMobile()
  ) {
    return (
      <DeepLinkConnectUI
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletInfo={walletInfo.data}
        deepLinkPrefix={walletInfo.data.deepLink.mobile}
        locale={localeQuery.data}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
      />
    );
  }

  if (walletInfo.data.rdns && isInstalled) {
    return (
      <InjectedConnectUI
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletInfo={walletInfo.data}
        done={props.done}
        locale={localeQuery.data}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
      />
    );
  }

  // coinbase wallet sdk
  if (props.wallet.id === COINBASE) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <CoinbaseSDKWalletConnectUI
          locale={localeQuery.data}
          onGetStarted={() => {
            setScreen("get-started");
          }}
          onBack={props.onBack}
          done={props.done}
          wallet={props.wallet as Wallet<typeof COINBASE>}
          walletInfo={walletInfo.data}
        />
      </Suspense>
    );
  }

  // wallet connect
  if (walletInfo.data.mobile.native || walletInfo.data.mobile.universal) {
    return (
      <WalletConnectConnection
        locale={localeQuery.data}
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
        locale={localeQuery.data}
        onBack={props.onBack}
        done={props.done}
        wallet={props.wallet as Wallet<"walletConnect">}
        walletInfo={walletInfo.data}
        setModalVisibility={props.setModalVisibility}
      />
    );
  }

  if (props.wallet.id === "inApp" || props.wallet.id === "embedded") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <InAppWalletConnectUI
          wallet={props.wallet as Wallet<"inApp">}
          done={props.done}
          goBack={props.onBack}
        />
      </Suspense>
    );
  }

  // if can't connect in any way - show get started screen
  return (
    <GetStartedScreen
      locale={localeQuery.data}
      wallet={props.wallet}
      walletInfo={walletInfo.data}
      onBack={() => {
        setScreen("main");
      }}
    />
  );
}

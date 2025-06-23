"use client";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isMobile } from "../../../../../utils/web/isMobile.js";
import type {
  DeepLinkSupportedWalletIds,
  InjectedSupportedWalletIds,
  WCSupportedWalletIds,
} from "../../../../../wallets/__generated__/wallet-ids.js";
import { isEcosystemWallet } from "../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { getInstalledWalletProviders } from "../../../../../wallets/injected/mipdStore.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../../wallets/wallet-types.js";
import { iconSize } from "../../../../core/design-system/index.js";
import { useWalletInfo } from "../../../../core/utils/wallet.js";
import { getInjectedWalletLocale } from "../../../wallets/injected/locale/getInjectedWalletLocale.js";
import { GetStartedScreen } from "../../../wallets/shared/GetStartedScreen.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import {
  WalletConnectConnection,
  WalletConnectStandaloneConnection,
} from "../../../wallets/shared/WalletConnectConnection.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { AccentFailIcon } from "../icons/AccentFailIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import { DeepLinkConnectUI } from "./DeepLinkConnectUI.js";
import { InjectedConnectUI } from "./InjectedConnectUI.js";

const CoinbaseSDKWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/shared/CoinbaseSDKConnection.js"),
);
const InAppWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/in-app/InAppWalletConnectUI.js"),
);
const EcosystemWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/ecosystem/EcosystemWalletConnectUI.js"),
);

/**
 * @internal
 */
export function AnyWalletConnectUI(props: {
  wallet: Wallet;
  done: () => void;
  onBack?: () => void;
  setModalVisibility: (value: boolean) => void;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    requireApproval?: boolean;
  };
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  connectLocale: ConnectLocale;
}) {
  const [screen, setScreen] = useState<"main" | "get-started">("main");
  const { wallet } = props;
  const walletInfo = useWalletInfo(props.wallet.id);

  const localeId = props.connectLocale.id;
  const localeFnQuery = useQuery({
    queryFn: async () => {
      return getInjectedWalletLocale(localeId);
    },
    queryKey: ["injectedWalletLocale", localeId, walletInfo.data?.name],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (walletInfo.isLoading || !localeFnQuery.data) {
    return <LoadingScreen />;
  }

  const localeFn = localeFnQuery.data;

  if (!walletInfo.data) {
    const injectedProvider = getInstalledWalletProviders().find(
      (w) => w.info.rdns === wallet.id,
    );

    // Unknown wallet id but it's injected
    if (injectedProvider) {
      return (
        <InjectedConnectUI
          chain={props.chain}
          client={props.client}
          done={props.done}
          locale={localeFn(injectedProvider.info.name)}
          onBack={props.onBack}
          size={props.size}
          wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
          walletName={injectedProvider.info.name}
        />
      );
    }

    // This will only happen if developer passes a wallet with unknown id and it's not injected
    // Adding a fallback UI just in case
    return (
      <Container animate="fadein" flex="column" fullHeight>
        <Container p="lg">
          <ModalHeader onBack={props.onBack} title="Not Supported" />
        </Container>
        <Container
          center="both"
          expand
          flex="column"
          p="lg"
          style={{
            minHeight: "300px",
          }}
        >
          <AccentFailIcon size={iconSize["3xl"]} />
          <Spacer y="lg" />
          <Text center color="primaryText">
            Wallet is not supported
          </Text>
          <Spacer y="xxl" />
        </Container>
      </Container>
    );
  }

  const locale = localeFn(walletInfo.data.name);

  // if wallet can connect to injected wallet + wallet is injected
  const isInstalled = getInstalledWalletProviders().find(
    (w) => w.info.rdns === walletInfo.data.rdns,
  );

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        client={props.client}
        locale={locale}
        onBack={() => {
          setScreen("main");
        }}
        wallet={props.wallet}
        walletInfo={walletInfo.data}
      />
    );
  }

  const shouldDeeplink =
    walletInfo.data.deepLink &&
    !isInstalled &&
    isMobile() &&
    ((wallet as Wallet<DeepLinkSupportedWalletIds>).getConfig()
      ?.preferDeepLink ||
      wallet.id === "app.phantom"); // always deeplink phantom on mobile, does not support remote connection

  if (walletInfo.data.deepLink?.mobile && shouldDeeplink) {
    return (
      <DeepLinkConnectUI
        client={props.client}
        deepLinkPrefix={walletInfo.data.deepLink.mobile}
        locale={locale}
        onBack={props.onBack}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletInfo={walletInfo.data}
      />
    );
  }

  if (walletInfo.data.rdns && isInstalled) {
    return (
      <InjectedConnectUI
        chain={props.chain}
        client={props.client}
        done={props.done}
        locale={locale}
        onBack={props.onBack}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        size={props.size}
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletName={walletInfo.data.name}
      />
    );
  }

  // wallet connect
  if (walletInfo.data.mobile.native || walletInfo.data.mobile.universal) {
    return (
      <WalletConnectConnection
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        done={props.done}
        locale={locale}
        onBack={props.onBack}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        size={props.size}
        wallet={props.wallet as Wallet<WCSupportedWalletIds>}
        walletConnect={props.walletConnect}
        walletInfo={walletInfo.data}
      />
    );
  }

  // wallet connect
  if (props.wallet.id === "walletConnect") {
    return (
      <WalletConnectStandaloneConnection
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        done={props.done}
        locale={locale}
        onBack={props.onBack}
        setModalVisibility={props.setModalVisibility}
        size={props.size}
        wallet={props.wallet as Wallet<"walletConnect">}
        walletConnect={props.walletConnect}
        walletInfo={walletInfo.data}
      />
    );
  }

  if (props.wallet.id === "inApp" || props.wallet.id === "embedded") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <InAppWalletConnectUI
          chain={props.chain}
          client={props.client}
          connectLocale={props.connectLocale}
          done={props.done}
          goBack={props.onBack}
          meta={props.meta}
          size={props.size}
          wallet={props.wallet as Wallet<"inApp">}
          walletConnect={props.walletConnect}
        />
      </Suspense>
    );
  }

  if (isEcosystemWallet(props.wallet.id)) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EcosystemWalletConnectUI
          chain={props.chain}
          client={props.client}
          connectLocale={props.connectLocale}
          done={props.done}
          goBack={props.onBack}
          meta={props.meta}
          size={props.size}
          wallet={props.wallet as Wallet<EcosystemWalletId>}
          walletConnect={props.walletConnect}
        />
      </Suspense>
    );
  }

  // any other known wallet
  if (props.wallet.id) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <CoinbaseSDKWalletConnectUI
          chain={props.chain}
          client={props.client}
          done={props.done}
          locale={locale}
          onBack={props.onBack}
          onGetStarted={() => {
            setScreen("get-started");
          }}
          size={props.size}
          wallet={props.wallet}
          walletInfo={walletInfo.data}
        />
      </Suspense>
    );
  }

  // if can't connect in any way - show get started screen
  return (
    <GetStartedScreen
      client={props.client}
      locale={locale}
      onBack={props.onBack}
      wallet={props.wallet}
      walletInfo={walletInfo.data}
    />
  );
}

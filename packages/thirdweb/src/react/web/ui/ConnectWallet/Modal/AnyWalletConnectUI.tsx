"use client";
import { useQuery } from "@tanstack/react-query";
import { Suspense, lazy, useState } from "react";
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
import { Spacer } from "../../components/Spacer.js";
import { Container, ModalHeader } from "../../components/basic.js";
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
    queryKey: ["injectedWalletLocale", localeId, walletInfo.data?.name],
    queryFn: async () => {
      return getInjectedWalletLocale(localeId);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
          wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
          walletName={injectedProvider.info.name}
          done={props.done}
          locale={localeFn(injectedProvider.info.name)}
          onBack={props.onBack}
          chain={props.chain}
          client={props.client}
          size={props.size}
        />
      );
    }

    // This will only happen if developer passes a wallet with unknown id and it's not injected
    // Adding a fallback UI just in case
    return (
      <Container animate="fadein" fullHeight flex="column">
        <Container p="lg">
          <ModalHeader title="Not Supported" onBack={props.onBack} />
        </Container>
        <Container
          flex="column"
          expand
          center="both"
          p="lg"
          style={{
            minHeight: "300px",
          }}
        >
          <AccentFailIcon size={iconSize["3xl"]} />
          <Spacer y="lg" />
          <Text color="primaryText" center>
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
        locale={locale}
        wallet={props.wallet}
        walletInfo={walletInfo.data}
        onBack={() => {
          setScreen("main");
        }}
        client={props.client}
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
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletInfo={walletInfo.data}
        deepLinkPrefix={walletInfo.data.deepLink.mobile}
        locale={locale}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
        client={props.client}
      />
    );
  }

  if (walletInfo.data.rdns && isInstalled) {
    return (
      <InjectedConnectUI
        wallet={props.wallet as Wallet<InjectedSupportedWalletIds>}
        walletName={walletInfo.data.name}
        done={props.done}
        locale={locale}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onBack={props.onBack}
        chain={props.chain}
        client={props.client}
        size={props.size}
      />
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
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        size={props.size}
        walletConnect={props.walletConnect}
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
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        size={props.size}
        walletConnect={props.walletConnect}
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
          chain={props.chain}
          client={props.client}
          size={props.size}
          walletConnect={props.walletConnect}
          connectLocale={props.connectLocale}
          meta={props.meta}
        />
      </Suspense>
    );
  }

  if (isEcosystemWallet(props.wallet.id)) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EcosystemWalletConnectUI
          wallet={props.wallet as Wallet<EcosystemWalletId>}
          done={props.done}
          goBack={props.onBack}
          chain={props.chain}
          client={props.client}
          size={props.size}
          meta={props.meta}
          walletConnect={props.walletConnect}
          connectLocale={props.connectLocale}
        />
      </Suspense>
    );
  }

  // any other known wallet
  if (props.wallet.id) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <CoinbaseSDKWalletConnectUI
          locale={locale}
          onGetStarted={() => {
            setScreen("get-started");
          }}
          onBack={props.onBack}
          done={props.done}
          wallet={props.wallet}
          walletInfo={walletInfo.data}
          chain={props.chain}
          client={props.client}
          size={props.size}
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
      onBack={props.onBack}
      client={props.client}
    />
  );
}

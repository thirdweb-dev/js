import { useEffect, useState } from "react";
import type { ConnectUIProps } from "../../../core/types/wallets.js";
import type { PlatformURIs } from "../../../core/utils/handleWCSessionRequest.js";
import { GetStartedScreen } from "./GetStartedScreen.js";
import { InjectedConnectUI } from "./InjectedConnectUI.js";
import { WalletConnectConnection } from "./WalletConnectConnection.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { getInjectedWalletLocale } from "../injected/locale/getInjectedWalletLocale.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { LoadingScreen } from "./LoadingScreen.js";
import type { LocaleId } from "../../ui/types.js";

/**
 *
 * @internal
 */
export function InjectedAndWCConnectUI(
  props: ConnectUIProps & {
    projectId?: string;
    platformUris: PlatformURIs;
    links: {
      extension: string;
      android: string;
      ios: string;
    };
    prefetchedLocale?: InjectedWalletLocale;
    prefetchedLocaleId?: LocaleId;
  },
) {
  const [screen, setScreen] = useState<"main" | "get-started">("main");
  const walletConfig = props.walletConfig;
  const { locale: localeId } = useWalletConnectionCtx();
  const [locale, setLocale] = useState<InjectedWalletLocale | undefined>(
    props.prefetchedLocaleId === localeId ? props.prefetchedLocale : undefined,
  );

  useEffect(() => {
    getInjectedWalletLocale(localeId).then((_local) => {
      setLocale(_local(props.walletConfig.metadata.name));
    });
  }, [localeId, props.walletConfig.metadata.name]);

  if (!locale) {
    return <LoadingScreen />;
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={locale}
        walletIconURL={walletConfig.metadata.iconUrl}
        walletName={walletConfig.metadata.name}
        chromeExtensionLink={props.links.extension}
        googlePlayStoreLink={props.links.android}
        appleStoreLink={props.links.ios}
        onBack={() => {
          setScreen("main");
        }}
      />
    );
  }

  if (props.walletConfig.isInstalled && props.walletConfig.isInstalled()) {
    return (
      <InjectedConnectUI
        {...props}
        locale={locale}
        onGetStarted={() => {
          setScreen("get-started");
        }}
      />
    );
  }

  return (
    <WalletConnectConnection
      locale={locale}
      connectUIProps={props}
      onGetStarted={() => {
        setScreen("get-started");
      }}
      platformUris={props.platformUris}
      onBack={props.screenConfig.goBack}
      projectId={props.projectId}
    />
  );
}

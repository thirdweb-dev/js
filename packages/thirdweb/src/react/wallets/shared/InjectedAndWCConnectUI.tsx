import { useState } from "react";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../types/wallets.js";
import type { PlatformURIs } from "../../utils/handleWCSessionRequest.js";
import { GetStartedScreen } from "./GetStartedScreen.js";
import { InjectedConnectUI } from "./InjectedConnectUI.js";
import { WalletConnectConnection } from "./WalletConnectConnection.js";

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
  },
) {
  const [screen, setScreen] = useState<"main" | "get-started">("main");
  const walletConfig = props.walletConfig;
  const locale = useTWLocale().wallets.injectedWallet(
    props.walletConfig.metadata.name,
  );

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
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
        onGetStarted={() => {
          setScreen("get-started");
        }}
      />
    );
  }

  return (
    <WalletConnectConnection
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

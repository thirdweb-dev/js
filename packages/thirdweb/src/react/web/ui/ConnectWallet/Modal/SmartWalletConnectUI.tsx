"use client";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { WalletInfo } from "../../../../../wallets/wallet-info.js";
import { useConnectionManager } from "../../../../core/providers/connection-manager.js";
import { useWalletInfo } from "../../../../core/utils/wallet.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { getSmartWalletLocale } from "../../../wallets/smartWallet/locale/getSmartWalletLocale.js";
import type { SmartWalletLocale } from "../../../wallets/smartWallet/locale/types.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import type { LocaleId } from "../../types.js";
import type { ConnectLocale } from "../locale/types.js";
import { AnyWalletConnectUI } from "./AnyWalletConnectUI.js";

/**
 * @internal
 */
export function SmartConnectUI(props: {
  personalWallet: Wallet;
  done: (smartWallet: Wallet) => void;
  onBack?: () => void;
  accountAbstraction: SmartWalletOptions;
  setModalVisibility: (value: boolean) => void;
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  size: "compact" | "wide";
  client: ThirdwebClient;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  connectLocale: ConnectLocale;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
}) {
  const personalWalletInfo = useWalletInfo(props.personalWallet.id);
  const [keyConnected, setKeyConnected] = useState(false);

  if (!personalWalletInfo.data) {
    return <LoadingScreen />;
  }

  // connect personal wallet
  if (!keyConnected) {
    return (
      <AnyWalletConnectUI
        wallet={props.personalWallet}
        done={() => {
          setKeyConnected(true);
        }}
        onBack={props.onBack}
        setModalVisibility={props.setModalVisibility}
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        meta={props.meta}
        size={props.size}
        walletConnect={props.walletConnect}
        connectLocale={props.connectLocale}
      />
    );
  }

  return (
    <SmartWalletConnecting
      done={props.done}
      personalWallet={props.personalWallet}
      accountAbstraction={props.accountAbstraction}
      onBack={props.onBack}
      personalWalletInfo={personalWalletInfo.data}
      localeId={props.connectLocale.id}
      size={props.size}
      client={props.client}
    />
  );
}

function SmartWalletConnecting(props: {
  done: (smartWallet: Wallet) => void;
  personalWallet: Wallet;
  accountAbstraction: SmartWalletOptions;
  onBack?: () => void;
  personalWalletInfo: WalletInfo;
  localeId: LocaleId;
  size: "compact" | "wide";
  client: ThirdwebClient;
}) {
  const localeQuery = useQuery<SmartWalletLocale>({
    queryKey: ["getSmartWalletLocale", props.localeId],
    queryFn: () => getSmartWalletLocale(props.localeId),
  });
  const { personalWallet } = props;
  const { done } = props;

  const [smartWalletConnectionStatus, setSmartWalletConnectionStatus] =
    useState<"connecting" | "connect-error" | "idle">("idle");
  const connectionManager = useConnectionManager();

  const handleConnect = useCallback(async () => {
    if (!personalWallet) {
      throw new Error("No personal wallet");
    }

    setSmartWalletConnectionStatus("connecting");

    try {
      const connected = await connectionManager.handleConnection(
        personalWallet,
        {
          accountAbstraction: props.accountAbstraction,
          client: props.client,
        },
      );
      done(connected);
      setSmartWalletConnectionStatus("idle");
    } catch (e) {
      console.error(e);
      setSmartWalletConnectionStatus("connect-error");
    }
  }, [
    done,
    personalWallet,
    props.client,
    props.accountAbstraction,
    connectionManager,
  ]);

  const connectStarted = useRef(false);
  useEffect(() => {
    if (!connectStarted.current) {
      handleConnect();
      connectStarted.current = true;
    }
  }, [handleConnect]);

  if (!localeQuery.data) {
    return <LoadingScreen />;
  }

  if (smartWalletConnectionStatus === "connect-error") {
    return (
      <Container
        fullHeight
        animate="fadein"
        flex="column"
        center="both"
        p="lg"
        style={{
          minHeight: "300px",
        }}
      >
        <Text color="danger">{localeQuery.data.failedToConnect}</Text>
      </Container>
    );
  }

  return (
    <Container
      fullHeight
      flex="column"
      center="both"
      style={{
        minHeight: "300px",
      }}
    >
      <Text color="primaryText" multiline center>
        {localeQuery.data.connecting}
      </Text>
      <Spacer y="lg" />
      <Spinner color="accentText" size="lg" />
    </Container>
  );
}

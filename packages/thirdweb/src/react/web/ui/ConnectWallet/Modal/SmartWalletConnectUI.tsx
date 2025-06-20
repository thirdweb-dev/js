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
import { Container } from "../../components/basic.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
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
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        connectLocale={props.connectLocale}
        done={() => {
          setKeyConnected(true);
        }}
        meta={props.meta}
        onBack={props.onBack}
        setModalVisibility={props.setModalVisibility}
        size={props.size}
        wallet={props.personalWallet}
        walletConnect={props.walletConnect}
      />
    );
  }

  return (
    <SmartWalletConnecting
      accountAbstraction={props.accountAbstraction}
      client={props.client}
      done={props.done}
      localeId={props.connectLocale.id}
      onBack={props.onBack}
      personalWallet={props.personalWallet}
      personalWalletInfo={personalWalletInfo.data}
      size={props.size}
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
    queryFn: () => getSmartWalletLocale(props.localeId),
    queryKey: ["getSmartWalletLocale", props.localeId],
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
        animate="fadein"
        center="both"
        flex="column"
        fullHeight
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
      center="both"
      flex="column"
      fullHeight
      style={{
        minHeight: "300px",
      }}
    >
      <Text center color="primaryText" multiline>
        {localeQuery.data.connecting}
      </Text>
      <Spacer y="lg" />
      <Spinner color="accentText" size="lg" />
    </Container>
  );
}

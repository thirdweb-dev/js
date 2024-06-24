"use client";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { webLocalStorage } from "../../../../../utils/storage/webStorage.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { WalletInfo } from "../../../../../wallets/wallet-info.js";
import { connectionManagerSingleton } from "../../../../core/connectionManager.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../../core/design-system/index.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { getSmartWalletLocale } from "../../../wallets/smartWallet/locale/getSmartWalletLocale.js";
import type { SmartWalletLocale } from "../../../wallets/smartWallet/locale/types.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { useWalletInfo } from "../../hooks/useWalletInfo.js";
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
  localeId: LocaleId;
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
        localeId={props.localeId}
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
      localeId={props.localeId}
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
  const [locale, setLocale] = useState<SmartWalletLocale | undefined>();
  const { chain: smartWalletChain } = props.accountAbstraction;

  // FIXME: use a query instead
  useEffect(() => {
    getSmartWalletLocale(props.localeId).then(setLocale);
  }, [props.localeId]);

  const { personalWallet } = props;
  const { done } = props;

  const [personalWalletChainId, setPersonalWalletChainId] = useState<
    number | undefined
  >(personalWallet.getChain()?.id);

  useEffect(() => {
    const unsubChainChanged = personalWallet.subscribe(
      "chainChanged",
      (chain) => setPersonalWalletChainId(chain.id),
    );

    return () => {
      unsubChainChanged();
    };
  }, [personalWallet]);

  const wrongNetwork = personalWalletChainId !== smartWalletChain.id;

  const [smartWalletConnectionStatus, setSmartWalletConnectionStatus] =
    useState<"connecting" | "connect-error" | "idle">("idle");
  const [personalWalletChainSwitchStatus, setPersonalWalletChainSwitchStatus] =
    useState<"switching" | "switch-error" | "idle">("idle");

  const handleConnect = useCallback(async () => {
    if (!personalWallet) {
      throw new Error("No personal wallet");
    }

    setSmartWalletConnectionStatus("connecting");

    try {
      const connected = await connectionManagerSingleton(
        webLocalStorage,
      ).handleConnection(personalWallet, {
        accountAbstraction: props.accountAbstraction,
        client: props.client,
      });
      done(connected);
      setSmartWalletConnectionStatus("idle");
    } catch (e) {
      console.error(e);
      setSmartWalletConnectionStatus("connect-error");
    }
  }, [done, personalWallet, props.client, props.accountAbstraction]);

  const connectStarted = useRef(false);
  useEffect(() => {
    if (!wrongNetwork && !connectStarted.current) {
      handleConnect();
      connectStarted.current = true;
    }
  }, [handleConnect, wrongNetwork]);

  if (!locale) {
    return <LoadingScreen />;
  }

  if (wrongNetwork) {
    return (
      <Container fullHeight animate="fadein" flex="column">
        <Container p="lg">
          <ModalHeader
            title={props.personalWalletInfo.name}
            onBack={props.onBack}
          />
        </Container>

        {props.size === "compact" && <Spacer y="lg" />}

        <Container expand flex="column" center="both" p="lg">
          <Container p={props.size === "wide" ? "lg" : undefined}>
            <Container flex="row" center="x" color="danger">
              <ExclamationTriangleIcon
                width={iconSize.lg}
                height={iconSize.lg}
              />
            </Container>

            <Spacer y="md" />

            <Text size="lg" color="primaryText" center weight={500}>
              {locale.wrongNetworkScreen.title}
            </Text>

            <Spacer y="lg" />

            <Text multiline center>
              {locale.wrongNetworkScreen.subtitle}
            </Text>

            <Spacer y="xl" />

            <Container flex="column" gap="md">
              <Button
                type="button"
                fullWidth
                variant="accent"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
                onClick={async () => {
                  if (!personalWallet.switchChain) {
                    setPersonalWalletChainSwitchStatus("switch-error");
                    throw new Error("No switchChain method");
                  }

                  try {
                    setPersonalWalletChainSwitchStatus("switching");
                    await personalWallet.switchChain(smartWalletChain);
                    const newChain = personalWallet.getChain();
                    if (newChain) {
                      setPersonalWalletChainId(newChain.id);
                    }
                    setPersonalWalletChainSwitchStatus("idle");
                  } catch (e) {
                    console.error(e);
                    setPersonalWalletChainSwitchStatus("switch-error");
                  }
                }}
              >
                {" "}
                {personalWalletChainSwitchStatus === "switching"
                  ? "Switching"
                  : "Switch Network"}
                {personalWalletChainSwitchStatus === "switching" && (
                  <Spinner size="sm" color="accentButtonText" />
                )}
              </Button>

              <Container
                flex="row"
                gap="sm"
                center="both"
                color="danger"
                style={{
                  textAlign: "center",
                  fontSize: fontSize.sm,
                  opacity:
                    personalWalletChainSwitchStatus === "switch-error" ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              >
                <ExclamationTriangleIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                />
                <span>{locale.wrongNetworkScreen.failedToSwitch}</span>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    );
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
        <Text color="danger">{locale.failedToConnect}</Text>
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
        {locale.connecting}
      </Text>
      <Spacer y="lg" />
      <Spinner color="accentText" size="lg" />
    </Container>
  );
}

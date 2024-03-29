import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { AnyWalletConnectUI } from "./AnyWalletConnectUI.js";
import type { SmartWalletLocale } from "../../../wallets/smartWallet/locale/types.js";
import { getSmartWalletLocale } from "../../../wallets/smartWallet/locale/getSmartWalletLocale.js";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { iconSize, spacing, fontSize } from "../../design-system/index.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { Text } from "../../components/text.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import { ModalConfigCtx } from "../../../providers/wallet-ui-states-provider.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import { useWalletInfo } from "../../hooks/useWalletInfo.js";
import type { WalletInfo } from "../../../../../wallets/wallet-info.js";
import { saveConnectParamsToStorage } from "../../../../../wallets/storage/walletStorage.js";
import { asyncLocalStorage } from "../../../../../wallets/storage/asyncLocalStorage.js";

/**
 * @internal
 */
export function SmartConnectUI(props: {
  personalWallet: Wallet;
  done: (smartWallet: Wallet) => void;
  onBack?: () => void;
  accountAbstraction: SmartWalletOptions;
  setModalVisibility: (value: boolean) => void;
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
    />
  );
}

function SmartWalletConnecting(props: {
  done: (smartWallet: Wallet) => void;
  personalWallet: Wallet;
  accountAbstraction: SmartWalletOptions;
  onBack?: () => void;
  personalWalletInfo: WalletInfo;
}) {
  const localeId = useWalletConnectionCtx().locale;
  const client = useWalletConnectionCtx().client;
  const [locale, setLocale] = useState<SmartWalletLocale | undefined>();
  const { modalSize } = useContext(ModalConfigCtx);
  const { chain: smartWalletChain } = props.accountAbstraction;

  useEffect(() => {
    getSmartWalletLocale(localeId).then(setLocale);
  }, [localeId]);

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
    const personalAccount = personalWallet.getAccount();
    if (!personalAccount) {
      throw new Error("No personal account");
    }

    setSmartWalletConnectionStatus("connecting");

    try {
      const smartWallet = createWallet("smart", props.accountAbstraction);
      await smartWallet.connect({
        personalAccount,
        client,
      });

      saveConnectParamsToStorage(asyncLocalStorage, "accountAbstraction", {
        personalWalletId: personalWallet.id,
      });

      done(smartWallet);
      setSmartWalletConnectionStatus("idle");
    } catch (e) {
      console.error(e);
      setSmartWalletConnectionStatus("connect-error");
    }
  }, [client, done, personalWallet, props.accountAbstraction]);

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

        {modalSize === "compact" && <Spacer y="lg" />}

        <Container expand flex="column" center="both" p="lg">
          <Container p={modalSize === "wide" ? "lg" : undefined}>
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

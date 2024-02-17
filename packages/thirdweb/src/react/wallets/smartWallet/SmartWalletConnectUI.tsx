import { useCallback, useEffect, useRef, useState } from "react";
import type { ConnectUIProps, WalletConfig } from "../../types/wallets.js";
import { HeadlessConnectUI } from "../headlessConnectUI.js";
import { SmartWallet, type Wallet } from "../../../wallets/index.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useTWLocale } from "../../providers/locale-provider.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { iconSize, spacing, fontSize } from "../../ui/design-system/index.js";
import { Text } from "../../ui/components/text.js";
import { normalizeChainId } from "../../../wallets/utils/normalizeChainId.js";
import type { Chain } from "../../../chains/index.js";

/**
 * @internal
 */
export const SmartConnectUI = (props: {
  connectUIProps: ConnectUIProps;
  personalWalletConfig: WalletConfig;
  smartWalletChain: Chain;
}) => {
  const [personalWallet, setPersonalWallet] = useState<Wallet | null>(null);
  const { personalWalletConfig } = props;
  const { client, dappMetadata } = useThirdwebProviderProps();

  if (!personalWallet) {
    const _props: ConnectUIProps = {
      walletConfig: personalWalletConfig,
      screenConfig: props.connectUIProps.screenConfig,
      createInstance() {
        return props.personalWalletConfig.create({
          client: client,
          dappMetadata: dappMetadata,
        });
      },
      done(wallet) {
        setPersonalWallet(wallet);
      },
      chain: props.smartWalletChain,
    };

    if (personalWalletConfig.connectUI) {
      return <personalWalletConfig.connectUI {..._props} />;
    }

    return <HeadlessConnectUI {..._props} />;
  }

  return (
    <SmartWalletConnecting
      connectUIProps={props.connectUIProps}
      personalWalletConfig={personalWalletConfig}
      personalWallet={personalWallet}
      smartWalletChain={props.smartWalletChain}
    />
  );
};

const SmartWalletConnecting = (props: {
  connectUIProps: ConnectUIProps;
  personalWallet: Wallet;
  personalWalletConfig: WalletConfig;
  smartWalletChain: Chain;
}) => {
  const locale = useTWLocale().wallets.smartWallet;
  const createSmartWalletInstance = props.connectUIProps.createInstance;
  const { personalWallet } = props;
  const { done } = props.connectUIProps;
  const modalSize = props.connectUIProps.screenConfig.size;

  const [personalWalletChainId, setPersonalWalletChainId] = useState<
    number | undefined
  >(personalWallet.getChain()?.id);

  useEffect(() => {
    function handleChainChanged(chain: string) {
      setPersonalWalletChainId(normalizeChainId(chain));
    }
    personalWallet.events?.addListener("chainChanged", handleChainChanged);

    return () => {
      personalWallet.events?.removeListener("chainChanged", handleChainChanged);
    };
  }, [personalWallet.events]);

  const wrongNetwork = personalWalletChainId !== props.smartWalletChain.id;

  const [smartWalletConnectionStatus, setSmartWalletConnectionStatus] =
    useState<"connecting" | "connect-error" | "idle">("idle");
  const [personalWalletChainSwitchStatus, setPersonalWalletChainSwitchStatus] =
    useState<"switching" | "switch-error" | "idle">("idle");

  const handleConnect = useCallback(async () => {
    if (!personalWallet) {
      throw new Error("No personal account");
    }

    setSmartWalletConnectionStatus("connecting");

    try {
      const smartWallet = createSmartWalletInstance() as SmartWallet; // TODO: fix this type
      await smartWallet.connect({
        personalWallet,
      });

      done(smartWallet);
      setSmartWalletConnectionStatus("idle");
    } catch (e) {
      console.error(e);
      setSmartWalletConnectionStatus("connect-error");
    }
  }, [createSmartWalletInstance, done, personalWallet]);

  const connectStarted = useRef(false);
  useEffect(() => {
    if (!wrongNetwork && !connectStarted.current) {
      handleConnect();
      connectStarted.current = true;
    }
  }, [handleConnect, wrongNetwork]);

  if (smartWalletConnectionStatus === "connecting") {
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
    <Container fullHeight animate="fadein" flex="column">
      <Container p="lg">
        <ModalHeader
          title={props.personalWalletConfig.metadata.name}
          imgSrc={props.personalWalletConfig.metadata.iconUrl}
          onBack={props.connectUIProps.screenConfig.goBack}
        />
      </Container>

      {modalSize === "compact" && <Spacer y="lg" />}

      <Container expand flex="column" center="both" p="lg">
        <Container p={modalSize === "wide" ? "lg" : undefined}>
          <Container flex="row" center="x" color="danger">
            <ExclamationTriangleIcon width={iconSize.lg} height={iconSize.lg} />
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
                  await personalWallet.switchChain(props.smartWalletChain);
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
};

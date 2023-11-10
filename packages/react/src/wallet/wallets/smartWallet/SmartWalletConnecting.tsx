import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { iconSize, spacing, fontSize } from "../../../design-system";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  useConnect,
  useWalletContext,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Container, ModalHeader } from "../../../components/basic";
import { SmartWalletConfig } from "./types";
import { Text } from "../../../components/text";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const SmartWalletConnecting: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  smartWallet: SmartWalletConfig;
  personalWalletConfig: WalletConfig;
}> = (props) => {
  const locale = useTWLocale().wallets.smartWallet;

  // personal wallet
  const { setIsConnectionHidden, hiddenConnection } = useWalletContext();
  const personalWallet = hiddenConnection?.wallet;
  const personalWalletChainId = hiddenConnection?.chainId;
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  // smart wallet
  const connect = useConnect();
  const targetChain = useWalletContext().activeChain;
  const mismatch = targetChain.chainId !== personalWalletChainId;
  const [connectError, setConnectError] = useState(false);
  const [isConnectingSafe, setIsConnectingSafe] = useState(false);

  const { onConnect } = props;
  const connectStarted = useRef(false);

  const modalSize = useContext(ModalConfigCtx).modalSize;

  const handleConnect = useCallback(async () => {
    if (!personalWallet || !personalWalletChainId || connectStarted.current) {
      return;
    }
    setConnectError(false);
    setIsConnectingSafe(true);

    try {
      connectStarted.current = true;
      await connect(props.smartWallet, {
        personalWallet: personalWallet,
      });
      setIsConnectionHidden(false);
      onConnect();
    } catch (e) {
      console.error(e);
      setConnectError(true);
    }
  }, [
    personalWallet,
    personalWalletChainId,
    connect,
    props.smartWallet,
    onConnect,
    setIsConnectionHidden,
  ]);

  useEffect(() => {
    if (!mismatch) {
      handleConnect();
    }
  }, [mismatch, handleConnect, personalWallet, personalWalletChainId]);

  if (!connectError && (isConnectingSafe || !mismatch)) {
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
        <Spinner color="accentText" size="xl" />
      </Container>
    );
  }

  if (connectError) {
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
          title={props.personalWalletConfig.meta.name}
          imgSrc={props.personalWalletConfig.meta.iconURL}
          onBack={props.onBack}
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
                if (!personalWallet) {
                  throw new Error("No active wallet");
                }
                setConnectError(false);
                setSwitchError(false);
                setSwitchingNetwork(true);
                try {
                  await hiddenConnection.switchChain(targetChain.chainId);
                } catch (e) {
                  setSwitchError(true);
                } finally {
                  setSwitchingNetwork(false);
                }
              }}
            >
              {" "}
              {switchingNetwork ? "Switching" : "Switch Network"}
              {switchingNetwork && (
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
                opacity: switchError ? 1 : 0,
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

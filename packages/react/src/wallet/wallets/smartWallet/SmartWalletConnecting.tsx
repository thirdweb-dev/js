import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { ErrorMessage } from "../../../components/formElements";
import { iconSize, spacing, fontSize } from "../../../design-system";
import { useIsHeadlessWallet } from "../../hooks/useIsHeadlessWallet";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  useChain,
  useConnect,
  useConnectionStatus,
  useNetworkMismatch,
  useWalletContext,
  useWallet,
  useSwitchChain,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container, ModalHeader } from "../../../components/basic";
import { SmartWalletConfig } from "./types";
import { Text } from "../../../components/text";

export const gnosisAddressPrefixToChainId = {
  eth: 1,
  matic: 137,
  avax: 43114,
  bnb: 56,
  oeth: 10,
  gor: 5,
} as const;

export const SmartWalletConnecting: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  smartWallet: SmartWalletConfig;
  personalWallet: WalletConfig;
}> = (props) => {
  const activeWallet = useWallet(); // personal wallet

  const connect = useConnect();
  const connectedChain = useChain();
  const targetChain = useWalletContext().activeChain;

  const mismatch = useNetworkMismatch();

  const [connectError, setConnectError] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const connectionStatus = useConnectionStatus();
  const requiresConfirmation = !useIsHeadlessWallet();

  const { onConnect } = props;
  const connectStarted = useRef(false);

  const switchChain = useSwitchChain();

  const handleConnect = useCallback(async () => {
    if (!activeWallet || !connectedChain || connectStarted.current) {
      return;
    }
    setConnectError(false);

    try {
      connectStarted.current = true;
      await connect(props.smartWallet, {
        personalWallet: activeWallet,
      });
      onConnect();
    } catch (e) {
      console.error(e);
      setConnectError(true);
    }
  }, [activeWallet, connectedChain, connect, props.smartWallet, onConnect]);

  useEffect(() => {
    if (!mismatch) {
      handleConnect();
    }
  }, [mismatch, handleConnect, activeWallet, connectedChain]);

  if (!connectError && (connectionStatus === "connecting" || !mismatch)) {
    return (
      <Container
        fullHeight
        flex="column"
        center="both"
        style={{
          minHeight: "300px",
        }}
      >
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
        <Text color="danger">Failed to connect to Smart Wallet</Text>
      </Container>
    );
  }

  return (
    <Container
      fullHeight
      animate="fadein"
      flex="column"
      style={{
        minHeight: "350px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          title={props.personalWallet.meta.name}
          imgSrc={props.personalWallet.meta.iconURL}
          onBack={props.onBack}
        />
      </Container>

      <Container expand flex="column" center="both" p="lg">
        <div>
          <Text size="lg" color="primaryText" center weight={500}>
            Network Mismatch
          </Text>
          <Spacer y="md" />
          <Text multiline center>
            Your wallet is not connected to the required network. Switch to
            required network to continue
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
                if (!activeWallet) {
                  throw new Error("No active wallet");
                }
                setConnectError(false);
                setSwitchError(false);
                setSwitchingNetwork(true);
                try {
                  await switchChain(targetChain.chainId);
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

            {switchingNetwork && requiresConfirmation && (
              <Text color="accentText" size="sm" center>
                Confirm in your wallet
              </Text>
            )}

            {switchError && (
              <ErrorMessage
                style={{
                  display: "flex",
                  gap: spacing.sm,
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: fontSize.sm,
                }}
              >
                <ExclamationTriangleIcon
                  width={iconSize.sm}
                  height={iconSize.sm}
                />
                <span>Failed to switch network.</span>
              </ErrorMessage>
            )}
          </Container>
        </div>
      </Container>
    </Container>
  );
};

import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import { ErrorMessage } from "../../../components/formElements";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { iconSize, spacing, Theme, fontSize } from "../../../design-system";
import { useIsHeadlessWallet } from "../../hooks/useIsHeadlessWallet";
import styled from "@emotion/styled";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  useChain,
  useConnect,
  useConnectionStatus,
  useNetworkMismatch,
  useWalletContext,
  useWallet,
  useSwitchChain,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Flex,
  ScreenBottomContainer,
  ScreenContainer,
} from "../../../components/basic";
import { SmartWalletConfig } from "./types";

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

  if (connectionStatus === "connecting" || !mismatch) {
    return (
      <Flex
        style={{
          height: "300px",
          justifyContent: "center",
          flexDirection: "column",
          gap: spacing.xl,
          alignItems: "center",
        }}
      >
        <Spinner color="accent" size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <ScreenContainer
        style={{
          paddingBottom: 0,
        }}
      >
        <BackButton onClick={props.onBack} />
        <Spacer y="md" />
        <Img
          src={props.smartWallet.meta.iconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
        <Spacer y="lg" />

        <ModalTitle>Network Mismatch</ModalTitle>
        <Spacer y="md" />
        <ModalDescription>
          Selected wallet is not connected to the required network
        </ModalDescription>

        <Spacer y="lg" />

        {connectError && (
          <ErrorMessage
            style={{
              display: "flex",
              gap: spacing.sm,
              alignItems: "center",
              fontSize: fontSize.sm,
            }}
          >
            <ExclamationTriangleIcon width={iconSize.sm} height={iconSize.sm} />
            <span>
              Could not connect to Smart Wallet. <br />
            </span>
          </ErrorMessage>
        )}
      </ScreenContainer>

      <ScreenBottomContainer>
        <Flex flexDirection="column" gap="md">
          <Button
            type="button"
            fullWidth
            variant="secondary"
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
            {switchingNetwork && <Spinner size="sm" color="neutral" />}
          </Button>

          {switchingNetwork && requiresConfirmation && (
            <ConfirmMessage
              style={{
                textAlign: "center",
              }}
            >
              {" "}
              Confirm in your wallet{" "}
            </ConfirmMessage>
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
        </Flex>
      </ScreenBottomContainer>
    </>
  );
};

const ConfirmMessage = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  margin: 0;
  color: ${(p) => p.theme.bg.accent};
`;

import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import { Button } from "../../../../components/buttons";
import { ErrorMessage } from "../../../../components/formElements";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { iconSize, spacing, Theme, fontSize } from "../../../../design-system";
import { useIsHeadlessWallet } from "../../../hooks/useIsHeadlessWallet";
import styled from "@emotion/styled";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  useActiveChain,
  useConnect,
  useConnectionStatus,
  useNetworkMismatch,
  useSupportedWallet,
  useThirdwebWallet,
  useWallet,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useState } from "react";
import { SmartWalletObj } from "../../../wallets/smartWallet";
import { Flex } from "../../../../components/basic";

export const gnosisAddressPrefixToChainId = {
  eth: 1,
  matic: 137,
  avax: 43114,
  bnb: 56,
  oeth: 10,
  gor: 5,
} as const;

export const SmartWalletForm: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const smartWalletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const activeWallet = useWallet(); // personal wallet

  const connect = useConnect();
  const connectedChain = useActiveChain();
  const targetChain = useThirdwebWallet().activeChain;

  const mismatch = useNetworkMismatch();

  const [connectError, setConnectError] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const connectionStatus = useConnectionStatus();
  const requiresConfirmation = !useIsHeadlessWallet();

  const { onConnect } = props;

  const handleConnect = useCallback(async () => {
    if (!activeWallet || !connectedChain) {
      return;
    }
    setConnectError(false);

    try {
      await connect(smartWalletObj, {
        personalWallet: activeWallet,
      });
      onConnect();
    } catch (e) {
      console.error(e);
      setConnectError(true);
    }
  }, [activeWallet, connectedChain, connect, onConnect, smartWalletObj]);

  useEffect(() => {
    if (!mismatch) {
      handleConnect();
    }
  }, [mismatch, handleConnect, activeWallet, connectedChain]);

  if (connectionStatus === "connecting") {
    return (
      <Flex
        style={{
          height: "300px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner color="link" size="lg" />
      </Flex>
    );
  }

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img
        src={smartWalletObj.meta.iconURL}
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

      <Button
        type="button"
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
            await activeWallet.switchChain(targetChain.chainId);
          } catch (e) {
            setSwitchError(true);
          } finally {
            setSwitchingNetwork(false);
          }
        }}
      >
        {" "}
        {switchingNetwork ? "Switching" : "Switch Network"}
        {switchingNetwork && <Spinner size="sm" color="primary" />}
      </Button>

      <Spacer y="md" />

      {switchingNetwork && requiresConfirmation && (
        <ConfirmMessage> Confirm in your wallet </ConfirmMessage>
      )}

      {switchError && (
        <ErrorMessage
          style={{
            display: "flex",
            gap: spacing.sm,
            alignItems: "center",
            fontSize: fontSize.sm,
          }}
        >
          <ExclamationTriangleIcon width={iconSize.sm} height={iconSize.sm} />
          <span>Failed to switch network.</span>
        </ErrorMessage>
      )}
    </>
  );
};

const ConfirmMessage = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.sm};
  margin: 0;
  color: ${(p) => p.theme.link.primary};
`;

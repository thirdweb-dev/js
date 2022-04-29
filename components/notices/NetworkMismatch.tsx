import { useWeb3 } from "@3rdweb-sdk/react";
import { ButtonGroup, Container, Icon, Portal, Stack } from "@chakra-ui/react";
import {
  useDesiredChainId,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { Button, Card, Heading, Text } from "tw-components";
import {
  SUPPORTED_CHAIN_ID,
  SupportedChainIdToNetworkMap,
  getNetworkFromChainId,
} from "utils/network";

export const NetworkMismatchNotice: React.FC = () => {
  const { chainId, getNetworkMetadata } = useWeb3();
  const activeChainId = useDesiredChainId();
  const signerChainId = chainId as SUPPORTED_CHAIN_ID | undefined;
  const [network, switchNetwork] = useNetwork();

  const actuallyCanAttemptSwitch = !!switchNetwork;

  const onSwitchWallet = useCallback(() => {
    if (actuallyCanAttemptSwitch && activeChainId) {
      switchNetwork(activeChainId);
    }
  }, [activeChainId, actuallyCanAttemptSwitch, switchNetwork]);

  const [mismatchDelayExpired, setMismatchDelayExpired] = useState(false);

  const [dismissedForChain, setDismissedForChain] = useState(false);

  useEffect(() => {
    if (chainId) {
      setDismissedForChain(false);
    }
  }, [chainId]);

  const misMatchExists = useNetworkMismatch();

  useEffect(() => {
    if (!misMatchExists) {
      setMismatchDelayExpired(false);
      return;
    }
    const t = setTimeout(() => {
      if (misMatchExists) {
        setMismatchDelayExpired(true);
      }
    }, 1000);

    return () => {
      clearTimeout(t);
    };
  }, [misMatchExists]);
  if (!misMatchExists || !mismatchDelayExpired) {
    return null;
  }
  if (!signerChainId || !activeChainId) {
    return null;
  }
  if (dismissedForChain) {
    return null;
  }

  const signerNetworkIsSupported =
    signerChainId in SupportedChainIdToNetworkMap;

  const walletNetwork = (
    signerNetworkIsSupported
      ? getNetworkFromChainId(signerChainId)
      : getNetworkMetadata(signerChainId as unknown as number).chainName
  )
    .split("")
    .map((s, idx) => (idx === 0 ? s.toUpperCase() : s))
    .join("");

  const twNetwork = getNetworkFromChainId(activeChainId)
    .split("")
    .map((s, idx) => (idx === 0 ? s.toUpperCase() : s))
    .join("");

  return (
    <Portal>
      <Card
        backgroundColor="backgroundHighlight"
        zIndex="popover"
        pb={6}
        position="fixed"
        m={4}
        bottom={0}
        right={0}
      >
        <Container as={Stack} spacing={4}>
          <Heading size="label.lg">
            <Stack direction="row" align="center">
              <Icon boxSize={6} as={AiOutlineWarning} />
              <span>Network Mismatch</span>
            </Stack>
          </Heading>

          <Text>
            You are connected to the <strong>{walletNetwork}</strong> network
            but you are exploring the dashboard on the{" "}
            <strong>{twNetwork}</strong> network. They need to match if you want
            to interact with the dashboard.
          </Text>
          <ButtonGroup size="sm">
            <Button
              onClick={onSwitchWallet}
              isLoading={network.loading}
              isDisabled={!actuallyCanAttemptSwitch}
              colorScheme="orange"
            >
              Switch wallet to {twNetwork}
            </Button>
            {signerNetworkIsSupported && (
              <Button
                isLoading={network.loading}
                variant="outline"
                colorScheme="orange"
                onClick={() => setDismissedForChain(true)}
              >
                Dismiss warning
              </Button>
            )}
          </ButtonGroup>
          {!actuallyCanAttemptSwitch && (
            <Text size="body.sm" fontStyle="italic">
              Your connected wallet does not support programatic switching.
              <br />
              Please manually switch the network in your wallet.
            </Text>
          )}
        </Container>
      </Card>
    </Portal>
  );
};

import { ConnectWallet, useWeb3 } from "@3rdweb-sdk/react";
import {
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useDesiredChainId,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import React, { useCallback, useRef } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Button, ButtonProps, Card, Heading, Text } from "tw-components";
import {
  SUPPORTED_CHAIN_ID,
  SupportedChainIdToNetworkMap,
  getNetworkFromChainId,
} from "utils/network";

export const MismatchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isDisabled, onClick, loadingText, type, ...props }, ref) => {
    const { address } = useWeb3();

    const initialFocusRef = useRef<HTMLButtonElement>(null);

    const networksMismatch = useNetworkMismatch();

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!address) {
      return (
        <ConnectWallet borderRadius="full" colorScheme="primary" {...props} />
      );
    }

    return (
      <Popover
        initialFocusRef={initialFocusRef}
        isLazy
        isOpen={isOpen}
        onOpen={networksMismatch ? onOpen : undefined}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            {...props}
            type={networksMismatch ? "button" : type}
            loadingText={loadingText}
            onClick={networksMismatch ? undefined : onClick}
            ref={ref}
            isDisabled={isDisabled}
          >
            {children}
          </Button>
        </PopoverTrigger>
        <Card
          as={PopoverContent}
          bg="backgroundCardHighlight"
          mx={6}
          boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
        >
          <PopoverArrow bg="backgroundCardHighlight" />
          <PopoverBody>
            <MismatchNotice
              initialFocusRef={initialFocusRef}
              onClose={onClose}
            />
          </PopoverBody>
        </Card>
      </Popover>
    );
  },
);

MismatchButton.displayName = "MismatchButton";

const MismatchNotice: React.VFC<{
  initialFocusRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}> = ({ initialFocusRef, onClose }) => {
  const { chainId, getNetworkMetadata } = useWeb3();
  const activeChainId = useDesiredChainId();
  const signerChainId = chainId as SUPPORTED_CHAIN_ID;
  const [network, switchNetwork] = useNetwork();

  const actuallyCanAttemptSwitch = !!switchNetwork;

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

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && activeChainId) {
      await switchNetwork(activeChainId);
    }
    onClose();
  }, [activeChainId, actuallyCanAttemptSwitch, onClose, switchNetwork]);

  return (
    <Flex direction="column" gap={4}>
      <Heading size="label.lg">
        <Flex gap={2} align="center">
          <Icon boxSize={6} as={AiOutlineWarning} />
          <span>Network Mismatch</span>
        </Flex>
      </Heading>

      <Text>
        You are connected to the <strong>{walletNetwork}</strong> network but
        you are trying to interact on the <strong>{twNetwork}</strong> network.
      </Text>

      <Button
        ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
        leftIcon={<Icon as={VscDebugDisconnect} />}
        size="sm"
        onClick={onSwitchWallet}
        isLoading={network.loading}
        isDisabled={!actuallyCanAttemptSwitch}
        colorScheme="orange"
      >
        Switch wallet to {twNetwork}
      </Button>

      {!actuallyCanAttemptSwitch && (
        <Text size="body.sm" fontStyle="italic">
          Your connected wallet does not support programatic switching.
          <br />
          Please manually switch the network in your wallet.
        </Text>
      )}
    </Flex>
  );
};

import { ConnectWallet, FAUCETS, useWeb3 } from "@3rdweb-sdk/react";
import {
  Box,
  ButtonGroup,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineWarning } from "@react-icons/all-files/ai/AiOutlineWarning";
import {
  useBalance,
  useChainId,
  useDesiredChainId,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import React, { useCallback, useRef } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import {
  Button,
  ButtonProps,
  Card,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import {
  SupportedChainIdToNetworkMap,
  getNetworkFromChainId,
} from "utils/network";

export const MismatchButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isDisabled, onClick, loadingText, type, ...props }, ref) => {
    const { address } = useWeb3();
    const balance = useBalance();

    const isBalanceZero = BigNumber.from(balance.data?.value || 0).eq(0);

    const initialFocusRef = useRef<HTMLButtonElement>(null);

    const networksMismatch = useNetworkMismatch();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackEvent = useTrack();
    const { chainId, getNetworkMetadata } = useWeb3();
    const { isTestnet } = getNetworkMetadata(chainId || 0);

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
        onOpen={
          networksMismatch || (isBalanceZero && isTestnet) ? onOpen : undefined
        }
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            {...props}
            type={
              networksMismatch || (isBalanceZero && isTestnet) ? "button" : type
            }
            loadingText={loadingText}
            onClick={(e) => {
              if (isBalanceZero && isTestnet) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label:
                    SupportedChainIdToNetworkMap[chainId as SUPPORTED_CHAIN_ID],
                });
              }
              if (networksMismatch || (isBalanceZero && isTestnet)) {
                return undefined;
              }
              if (onClick) {
                return onClick(e);
              }
            }}
            ref={ref}
            isDisabled={isDisabled}
          >
            {children}
          </Button>
        </PopoverTrigger>
        <Card
          maxW="sm"
          w="auto"
          as={PopoverContent}
          bg="backgroundCardHighlight"
          mx={6}
          boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
        >
          <PopoverArrow bg="backgroundCardHighlight" />
          <PopoverBody>
            {networksMismatch ? (
              <MismatchNotice
                initialFocusRef={initialFocusRef}
                onClose={onClose}
              />
            ) : (
              <NoFundsNotice />
            )}
          </PopoverBody>
        </Card>
      </Popover>
    );
  },
);

MismatchButton.displayName = "MismatchButton";

const MismatchNotice: React.FC<{
  initialFocusRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}> = ({ initialFocusRef, onClose }) => {
  const { chainId, getNetworkMetadata } = useWeb3();
  const desiredChainId = useDesiredChainId();

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

  const twNetwork = getNetworkFromChainId(desiredChainId)
    .split("")
    .map((s, idx) => (idx === 0 ? s.toUpperCase() : s))
    .join("");

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId) {
      await switchNetwork(desiredChainId);
    }
    onClose();
  }, [desiredChainId, actuallyCanAttemptSwitch, onClose, switchNetwork]);

  return (
    <Flex direction="column" gap={4}>
      <Heading size="label.lg">
        <Flex gap={2} align="center">
          <Icon boxSize={6} as={AiOutlineWarning} />
          <span>Network Mismatch</span>
        </Flex>
      </Heading>

      <Text>
        Your wallet is connected to the{" "}
        <Box as="strong" textTransform="capitalize">
          {walletNetwork.replace("-", " ")}
        </Box>{" "}
        network but this action requires you to connect to the{" "}
        <Box as="strong" textTransform="capitalize">
          {twNetwork.replace("-", " ")}
        </Box>{" "}
        network.
      </Text>

      <Button
        ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
        leftIcon={<Icon as={VscDebugDisconnect} />}
        size="sm"
        onClick={onSwitchWallet}
        isLoading={network.loading}
        isDisabled={!actuallyCanAttemptSwitch}
        colorScheme="orange"
        textTransform="capitalize"
      >
        Switch wallet to {twNetwork.replace("-", " ")}
      </Button>

      {!actuallyCanAttemptSwitch && (
        <Text size="body.sm" fontStyle="italic">
          Your connected wallet does not support programmatic switching.
          <br />
          Please manually switch the network in your wallet.
        </Text>
      )}
    </Flex>
  );
};

const NoFundsNotice = () => {
  const chainId = useChainId();
  const { getNetworkMetadata } = useWeb3();
  const { symbol, isTestnet } = getNetworkMetadata(chainId || 0);
  const trackEvent = useTrack();

  return (
    <Flex direction="column" gap={4}>
      <Heading size="label.lg">
        <Flex gap={2} align="center">
          <Icon boxSize={6} as={AiOutlineWarning} />
          <span>No funds</span>
        </Flex>
      </Heading>

      <Text>
        You don&apos;t have any funds on this network. You&apos;ll need some{" "}
        {symbol} to pay for gas.
        {isTestnet &&
          FAUCETS[chainId as keyof typeof FAUCETS] &&
          " You can get some from the faucet below."}
      </Text>

      <ButtonGroup size="sm">
        {isTestnet && FAUCETS[chainId as keyof typeof FAUCETS] && (
          <LinkButton
            colorScheme="orange"
            href={FAUCETS[chainId as keyof typeof FAUCETS] || ""}
            isExternal
            onClick={() =>
              trackEvent({
                category: "no-funds",
                action: "click",
                label:
                  SupportedChainIdToNetworkMap[chainId as SUPPORTED_CHAIN_ID],
              })
            }
          >
            Get {symbol} from faucet
          </LinkButton>
        )}
      </ButtonGroup>
    </Flex>
  );
};

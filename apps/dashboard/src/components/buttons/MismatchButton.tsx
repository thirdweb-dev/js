import { thirdwebClient } from "@/constants/client";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Box,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineWarning } from "@react-icons/all-files/ai/AiOutlineWarning";
import { ChainId, useSDK, useSDKChainId } from "@thirdweb-dev/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChain } from "hooks/chains/configureChains";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useSwitchActiveWalletChain,
  useWalletBalance,
} from "thirdweb/react";
import { Button, type ButtonProps, Card, Heading, Text } from "tw-components";
import { defineDashboardChain } from "../../lib/v5-adapter";

function useNetworkMismatchAdapter() {
  const walletChainId = useActiveWalletChain()?.id;
  const v4SDKChainId = useSDKChainId();
  if (!walletChainId || !v4SDKChainId) {
    // simply not ready yet, assume false
    return false;
  }
  // otherwise, compare the chain ids
  return walletChainId !== v4SDKChainId;
}

export const MismatchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isDisabled, onClick, loadingText, type, ...props }, ref) => {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const activeWalletChain = useActiveWalletChain();
    const evmBalance = useWalletBalance({
      address: account?.address,
      chain: activeWalletChain,
      client: thirdwebClient,
    });
    const initialFocusRef = useRef<HTMLButtonElement>(null);
    const networksMismatch = useNetworkMismatchAdapter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackEvent = useTrack();

    const chainId = useActiveWalletChain()?.id;
    const chainInfo = useSupportedChain(chainId || -1);

    const eventRef = useRef<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
    if (!wallet) {
      return (
        <CustomConnectWallet
          borderRadius="md"
          colorScheme="primary"
          {...props}
        />
      );
    }
    const shouldShowEVMFaucet = (evmBalance.data?.value || 0n) === 0n;
    return (
      <Popover
        initialFocusRef={initialFocusRef}
        isLazy
        isOpen={isOpen}
        onOpen={networksMismatch || shouldShowEVMFaucet ? onOpen : undefined}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            isLoading={evmBalance.isLoading}
            {...props}
            type={networksMismatch || shouldShowEVMFaucet ? "button" : type}
            loadingText={loadingText}
            onClick={(e) => {
              e.stopPropagation();
              if (shouldShowEVMFaucet) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: "evm",
                });
              }
              if (networksMismatch || shouldShowEVMFaucet) {
                eventRef.current = e;
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
          maxW={{ base: "xs", md: "sm" }}
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
                onClose={(hasSwitched) => {
                  onClose();
                  if (hasSwitched && onClick) {
                    // wait for the network switch to be finished - 100ms should be fine?
                    setTimeout(() => {
                      if (eventRef.current) {
                        onClick(eventRef.current);
                      }
                    }, 100);
                  }
                }}
              />
            ) : (
              <NoFundsNotice symbol={chainInfo?.nativeCurrency.symbol || ""} />
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
  onClose: (hasSwitched: boolean) => void;
}> = ({ initialFocusRef, onClose }) => {
  const connectedChainId = useActiveWalletChain()?.id;
  const desiredChainId = useSDKChainId();
  const switchNetwork = useSwitchActiveWalletChain();
  const connectionStatus = useActiveWalletConnectionStatus();
  const activeWallet = useActiveWallet();
  const actuallyCanAttemptSwitch =
    activeWallet && activeWallet.id !== "global.safe";
  const walletConnectedNetworkInfo = useSupportedChain(connectedChainId || -1);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const chain = useSupportedChain(desiredChainId || -1);

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId && chain) {
      try {
        await switchNetwork(defineDashboardChain(desiredChainId));
        onClose(true);
      } catch (e) {
        //  failed to switch network
        onClose(false);
      }
    }
  }, [chain, actuallyCanAttemptSwitch, desiredChainId, onClose, switchNetwork]);

  const shortenedName = useMemo(() => {
    const limit = isMobile ? 10 : 19;

    if (!chain?.name) {
      return undefined;
    }
    return chain.name.length > limit
      ? `${chain.name.slice(0, limit)}...`
      : undefined;
  }, [chain?.name, isMobile]);

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
          {walletConnectedNetworkInfo?.name}
        </Box>{" "}
        network but this action requires you to connect to the{" "}
        <Box as="strong" textTransform="capitalize">
          {chain?.name}
        </Box>{" "}
        network.
      </Text>

      <Button
        ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
        leftIcon={<Icon as={VscDebugDisconnect} />}
        size="sm"
        onClick={onSwitchWallet}
        isLoading={connectionStatus === "connecting"}
        isDisabled={!actuallyCanAttemptSwitch}
        colorScheme="orange"
        textTransform="capitalize"
        noOfLines={1}
      >
        Switch wallet {chain ? `to ${shortenedName || chain.name}` : ""}
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

interface NoFundsNoticeProps {
  symbol: string;
}

const NoFundsNotice: React.FC<NoFundsNoticeProps> = ({ symbol }) => {
  const trackEvent = useTrack();

  const sdk = useSDK();
  const chainId = useActiveWalletChain()?.id;
  const chainInfo = useSupportedChain(chainId || -1);

  const hasFaucet =
    chainInfo &&
    (chainInfo.chainId === ChainId.Localhost ||
      (chainInfo.faucets && chainInfo.faucets.length > 0));

  const requestFunds = async () => {
    if (sdk && hasFaucet) {
      trackEvent({
        category: "no-funds",
        action: "click",
        label: "request-funds",
      });
      if (chainInfo.chainId === ChainId.Localhost) {
        await sdk.wallet.requestFunds(10);
      } else if (chainInfo?.faucets && chainInfo.faucets.length > 0) {
        const faucet = chainInfo.faucets[0];
        window.open(faucet, "_blank");
      }
    }
  };

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
        {hasFaucet && " You can get some from the faucet below."}
      </Text>

      {sdk && hasFaucet && (
        <Button size="sm" colorScheme="orange" onClick={requestFunds}>
          Get {symbol} from faucet
        </Button>
      )}
    </Flex>
  );
};

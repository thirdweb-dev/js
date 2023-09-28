import {
  CustomConnectWallet,
  ConnectWalletProps,
} from "@3rdweb-sdk/react/components/connect-wallet";
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
import { useWallet as useWalletSol } from "@solana/wallet-adapter-react";
import {
  ChainId,
  useBalance,
  useChainId,
  useConnectionStatus,
  useNetworkMismatch,
  useSDK,
  useSDKChainId,
  useSwitchChain,
  useWallet,
} from "@thirdweb-dev/react";
import {
  useBalance as useSolBalance,
  useSDK as useSolanaSDK,
} from "@thirdweb-dev/react/solana";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChain } from "hooks/chains/configureChains";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Button, Card, Heading, Text } from "tw-components";

export const MismatchButton = React.forwardRef<
  HTMLButtonElement,
  ConnectWalletProps
>(
  (
    {
      children,
      isDisabled,
      onClick,
      loadingText,
      type,
      ecosystem = "evm",
      upsellTestnet = false,
      onChainSelect,
      ...props
    },
    ref,
  ) => {
    const wallet = useWallet();
    const { publicKey } = useWalletSol();
    const evmBalance = useBalance();
    const solBalance = useSolBalance();
    const solNetwork = useSolanaSDK()?.network;
    const initialFocusRef = useRef<HTMLButtonElement>(null);
    const networksMismatch = useNetworkMismatch() && ecosystem === "evm";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackEvent = useTrack();

    const chainId = useChainId();
    const chainInfo = useSupportedChain(chainId || -1);

    const hasFaucet =
      chainInfo &&
      (chainInfo.chainId === ChainId.Localhost ||
        (chainInfo.faucets && chainInfo.faucets.length > 0));
    const eventRef = useRef<React.MouseEvent<HTMLButtonElement, MouseEvent>>();
    if (!wallet && ecosystem === "evm") {
      return (
        <CustomConnectWallet
          borderRadius="md"
          colorScheme="primary"
          ecosystem={ecosystem}
          {...props}
        />
      );
    }

    if (!publicKey && ecosystem === "solana") {
      return (
        <CustomConnectWallet
          borderRadius="md"
          colorScheme="primary"
          ecosystem={ecosystem}
          {...props}
        />
      );
    }

    const shouldShowSolanaFaucet =
      ecosystem === "solana" &&
      BigNumber.from(solBalance.data?.value || 0).eq(0) &&
      solNetwork === "devnet";

    const shouldShowEVMFaucet =
      ecosystem === "evm" && BigNumber.from(evmBalance.data?.value || 0).eq(0);

    const shouldShowEitherFaucet =
      shouldShowSolanaFaucet || shouldShowEVMFaucet;

    return (
      <Popover
        initialFocusRef={initialFocusRef}
        isLazy
        isOpen={isOpen}
        onOpen={networksMismatch || shouldShowEitherFaucet ? onOpen : undefined}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            isLoading={
              (ecosystem === "evm" && evmBalance.isLoading) ||
              (ecosystem === "solana" && solBalance.isLoading)
            }
            {...props}
            type={networksMismatch || shouldShowEitherFaucet ? "button" : type}
            loadingText={loadingText}
            onClick={(e) => {
              e.stopPropagation();
              if (shouldShowEitherFaucet) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: ecosystem,
                });
              }
              if (networksMismatch || shouldShowEitherFaucet) {
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
            ) : !hasFaucet &&
              upsellTestnet &&
              ecosystem === "evm" &&
              onChainSelect ? (
              <UpsellTestnetNotice
                initialFocusRef={initialFocusRef}
                onClose={onClose}
                onChainSelect={onChainSelect}
              />
            ) : (
              <NoFundsNotice
                symbol={
                  ecosystem === "solana"
                    ? "SOL"
                    : chainInfo?.nativeCurrency.symbol || ""
                }
                ecosystem={ecosystem}
              />
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
  const connectedChainId = useChainId();
  const desiredChainId = useSDKChainId();
  const switchNetwork = useSwitchChain();
  const connectionStatus = useConnectionStatus();
  const activeChain = useWallet();
  const actuallyCanAttemptSwitch =
    activeChain && activeChain.walletId !== "Safe";
  const walletConnectedNetworkInfo = useSupportedChain(connectedChainId || -1);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const chain = useSupportedChain(desiredChainId || -1);

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId && chain) {
      try {
        await switchNetwork(desiredChainId);
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
        isLoading={
          connectionStatus === "connecting" || connectionStatus === "unknown"
        }
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
  ecosystem: "solana" | "evm" | "either";
}

const NoFundsNotice: React.FC<NoFundsNoticeProps> = ({ symbol, ecosystem }) => {
  const trackEvent = useTrack();

  const balanceQuery = useBalance();
  const sdk = useSDK();
  const chainId = useChainId();
  const chainInfo = useSupportedChain(chainId || -1);

  const hasFaucet =
    chainInfo &&
    (chainInfo.chainId === ChainId.Localhost ||
      (chainInfo.faucets && chainInfo.faucets.length > 0));

  const requestFunds = async () => {
    if (ecosystem === "solana") {
      window.open("/faucet/solana", "_blank");
    } else if (sdk && hasFaucet) {
      trackEvent({
        category: "no-funds",
        action: "click",
        label: "request-funds",
      });
      if (chainInfo.chainId === ChainId.Localhost) {
        await sdk.wallet.requestFunds(10);
        await balanceQuery.refetch();
      } else if (
        chainInfo &&
        chainInfo.faucets &&
        chainInfo.faucets.length > 0
      ) {
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

const UpsellTestnetNotice: React.FC<{
  initialFocusRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  onChainSelect: (chainId: number) => void;
}> = ({ initialFocusRef, onClose, onChainSelect }) => {
  const trackEvent = useTrack();
  const connectedChainId = useChainId();
  const switchNetwork = useSwitchChain();
  const actuallyCanAttemptSwitch = !!switchNetwork;

  const chain = useSupportedChain(connectedChainId || -1);

  useEffect(() => {
    trackEvent({
      category: "no-funds",
      action: "popover",
      label: "switch-to-testnet",
    });
  }, [trackEvent]);

  const onSwitchWallet = useCallback(async () => {
    trackEvent({
      category: "no-funds",
      action: "click",
      label: "switch-to-testnet",
    });
    if (actuallyCanAttemptSwitch && chain) {
      await switchNetwork(80001);
    }
    onChainSelect(80001);
    onClose();
  }, [
    chain,
    actuallyCanAttemptSwitch,
    onClose,
    switchNetwork,
    onChainSelect,
    trackEvent,
  ]);

  return (
    <Flex direction="column" gap={4}>
      <Heading size="label.lg">
        <Flex gap={2} align="center">
          <Icon boxSize={6} as={AiOutlineWarning} />
          <span>No funds to deploy</span>
        </Flex>
      </Heading>

      <Text>
        You&apos;re trying to deploy to the{" "}
        <Box as="strong" textTransform="capitalize">
          {chain?.name}
        </Box>{" "}
        network but no funds have been detected.
      </Text>
      <Text>
        You can either get funds on this network or switch to a testnet like
        Mumbai to test your contract.
      </Text>

      <Button
        ref={actuallyCanAttemptSwitch ? initialFocusRef : undefined}
        leftIcon={<Icon as={VscDebugDisconnect} />}
        size="sm"
        onClick={onSwitchWallet}
        // isLoading={network.loading}
        isDisabled={!actuallyCanAttemptSwitch}
        colorScheme="orange"
        textTransform="capitalize"
        noOfLines={1}
      >
        Switch wallet to Mumbai
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

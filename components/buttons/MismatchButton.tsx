import {
  ConnectWallet,
  EcosystemButtonprops,
  useNetworkWithPatchedSwitching,
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
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ChainId,
  useAddress,
  useBalance,
  useChainId,
  useNetworkMismatch,
  useSDK,
  useSDKChainId,
} from "@thirdweb-dev/react";
import {
  useBalance as useSolBalance,
  useSDK as useSolanaSDK,
} from "@thirdweb-dev/react/solana";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useConfiguredChain } from "hooks/chains/configureChains";
import React, { useCallback, useMemo, useRef } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Button, Card, Heading, Text } from "tw-components";

export const MismatchButton = React.forwardRef<
  HTMLButtonElement,
  EcosystemButtonprops
>(
  (
    {
      children,
      isDisabled,
      onClick,
      loadingText,
      type,
      ecosystem = "evm",
      ...props
    },
    ref,
  ) => {
    const address = useAddress();
    const { publicKey } = useWallet();
    const evmBalance = useBalance();
    const solBalance = useSolBalance();
    const solNetwork = useSolanaSDK()?.network;
    const initialFocusRef = useRef<HTMLButtonElement>(null);
    const networksMismatch = useNetworkMismatch() && ecosystem === "evm";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackEvent = useTrack();

    const chainId = useChainId();
    const chainInfo = useConfiguredChain(chainId || -1);

    const networkLabel = chainInfo ? chainInfo.name : `chain-id-${chainId}`;

    if (!address && ecosystem === "evm") {
      return (
        <ConnectWallet
          borderRadius="md"
          colorScheme="primary"
          ecosystem={ecosystem}
          {...props}
        />
      );
    }

    if (!publicKey && ecosystem === "solana") {
      return (
        <ConnectWallet
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
            {...props}
            type={networksMismatch || shouldShowEitherFaucet ? "button" : type}
            loadingText={loadingText}
            onClick={(e) => {
              if (shouldShowEVMFaucet) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: networkLabel,
                });
              } else if (shouldShowSolanaFaucet) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: solNetwork,
                });
              }
              if (networksMismatch || shouldShowEitherFaucet) {
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
                onClose={onClose}
              />
            ) : (
              <NoFundsNotice
                symbol={
                  ecosystem === "solana"
                    ? "SOL"
                    : chainInfo?.nativeCurrency.symbol || ""
                }
                ecosystem={ecosystem}
                label={
                  ecosystem === "solana"
                    ? solNetwork || "unknown_sol_network"
                    : networkLabel
                }
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
  onClose: () => void;
}> = ({ initialFocusRef, onClose }) => {
  const connectedChainId = useChainId();
  const desiredChainId = useSDKChainId();
  const [network, switchNetwork] = useNetworkWithPatchedSwitching();
  const actuallyCanAttemptSwitch = !!switchNetwork;
  const walletConnectedNetworkInfo = useConfiguredChain(connectedChainId || -1);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const chain = useConfiguredChain(desiredChainId || -1);

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId && chain) {
      await switchNetwork(desiredChainId);
    }
    onClose();
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
        isLoading={network.loading}
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
  label: string;
  ecosystem: "solana" | "evm" | "either";
}

const NoFundsNotice: React.FC<NoFundsNoticeProps> = ({
  symbol,
  label,
  ecosystem,
}) => {
  const trackEvent = useTrack();

  const balanceQuery = useBalance();
  const sdk = useSDK();
  const chainId = useChainId();
  const chainInfo = useConfiguredChain(chainId || -1);

  const hasFaucet =
    chainInfo &&
    (chainInfo.chainId === ChainId.Localhost ||
      (chainInfo.faucets && chainInfo.faucets.length > 0));

  const requestFunds = async () => {
    if (ecosystem === "solana") {
      window.open("/faucet/solana", "_blank");
    } else if (sdk && hasFaucet) {
      if (chainInfo.chainId === ChainId.Localhost) {
        await sdk.wallet.requestFunds(10);
        await balanceQuery.refetch();
        trackEvent({
          category: "no-funds",
          action: "click",
          label: "localhost",
        });
      } else if (
        chainInfo &&
        chainInfo.faucets &&
        chainInfo.faucets.length > 0
      ) {
        trackEvent({
          category: "no-funds",
          action: "click",
          label,
          faucet: chainInfo.faucets[0],
        });
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

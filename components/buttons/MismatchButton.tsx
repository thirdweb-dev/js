import { FAUCETS, useWeb3 } from "@3rdweb-sdk/react";
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
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineWarning } from "@react-icons/all-files/ai/AiOutlineWarning";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useAddress,
  useBalance,
  useChainId,
  useNetworkMismatch,
  useSDKChainId,
} from "@thirdweb-dev/react";
import {
  useSDK,
  useBalance as useSolBalance,
} from "@thirdweb-dev/react/solana";
import { BigNumber } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useConfiguredChain } from "hooks/chains/configureChains";
import React, { useCallback, useRef } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Button, Card, Heading, LinkButton, Text } from "tw-components";

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
    const solNetwork = useSDK()?.network;
    const initialFocusRef = useRef<HTMLButtonElement>(null);
    const networksMismatch = useNetworkMismatch() && ecosystem === "evm";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const trackEvent = useTrack();
    const chainId = useChainId();
    const { getNetworkMetadata } = useWeb3();
    const {
      isTestnet,
      symbol,
      chainId: resolvedChainId,
    } = getNetworkMetadata(chainId || 0);

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

    const isSolanaBalanceZero =
      ecosystem === "solana" &&
      BigNumber.from(solBalance.data?.value || 0).eq(0) &&
      solNetwork === "devnet";

    const isEVMBalanceZero =
      ecosystem === "evm" &&
      BigNumber.from(evmBalance.data?.value || 0).eq(0) &&
      isTestnet;

    const isEitherBalanceZero = isSolanaBalanceZero || isEVMBalanceZero;

    return (
      <Popover
        initialFocusRef={initialFocusRef}
        isLazy
        isOpen={isOpen}
        onOpen={networksMismatch || isEitherBalanceZero ? onOpen : undefined}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            {...props}
            type={networksMismatch || isEitherBalanceZero ? "button" : type}
            loadingText={loadingText}
            onClick={(e) => {
              if (isEVMBalanceZero) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: networkLabel,
                });
              } else if (isSolanaBalanceZero) {
                trackEvent({
                  category: "no-funds",
                  action: "popover",
                  label: solNetwork,
                });
              }
              if (networksMismatch || isEitherBalanceZero) {
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
              <NoFundsNotice
                symbol={ecosystem === "solana" ? "SOL" : symbol}
                faucetUrl={
                  ecosystem === "solana"
                    ? "/faucet/solana"
                    : FAUCETS[resolvedChainId]
                }
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

  const chain = useConfiguredChain(desiredChainId || -1);

  const onSwitchWallet = useCallback(async () => {
    if (actuallyCanAttemptSwitch && desiredChainId && chain) {
      await switchNetwork(desiredChainId);
    }
    onClose();
  }, [chain, actuallyCanAttemptSwitch, desiredChainId, onClose, switchNetwork]);

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
      >
        Switch wallet {chain ? `to ${chain.name}` : ""}
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
  faucetUrl?: string;
  symbol: string;
  label: string;
}

const NoFundsNotice: React.FC<NoFundsNoticeProps> = ({
  faucetUrl,
  symbol,
  label,
}) => {
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
        {faucetUrl && " You can get some from the faucet below."}
      </Text>

      {faucetUrl && (
        <LinkButton
          size="sm"
          colorScheme="orange"
          href={faucetUrl}
          isExternal
          onClick={() =>
            trackEvent({
              category: "no-funds",
              action: "click",
              label,
            })
          }
        >
          Get {symbol} from faucet
        </LinkButton>
      )}
    </Flex>
  );
};

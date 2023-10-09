import { MismatchButton } from "./MismatchButton";
import type { ConnectWalletProps } from "@3rdweb-sdk/react/components/connect-wallet";
import {
  Center,
  DarkMode,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";

import {
  useAddress,
  useChainId,
  useInstalledWallets,
  useWallet,
} from "@thirdweb-dev/react";
import { CHAIN_ID_TO_GNOSIS } from "constants/mappings";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiTransferAlt } from "react-icons/bi";
import { FiInfo } from "react-icons/fi";
import { Button, Card, Heading, LinkButton, Text } from "tw-components";

export interface TransactionButtonProps
  extends Omit<ConnectWalletProps, "leftIcon"> {
  transactionCount: number;
  isLoading: boolean;
  isGasless?: boolean;
  upsellTestnet?: boolean;
  onChainSelect?: (chainId: number) => void;
}

// this is in react-package as well
export function useWalletRequiresConfirmation() {
  const activeWallet = useWallet();
  const installedWallets = useInstalledWallets();

  return (
    activeWallet &&
    (activeWallet.walletId === "walletConnectV1" ||
      activeWallet.walletId === "walletConnectV2" ||
      activeWallet.walletId === "Safe" ||
      (activeWallet.walletId === "metamask" && !installedWallets.metamask) ||
      (activeWallet.walletId === "coinbaseWallet" &&
        !installedWallets.coinbaseWallet))
  );
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  children,
  transactionCount,
  isLoading,
  size,
  colorScheme,
  variant,
  isGasless,
  upsellTestnet,
  onChainSelect,
  ...restButtonProps
}) => {
  const colorMode = useColorMode();
  const activeWallet = useWallet();
  const walletRequiresExternalConfirmation = useWalletRequiresConfirmation();
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const ColorModeComp =
    colorMode.colorMode === "dark" ? DarkMode : React.Fragment;

  const numberWidth = useMemo(() => {
    // for each digit of transaction count add 8.3px
    return Math.floor(transactionCount.toString().length * 8.3);
  }, [transactionCount]);

  const evmAddress = useAddress();

  const isConnected = useMemo(() => {
    return !!evmAddress;
  }, [evmAddress]);

  const ButtonComponent = useMemo(() => {
    return isGasless ? Button : MismatchButton;
  }, [isGasless]);

  return (
    <Popover
      returnFocusOnClose={false}
      initialFocusRef={initialFocusRef}
      isLazy
      isOpen={walletRequiresExternalConfirmation && isLoading}
    >
      <PopoverTrigger>
        <ButtonComponent
          upsellTestnet={upsellTestnet}
          onChainSelect={onChainSelect}
          borderRadius="md"
          position="relative"
          role="group"
          colorScheme={colorScheme}
          isLoading={isLoading}
          size={size}
          variant={variant}
          {...restButtonProps}
          overflow="hidden"
          boxSizing="border-box"
          pl={
            isLoading || !isConnected
              ? undefined
              : `calc(${52 + numberWidth}px + var(--chakra-space-${
                  size === "sm" ? 3 : size === "lg" ? 6 : size === "xs" ? 2 : 4
                }))`
          }
        >
          {children}
          <Tooltip
            bg="transparent"
            boxShadow="none"
            p={0}
            w="auto"
            label={
              <ColorModeComp>
                <Card w="auto" py={2} bgColor="backgroundHighlight">
                  <Text>
                    This action will trigger {transactionCount}{" "}
                    {transactionCount > 1 ? "transactions" : "transaction"}.
                  </Text>
                </Card>
              </ColorModeComp>
            }
          >
            <Center
              _groupHover={{
                bg:
                  variant === "solid" || !variant
                    ? `${colorScheme}.800`
                    : `${colorScheme}.200`,
              }}
              transitionProperty="var(--chakra-transition-property-common)"
              transitionDuration="var(--chakra-transition-duration-normal)"
              as="span"
              bg={
                variant === "solid" || !variant
                  ? `${colorScheme}.700`
                  : `${colorScheme}.100`
              }
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              px={size === "sm" ? 3 : size === "lg" ? 6 : size === "xs" ? 2 : 4}
            >
              <Flex
                as="span"
                color="whiteAlpha.900"
                justify="center"
                gap={1}
                align="center"
              >
                <Text color="inherit" size="label.md" fontFamily="mono">
                  {transactionCount}
                </Text>
                <BiTransferAlt />
              </Flex>
            </Center>
          </Tooltip>
        </ButtonComponent>
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
          <ExternalApprovalNotice
            walletId={activeWallet?.walletId}
            initialFocusRef={initialFocusRef}
          />
        </PopoverBody>
      </Card>
    </Popover>
  );
};

interface ExternalApprovalNoticeProps {
  walletId?: string;
  initialFocusRef: React.RefObject<HTMLButtonElement>;
}

export const ExternalApprovalNotice: React.FC<ExternalApprovalNoticeProps> = ({
  walletId,
  initialFocusRef,
}) => {
  const address = useAddress();
  const chainId = useChainId() || -1;

  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setShowHint(true);
    }, 15_000);
    return () => clearTimeout(t);
  }, []);

  if (walletId?.toLowerCase() === "safe") {
    const isChainIdSupported = chainId in CHAIN_ID_TO_GNOSIS;
    return (
      <Flex direction="column" gap={4}>
        <Heading size="label.lg">
          <Flex gap={2} align="center">
            <Icon color="primary.500" boxSize={6} as={FiInfo} />
            <span>Execute Transaction</span>
          </Flex>
        </Heading>
        <Text>
          You will need to execute this transaction in your Safe to continue.
        </Text>

        {showHint && (
          <Text fontStyle="italic" size="body.sm">
            Once you have approved and executed the transaction in your Gnosis
            Safe this action will continue automatically.
          </Text>
        )}

        <LinkButton
          isDisabled={!isChainIdSupported}
          ref={initialFocusRef}
          colorScheme="primary"
          size="sm"
          href={`https://app.safe.global/${
            CHAIN_ID_TO_GNOSIS[chainId as keyof typeof CHAIN_ID_TO_GNOSIS]
          }:${address}/transactions/queue`}
          isExternal
        >
          Go To Safe
        </LinkButton>
      </Flex>
    );
  } else if (walletId === "walletConnect" || walletId === "walletConnectV1") {
    return (
      <Flex direction="column" gap={4}>
        <Heading size="label.lg">
          <Flex gap={2} align="center">
            <Icon color="primary.500" boxSize={6} as={FiInfo} />
            <span>Approve Transaction</span>
          </Flex>
        </Heading>
        <Text>
          You will need to approve this transaction in your connected wallet.
        </Text>

        {showHint && (
          <Text fontStyle="italic" size="body.sm">
            Once you have approved the transaction in your connected wallet this
            action will continue automatically.
          </Text>
        )}
      </Flex>
    );
  }

  return null;
};

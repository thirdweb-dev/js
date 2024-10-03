"use client";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  Center,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { CHAIN_ID_TO_GNOSIS } from "constants/mappings";
import { useActiveChainAsDashboardChain } from "lib/v5-adapter";
import { ArrowLeftRightIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import type { WalletId } from "thirdweb/wallets";
import {
  Button,
  type ButtonProps,
  Card,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { MismatchButton } from "./MismatchButton";

interface TransactionButtonProps extends Omit<ButtonProps, "leftIcon"> {
  transactionCount: number;
  isLoading: boolean;
  isGasless?: boolean;
  upsellTestnet?: boolean;
  txChainID: number;
}

function useWalletRequiresExternalConfirmation() {
  const activeWallet = useActiveWallet();

  return (
    activeWallet &&
    (activeWallet.id === "walletConnect" || activeWallet.id === "global.safe")
  );
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  children,
  transactionCount,
  isLoading: isPending,
  size,
  colorScheme,
  variant,
  isGasless,
  txChainID,
  ...restButtonProps
}) => {
  const activeWallet = useActiveWallet();
  const walletRequiresExternalConfirmation =
    useWalletRequiresExternalConfirmation();
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const chain = useActiveChainAsDashboardChain();
  const isChainDeprecated = useMemo(
    () => chain?.status === "deprecated",
    [chain],
  );

  const numberWidth = useMemo(() => {
    // for each digit of transaction count add 8.3px
    return Math.floor(transactionCount.toString().length * 8.3);
  }, [transactionCount]);

  const address = useActiveAccount()?.address;

  const isConnected = useMemo(() => {
    return !!address;
  }, [address]);

  const ButtonComponent = useMemo(() => {
    return isGasless ? Button : MismatchButton;
  }, [isGasless]);

  return (
    <Popover
      returnFocusOnClose={false}
      initialFocusRef={initialFocusRef}
      isLazy
      isOpen={walletRequiresExternalConfirmation && isPending}
    >
      <PopoverTrigger>
        <ButtonComponent
          desiredChainId={txChainID}
          borderRadius="md"
          position="relative"
          role="group"
          colorScheme={colorScheme}
          isLoading={isPending}
          size={size}
          variant={variant}
          {...restButtonProps}
          overflow="hidden"
          boxSizing="border-box"
          pl={
            isPending || !isConnected
              ? undefined
              : `calc(${52 + numberWidth}px + var(--chakra-space-${
                  size === "sm" ? 3 : size === "lg" ? 6 : size === "xs" ? 2 : 4
                }))`
          }
          isDisabled={isChainDeprecated || restButtonProps.isDisabled}
        >
          {children}
          <ToolTipLabel
            label={
              isChainDeprecated
                ? "This chain is deprecated so you cannot execute transactions on it"
                : `This action will trigger ${transactionCount} ${transactionCount > 1 ? "transactions" : "transaction"}`
            }
          >
            {/* to be completed */}
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
                <ArrowLeftRightIcon className="size-3" />
              </Flex>
            </Center>
          </ToolTipLabel>
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
            walletId={activeWallet?.id}
            initialFocusRef={initialFocusRef}
          />
        </PopoverBody>
      </Card>
    </Popover>
  );
};

interface ExternalApprovalNoticeProps {
  walletId?: WalletId;
  initialFocusRef: React.RefObject<HTMLButtonElement>;
}

const ExternalApprovalNotice: React.FC<ExternalApprovalNoticeProps> = ({
  walletId,
  initialFocusRef,
}) => {
  const address = useActiveAccount()?.address;
  const chainId = useActiveWalletChain()?.id || -1;

  const [showHint, setShowHint] = useState(false);

  // legitimate usecase!
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const t = setTimeout(() => {
      setShowHint(true);
    }, 15_000);
    return () => clearTimeout(t);
  }, []);

  if (walletId === "global.safe") {
    const isChainIdSupported = chainId in CHAIN_ID_TO_GNOSIS;
    return (
      <div className="flex flex-col gap-4">
        <Heading size="label.lg">
          <div className="flex flex-row items-center gap-2">
            <Icon color="primary.500" boxSize={6} as={FiInfo} />
            <span>Execute Transaction</span>
          </div>
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
      </div>
    );
  }
  if (walletId === "walletConnect") {
    return (
      <div className="flex flex-col gap-4">
        <Heading size="label.lg">
          <div className="flex flex-row items-center gap-2">
            <Icon color="primary.500" boxSize={6} as={FiInfo} />
            <span>Approve Transaction</span>
          </div>
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
      </div>
    );
  }

  return null;
};

import { MismatchButton } from "./MismatchButton";
import { EcosystemButtonprops } from "@3rdweb-sdk/react";
import {
  Center,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import { useAccount, useAddress, useChainId } from "@thirdweb-dev/react";
import { CHAIN_ID_TO_GNOSIS } from "constants/mappings";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useDimensions from "react-cool-dimensions";
import { BiTransferAlt } from "react-icons/bi";
import { FiInfo } from "react-icons/fi";
import { Card, Heading, LinkButton, Text } from "tw-components";

export interface TransactionButtonProps
  extends Omit<EcosystemButtonprops, "leftIcon"> {
  transactionCount: number;
  isLoading: boolean;
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  children,
  transactionCount,
  isLoading,
  size,
  colorScheme,
  variant,
  ecosystem,
  ...restButtonProps
}) => {
  const { observe, width } = useDimensions<HTMLSpanElement | null>();
  const [{ data }] = useAccount();
  const connectorRequiresExternalConfirmation = useMemo(() => {
    return (
      data?.connector?.id === "gnosis" ||
      data?.connector?.id === "walletConnect"
    );
  }, [data?.connector?.id]);

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover
      returnFocusOnClose={false}
      initialFocusRef={initialFocusRef}
      isLazy
      isOpen={connectorRequiresExternalConfirmation && isLoading}
    >
      <PopoverTrigger>
        <MismatchButton
          ecosystem={ecosystem}
          borderRadius="md"
          position="relative"
          role="group"
          colorScheme={colorScheme}
          isLoading={isLoading}
          size={size}
          variant={variant}
          {...restButtonProps}
          overflow="hidden"
          pl={
            isLoading
              ? undefined
              : `calc(${width * 2}px + var(--chakra-space-${
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
              <Card w="auto" py={2}>
                <Text>
                  This action will trigger {transactionCount}{" "}
                  {transactionCount > 1 ? "transactions" : "transaction"}.
                </Text>
              </Card>
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
              ref={observe}
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
        </MismatchButton>
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
            connectorId={data?.connector?.id}
            initialFocusRef={initialFocusRef}
          />
        </PopoverBody>
      </Card>
    </Popover>
  );
};

interface ExternalApprovalNoticeProps {
  connectorId?: string;
  initialFocusRef: React.RefObject<HTMLButtonElement>;
}

const ExternalApprovalNotice: React.FC<ExternalApprovalNoticeProps> = ({
  connectorId,
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

  if (connectorId === "gnosis") {
    const isChainIdSupported = chainId in CHAIN_ID_TO_GNOSIS;
    return (
      <Flex direction="column" gap={4}>
        <Heading size="label.lg">
          <Flex gap={2} align="center">
            <Icon color="blue.500" boxSize={6} as={FiInfo} />
            <span>Execute Transaction</span>
          </Flex>
        </Heading>
        <Text>
          You will need to execute this transaction in your Gnosis Safe to
          continue.
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
          href={`https://app.safe.global/app/${
            CHAIN_ID_TO_GNOSIS[chainId as keyof typeof CHAIN_ID_TO_GNOSIS]
          }:${address}/transactions/queue`}
          isExternal
        >
          Go To Gnosis Safe
        </LinkButton>
      </Flex>
    );
  } else if (connectorId === "walletConnect") {
    return (
      <Flex direction="column" gap={4}>
        <Heading size="label.lg">
          <Flex gap={2} align="center">
            <Icon color="blue.500" boxSize={6} as={FiInfo} />
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

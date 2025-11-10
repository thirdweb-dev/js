"use client";
import { useQuery } from "@tanstack/react-query";
import type { Token } from "../../../../../bridge/types/Token.js";
import type { ChainMetadata } from "../../../../../chains/types.js";
import {
  defineChain,
  getCachedChain,
  getChainMetadata,
} from "../../../../../chains/utils.js";
import { shortenHex } from "../../../../../utils/address.js";
import type { WindowAdapter } from "../../../../core/adapters/WindowAdapter.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../../core/hooks/useStepExecutor.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { shorterChainName } from "../../components/ChainName.js";
import { CopyIcon } from "../../components/CopyIcon.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Link, Text } from "../../components/text.js";

interface TransactionInfo {
  type: "paymentId" | "transactionHash";
  id: string;
  label: string;
  chain: ChainMetadata;
  destinationToken?: Token;
  destinationChain?: ChainMetadata;
  originToken?: Token;
  originChain?: ChainMetadata;
  amountPaid?: string;
  amountReceived?: string;
}

function getPaymentId(
  preparedQuote: BridgePrepareResult,
  status: CompletedStatusResult,
) {
  if (preparedQuote.type === "onramp") {
    return preparedQuote.id;
  }
  return status.transactions[status.transactions.length - 1]?.transactionHash;
}

/**
 * Hook to fetch transaction info for a completed status
 */
function useTransactionInfo(
  status: CompletedStatusResult,
  preparedQuote: BridgePrepareResult,
) {
  return useQuery({
    enabled: true,
    queryFn: async (): Promise<TransactionInfo | null> => {
      const isOnramp = status.type === "onramp";

      if (isOnramp && preparedQuote.type === "onramp") {
        // For onramp, create a display ID since OnrampStatus doesn't have paymentId
        return {
          amountPaid: `${preparedQuote.currencyAmount} ${preparedQuote.currency}`,
          amountReceived: `${formatTokenAmount(
            preparedQuote.destinationAmount,
            preparedQuote.destinationToken.decimals,
          )} ${preparedQuote.destinationToken.symbol}`,
          chain: await getChainMetadata(
            defineChain(preparedQuote.destinationToken.chainId),
          ),
          destinationToken: preparedQuote.destinationToken,
          id: preparedQuote.id,
          label: "Onramp Payment",
          type: "paymentId" as const,
        };
      } else if (
        status.type === "buy" ||
        status.type === "sell" ||
        status.type === "transfer"
      ) {
        if (status.transactions.length > 0) {
          // get the last transaction hash
          const tx = status.transactions[status.transactions.length - 1];
          if (tx) {
            const [destinationChain, originChain] = await Promise.all([
              getChainMetadata(getCachedChain(status.destinationToken.chainId)),
              getChainMetadata(getCachedChain(status.originToken.chainId)),
            ]);
            return {
              amountPaid: `${formatTokenAmount(
                status.originAmount,
                status.originToken.decimals,
              )} ${status.originToken.symbol}`,
              amountReceived: `${formatTokenAmount(
                status.destinationAmount,
                status.destinationToken.decimals,
              )} ${status.destinationToken.symbol}`,
              chain: destinationChain,
              destinationChain,
              destinationToken: status.destinationToken,
              id: tx.transactionHash,
              label: "Transaction",
              originChain,
              originToken: status.originToken,
              type: "transactionHash" as const,
            };
          }
        }
      }

      return null;
    },
    queryKey: [
      "transaction-info",
      status.type,
      getPaymentId(preparedQuote, status),
    ],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

interface CompletedStepDetailCardProps {
  status: CompletedStatusResult;
  preparedQuote: BridgePrepareResult;
  windowAdapter: WindowAdapter;
}

/**
 * Component to display details for a completed transaction step
 */
function CompletedStepDetailCard({
  status,
  preparedQuote,
}: CompletedStepDetailCardProps) {
  const theme = useCustomTheme();
  const { data: txInfo, isPending } = useTransactionInfo(status, preparedQuote);

  if (isPending) {
    return <Skeleton height="200px" style={{ borderRadius: radius.lg }} />;
  }

  if (!txInfo) {
    return null;
  }

  return (
    <Container
      flex="column"
      gap="sm"
      key={txInfo.id}
      style={{
        backgroundColor: theme.colors.tertiaryBg,
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: radius.lg,
        padding: spacing.md,
      }}
    >
      {/* Status Badge */}
      <Container
        flex="row"
        gap="sm"
        py="4xs"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="primaryText" size="sm" weight={500}>
          {txInfo.label}
        </Text>
        <Container
          style={{
            backgroundColor: theme.colors.modalBg,
            borderRadius: radius.full,
            border: `1px solid ${theme.colors.borderColor}`,
            padding: `${spacing["3xs"]} ${spacing.xs}`,
          }}
        >
          <Text
            style={{
              color: theme.colors.success,
              fontSize: 10,
              letterSpacing: "0.025em",
            }}
          >
            COMPLETED
          </Text>
        </Container>
      </Container>

      <Line />

      {/* Amount Paid */}
      {txInfo.amountPaid && (
        <Container
          center="y"
          flex="row"
          style={{ justifyContent: "space-between" }}
        >
          <Text color="secondaryText" size="sm">
            Amount Paid
          </Text>
          <Text color="primaryText" size="sm">
            {txInfo.amountPaid}
          </Text>
        </Container>
      )}

      {/* Amount Received */}
      {txInfo.amountReceived && (
        <Container
          center="y"
          flex="row"
          style={{ justifyContent: "space-between" }}
        >
          <Text color="secondaryText" size="sm">
            Amount Received
          </Text>
          <Text color="primaryText" size="sm">
            {txInfo.amountReceived}
          </Text>
        </Container>
      )}

      {/* Origin Chain */}
      {txInfo.originChain && (
        <Container
          center="y"
          flex="row"
          style={{ justifyContent: "space-between" }}
        >
          <Text color="secondaryText" size="sm">
            Origin Chain
          </Text>
          <Text color="primaryText" size="sm">
            {shorterChainName(txInfo.originChain.name)}
          </Text>
        </Container>
      )}

      {/* Destination Chain */}
      <Container
        center="y"
        flex="row"
        style={{ justifyContent: "space-between" }}
      >
        <Text color="secondaryText" size="sm">
          Destination Chain
        </Text>
        <Text color="primaryText" size="sm">
          {shorterChainName(txInfo.chain.name)}
        </Text>
      </Container>

      {/* Transaction Info */}
      {txInfo.type === "paymentId" && (
        <Container
          center="y"
          flex="row"
          style={{ justifyContent: "space-between" }}
        >
          <Text color="secondaryText" size="sm">
            Payment ID
          </Text>
          <Container flex="row" gap="3xs" center="y">
            <CopyIcon text={txInfo.id} iconSize={12} tip="Copy Payment ID" />

            <Text color="primaryText" weight={400} size="sm">
              {shortenHex(txInfo.id)}
            </Text>
          </Container>
        </Container>
      )}

      {status.transactions.map((tx) => {
        const explorerLink = `https://thirdweb.com/${tx.chainId}/tx/${tx.transactionHash}`;
        return (
          <Container
            key={tx.transactionHash}
            center="y"
            flex="row"
            style={{ justifyContent: "space-between" }}
          >
            <Text color="secondaryText" size="sm">
              Transaction Hash
            </Text>
            <Container flex="row" gap="3xs" center="y">
              <CopyIcon
                text={tx.transactionHash}
                iconSize={12}
                tip="Copy Transaction Hash"
              />

              <Link
                href={explorerLink}
                target="_blank"
                rel="noreferrer"
                color="primaryText"
                hoverColor="accentText"
                weight={400}
                size="sm"
              >
                {shortenHex(tx.transactionHash)}
              </Link>
            </Container>
          </Container>
        );
      })}
    </Container>
  );
}

interface PaymentReceitProps {
  /**
   * Prepared quote from Bridge.prepare
   */
  preparedQuote: BridgePrepareResult;

  /**
   * Completed status results from step execution
   */
  completedStatuses: CompletedStatusResult[];

  /**
   * Called when user goes back to success screen
   */
  onBack: () => void;

  /**
   * Window adapter for opening URLs
   */
  windowAdapter: WindowAdapter;
}

export function PaymentReceipt({
  preparedQuote,
  completedStatuses,
  onBack,
  windowAdapter,
}: PaymentReceitProps) {
  return (
    <Container flex="column" fullHeight px="md">
      <Spacer y="md+" />
      <ModalHeader onBack={onBack} title="Payment Receipt" />
      <Spacer y="md+" />

      <Container
        flex="column"
        gap="lg"
        scrollY
        style={{ maxHeight: "500px", minHeight: "400px" }}
      >
        {/* Status Results */}
        <Container flex="column" gap="sm">
          {completedStatuses.map((status, index) => (
            <CompletedStepDetailCard
              key={`${status.type}-${index}`}
              preparedQuote={preparedQuote}
              status={status}
              windowAdapter={windowAdapter}
            />
          ))}
        </Container>
      </Container>
      <Spacer y="md+" />
    </Container>
  );
}

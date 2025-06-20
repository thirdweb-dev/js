"use client";
import { CopyIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Token } from "../../../../../bridge/types/Token.js";
import type { ChainMetadata } from "../../../../../chains/types.js";
import {
  defineChain,
  getCachedChain,
  getChainMetadata,
} from "../../../../../chains/utils.js";
import { shortenHex } from "../../../../../utils/address.js";
import { formatExplorerTxUrl } from "../../../../../utils/url.js";
import type { WindowAdapter } from "../../../../core/adapters/WindowAdapter.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../../core/hooks/useStepExecutor.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { shorterChainName } from "../../components/ChainName.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";

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
  onCopyToClipboard: (text: string) => Promise<void>;
}

/**
 * Component to display details for a completed transaction step
 */
function CompletedStepDetailCard({
  status,
  preparedQuote,
  windowAdapter,
  onCopyToClipboard,
}: CompletedStepDetailCardProps) {
  const theme = useCustomTheme();
  const { data: txInfo, isLoading } = useTransactionInfo(status, preparedQuote);

  if (isLoading) {
    return (
      <Container
        flex="column"
        gap="sm"
        style={{
          backgroundColor: theme.colors.tertiaryBg,
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.sm,
          padding: spacing.md,
        }}
      >
        <Skeleton height="30px" />
        <Skeleton height="30px" />
        <Skeleton height="30px" />
      </Container>
    );
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
        borderRadius: radius.sm,
        padding: spacing.md,
      }}
    >
      {/* Status Badge */}
      <Container
        flex="row"
        gap="sm"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="primaryText" size="sm">
          {txInfo.label}
        </Text>
        <Container
          style={{
            backgroundColor: theme.colors.success,
            borderRadius: radius.sm,
            padding: `${spacing["3xs"]} ${spacing.xs}`,
          }}
        >
          <Text size="xs" style={{ color: theme.colors.primaryButtonText }}>
            COMPLETED
          </Text>
        </Container>
      </Container>

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

      {/* Chain */}
      <Container
        center="y"
        flex="row"
        style={{ justifyContent: "space-between" }}
      >
        <Text color="secondaryText" size="sm">
          Chain
        </Text>
        <Text color="primaryText" size="sm">
          {shorterChainName(txInfo.chain.name)}
        </Text>
      </Container>

      {/* Transaction Info */}
      <Container
        center="y"
        flex="row"
        style={{ justifyContent: "space-between" }}
      >
        <Text color="secondaryText" size="sm">
          {txInfo.type === "paymentId" ? "Payment ID" : "Transaction Hash"}
        </Text>
        <Container flex="row" gap="sm" style={{ alignItems: "center" }}>
          <Text
            color="accentText"
            onClick={
              txInfo.type === "paymentId"
                ? () => onCopyToClipboard(txInfo.id)
                : () => {
                    const explorer = txInfo.chain.explorers?.[0];
                    if (explorer) {
                      windowAdapter.open(
                        formatExplorerTxUrl(explorer.url, txInfo.id),
                      );
                    }
                  }
            }
            size="sm"
            style={{
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            {shortenHex(txInfo.id)}
          </Text>

          {txInfo.type === "paymentId" ? (
            <button
              onClick={() => onCopyToClipboard(txInfo.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              type="button"
            >
              <CopyIcon
                color={theme.colors.primaryText}
                height={iconSize.sm}
                width={iconSize.sm}
              />
            </button>
          ) : null}
        </Container>
      </Container>
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
  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.warn("Failed to copy to clipboard:", error);
    }
  }, []);

  return (
    <Container
      flex="column"
      fullHeight
      p="lg"
      style={{ maxHeight: "500px", minHeight: "250px", overflowY: "auto" }}
    >
      <ModalHeader onBack={onBack} title="Payment Receipt" />

      <Spacer y="lg" />

      <Container flex="column" gap="lg">
        {/* Status Results */}
        <Container flex="column" gap="md">
          <Text color="primaryText" size="md">
            Transactions
          </Text>

          {completedStatuses.map((status, index) => (
            <CompletedStepDetailCard
              key={`${status.type}-${index}`}
              onCopyToClipboard={copyToClipboard}
              preparedQuote={preparedQuote}
              status={status}
              windowAdapter={windowAdapter}
            />
          ))}
        </Container>
      </Container>
    </Container>
  );
}

"use client";
import type { Token } from "../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type Address,
  getAddress,
  shortenAddress,
} from "../../../../utils/address.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { fontSize, spacing } from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { useTransactionDetails } from "../../../core/hooks/useTransactionDetails.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Container, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";
import type { UIOptions } from "./BridgeOrchestrator.js";
import { ChainIcon } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";

export interface TransactionPaymentProps {
  /**
   * UI configuration and mode
   */
  uiOptions: Extract<UIOptions, { mode: "transaction" }>;

  /**
   * ThirdwebClient for blockchain interactions
   */
  client: ThirdwebClient;

  /**
   * Called when user confirms transaction execution
   */
  onContinue: (amount: string, token: Token, receiverAddress: Address) => void;

  /**
   * Connect options for wallet connection
   */
  connectOptions?: PayEmbedConnectOptions;
}

export function TransactionPayment({
  uiOptions,
  client,
  onContinue,
  connectOptions,
}: TransactionPaymentProps) {
  const theme = useCustomTheme();
  const activeAccount = useActiveAccount();

  // Get chain metadata for native currency symbol
  const chainMetadata = useChainMetadata(uiOptions.transaction.chain);

  // Use the extracted hook for transaction details
  const transactionDataQuery = useTransactionDetails({
    transaction: uiOptions.transaction,
    client,
  });

  const contractName =
    transactionDataQuery.data?.contractMetadata?.name || "Unknown Contract";
  const functionName =
    transactionDataQuery.data?.functionInfo?.functionName || "Contract Call";
  const isLoading = transactionDataQuery.isLoading || chainMetadata.isLoading;

  const buttonLabel = `Execute ${functionName}`;

  // Skeleton component for loading state
  const SkeletonRow = ({ width = "100%" }: { width?: string }) => (
    <Container
      flex="row"
      style={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "30%",
          height: "16px",
          backgroundColor: theme.colors.skeletonBg,
          borderRadius: spacing.xs,
        }}
      />
      <div
        style={{
          width,
          height: "16px",
          backgroundColor: theme.colors.skeletonBg,
          borderRadius: spacing.xs,
        }}
      />
    </Container>
  );

  const SkeletonHeader = () => (
    <Container
      flex="row"
      center="y"
      gap="3xs"
      style={{
        justifyContent: "space-between",
      }}
    >
      {/* USD Value Skeleton */}
      <div
        style={{
          width: "80px",
          height: "32px",
          backgroundColor: theme.colors.skeletonBg,
          borderRadius: spacing.xs,
        }}
      />

      {/* Function Name Skeleton */}
      <div
        style={{
          width: "120px",
          height: "24px",
          backgroundColor: theme.colors.skeletonBg,
          borderRadius: spacing.sm,
        }}
      />
    </Container>
  );

  if (isLoading) {
    return (
      <WithHeader
        uiOptions={uiOptions}
        defaultTitle="Transaction"
        client={client}
      >
        {/* Loading Header */}
        <SkeletonHeader />

        <Spacer y="md" />

        <Line />

        <Spacer y="md" />

        {/* Loading Rows */}
        <SkeletonRow width="60%" />
        <Spacer y="xs" />
        <SkeletonRow width="40%" />
        <Spacer y="xs" />
        <SkeletonRow width="50%" />
        <Spacer y="xs" />
        <SkeletonRow width="45%" />
        <Spacer y="xs" />
        <SkeletonRow width="55%" />

        <Spacer y="md" />

        <Line />

        <Spacer y="lg" />

        {/* Loading Button */}
        <div
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: theme.colors.skeletonBg,
            borderRadius: spacing.md,
          }}
        />

        <Spacer y="md" />

        <PoweredByThirdweb />
        <Spacer y="md" />
      </WithHeader>
    );
  }

  return (
    <WithHeader
      uiOptions={uiOptions}
      defaultTitle="Transaction"
      client={client}
    >
      {/* Cost and Function Name section */}
      <Container
        flex="row"
        center="y"
        gap="3xs"
        style={{
          justifyContent: "space-between",
        }}
      >
        {/* USD Value */}
        <Text size="xl" color="primaryText" weight={700}>
          {transactionDataQuery.data?.usdValueDisplay ||
            transactionDataQuery.data?.txCostDisplay}
        </Text>

        {/* Function Name */}
        <Text
          size="md"
          color="secondaryText"
          style={{
            fontFamily: "monospace",
            textAlign: "right",
            backgroundColor: theme.colors.tertiaryBg,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: spacing.sm,
          }}
        >
          {functionName}
        </Text>
      </Container>

      <Spacer y="md" />

      <Line />

      <Spacer y="md" />

      {/* Contract Info */}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="sm" color="secondaryText">
          Contract
        </Text>
        <Text size="sm" color="primaryText">
          {contractName}
        </Text>
      </Container>

      <Spacer y="xs" />

      {/* Address */}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="sm" color="secondaryText">
          Address
        </Text>
        <a
          href={`https://thirdweb.com/${uiOptions.transaction.chain.id}/${uiOptions.transaction.to}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme.colors.accentText,
            textDecoration: "none",
            fontFamily: "monospace",
            fontSize: fontSize.sm,
          }}
        >
          {shortenAddress(uiOptions.transaction.to as string)}
        </a>
      </Container>

      <Spacer y="xs" />

      {/* Network */}
      <Container
        flex="row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="sm" color="secondaryText">
          Network
        </Text>
        <Container flex="row" gap="3xs" center="y">
          <ChainIcon
            chain={uiOptions.transaction.chain}
            size="xs"
            client={client}
          />
          <ChainName
            chain={uiOptions.transaction.chain}
            client={client}
            size="sm"
            color="primaryText"
            short
            style={{
              fontFamily: "monospace",
            }}
          />
        </Container>
      </Container>

      <Spacer y="xs" />

      {/* Cost */}
      {transactionDataQuery.data?.txCostDisplay && (
        <>
          <Container
            flex="row"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="sm" color="secondaryText">
              Cost
            </Text>
            <Text
              size="sm"
              color="primaryText"
              style={{
                fontFamily: "monospace",
              }}
            >
              {transactionDataQuery.data?.txCostDisplay}
            </Text>
          </Container>

          <Spacer y="xs" />
        </>
      )}

      {/* Network Fees */}
      {transactionDataQuery.data?.gasCostDisplay && (
        <>
          <Container
            flex="row"
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="sm" color="secondaryText">
              Network fees
            </Text>
            <Text
              size="sm"
              color="primaryText"
              style={{
                fontFamily: "monospace",
              }}
            >
              {transactionDataQuery.data?.gasCostDisplay}
            </Text>
          </Container>

          <Spacer y="md" />
        </>
      )}

      <Line />

      <Spacer y="lg" />

      {/* Action Button */}
      {activeAccount ? (
        <Button
          variant="primary"
          fullWidth
          onClick={() => {
            if (transactionDataQuery.data?.tokenInfo) {
              onContinue(
                transactionDataQuery.data.totalCost,
                transactionDataQuery.data.tokenInfo,
                getAddress(activeAccount.address),
              );
            }
          }}
          style={{
            padding: `${spacing.sm} ${spacing.md}`,
            fontSize: fontSize.md,
          }}
        >
          {buttonLabel}
        </Button>
      ) : (
        <ConnectButton
          client={client}
          theme={theme}
          connectButton={{
            label: buttonLabel,
          }}
          {...connectOptions}
        />
      )}

      <Spacer y="md" />

      <PoweredByThirdweb />
      <Spacer y="lg" />
    </WithHeader>
  );
}

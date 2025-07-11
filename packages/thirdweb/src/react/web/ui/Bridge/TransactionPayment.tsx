"use client";
import { useQuery } from "@tanstack/react-query";
import type { Token } from "../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import {
  type Address,
  getAddress,
  shortenAddress,
} from "../../../../utils/address.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import { getWalletBalance } from "../../../../wallets/utils/getWalletBalance.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { useTransactionDetails } from "../../../core/hooks/useTransactionDetails.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { Container, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Text } from "../components/text.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
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

  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;
}

export function TransactionPayment({
  uiOptions,
  client,
  onContinue,
  connectOptions,
  showThirdwebBranding = true,
}: TransactionPaymentProps) {
  const theme = useCustomTheme();
  const activeAccount = useActiveAccount();
  const wallet = useActiveWallet();

  // Get chain metadata for native currency symbol
  const chainMetadata = useChainMetadata(uiOptions.transaction.chain);

  // Use the extracted hook for transaction details
  const transactionDataQuery = useTransactionDetails({
    client,
    transaction: uiOptions.transaction,
    wallet,
  });

  // We can't use useWalletBalance here because erc20Value is a possibly async value
  const { data: userBalance } = useQuery({
    enabled: !!activeAccount?.address,
    queryFn: async (): Promise<string> => {
      if (!activeAccount?.address) {
        return "0";
      }
      const erc20Value = await resolvePromisedValue(
        uiOptions.transaction.erc20Value,
      );
      const walletBalance = await getWalletBalance({
        address: activeAccount?.address,
        chain: uiOptions.transaction.chain,
        tokenAddress:
          erc20Value?.tokenAddress.toLowerCase() !== NATIVE_TOKEN_ADDRESS
            ? erc20Value?.tokenAddress
            : undefined,
        client,
      });

      return walletBalance.displayValue;
    },
    queryKey: ["user-balance", activeAccount?.address],
  });

  const contractName =
    transactionDataQuery.data?.contractMetadata?.name || "Unknown Contract";
  const functionName =
    transactionDataQuery.data?.functionInfo?.functionName || "Contract Call";
  const isLoading = transactionDataQuery.isLoading || chainMetadata.isLoading;

  const buttonLabel = `Execute ${functionName}`;

  if (isLoading) {
    return (
      <WithHeader
        client={client}
        defaultTitle="Transaction"
        uiOptions={uiOptions}
      >
        {/* Loading Header */}
        <SkeletonHeader theme={theme} />

        <Spacer y="md" />

        <Line />

        <Spacer y="md" />

        {/* Loading Rows */}
        <SkeletonRow theme={theme} width="60%" />
        <Spacer y="xs" />
        <SkeletonRow theme={theme} width="40%" />
        <Spacer y="xs" />
        <SkeletonRow theme={theme} width="50%" />
        <Spacer y="xs" />
        <SkeletonRow theme={theme} width="45%" />
        <Spacer y="xs" />
        <SkeletonRow theme={theme} width="55%" />

        <Spacer y="md" />

        <Line />

        <Spacer y="lg" />

        {/* Loading Button */}
        <div
          style={{
            backgroundColor: theme.colors.skeletonBg,
            borderRadius: spacing.md,
            height: "48px",
            width: "100%",
          }}
        />

        {showThirdwebBranding ? (
          <div>
            <Spacer y="md" />
            <PoweredByThirdweb />
            <Spacer y="md" />
          </div>
        ) : null}
      </WithHeader>
    );
  }

  return (
    <WithHeader
      client={client}
      defaultTitle="Transaction"
      uiOptions={uiOptions}
    >
      {/* Cost and Function Name section */}
      <Container
        center="y"
        flex="row"
        gap="3xs"
        style={{
          justifyContent: "space-between",
        }}
      >
        {/* USD Value */}
        <Text color="primaryText" size="xl" weight={700}>
          {transactionDataQuery.data?.usdValueDisplay ||
            transactionDataQuery.data?.txCostDisplay}
        </Text>

        {/* Function Name */}
        <Text
          color="secondaryText"
          size="md"
          style={{
            backgroundColor: theme.colors.tertiaryBg,
            borderRadius: spacing.sm,
            fontFamily: "monospace",
            padding: `${spacing.xs} ${spacing.sm}`,
            textAlign: "right",
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
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" size="sm">
          Contract
        </Text>
        <Text color="primaryText" size="sm">
          {contractName}
        </Text>
      </Container>

      <Spacer y="xs" />

      {/* Address */}
      <Container
        flex="row"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" size="sm">
          Address
        </Text>
        <a
          href={`https://thirdweb.com/${uiOptions.transaction.chain.id}/${uiOptions.transaction.to}`}
          rel="noopener noreferrer"
          style={{
            color: theme.colors.accentText,
            fontFamily: "monospace",
            fontSize: fontSize.sm,
            textDecoration: "none",
          }}
          target="_blank"
        >
          {shortenAddress(uiOptions.transaction.to as string)}
        </a>
      </Container>

      <Spacer y="xs" />

      {/* Network */}
      <Container
        flex="row"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text color="secondaryText" size="sm">
          Network
        </Text>
        <Container center="y" flex="row" gap="3xs">
          <ChainIcon
            chain={uiOptions.transaction.chain}
            client={client}
            size="xs"
          />
          <ChainName
            chain={uiOptions.transaction.chain}
            client={client}
            color="primaryText"
            short
            size="sm"
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
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text color="secondaryText" size="sm">
              Cost
            </Text>
            <Text
              color="primaryText"
              size="sm"
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
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text color="secondaryText" size="sm">
              Network fees
            </Text>
            <Text
              color="primaryText"
              size="sm"
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
          fullWidth
          onClick={() => {
            if (transactionDataQuery.data?.tokenInfo) {
              onContinue(
                Math.max(
                  0,
                  Number(transactionDataQuery.data.totalCost) -
                    Number(userBalance ?? "0"),
                ).toString(),
                transactionDataQuery.data.tokenInfo,
                getAddress(activeAccount.address),
              );
            }
          }}
          style={{
            fontSize: fontSize.md,
            padding: `${spacing.sm} ${spacing.md}`,
          }}
          variant="primary"
        >
          {buttonLabel}
        </Button>
      ) : (
        <ConnectButton
          client={client}
          connectButton={{
            label: buttonLabel,
          }}
          theme={theme}
          {...connectOptions}
        />
      )}

      {showThirdwebBranding ? (
        <div>
          <Spacer y="md" />
          <PoweredByThirdweb />
        </div>
      ) : null}
      <Spacer y="lg" />
    </WithHeader>
  );
}

const SkeletonHeader = (props: { theme: Theme }) => (
  <Container
    center="y"
    flex="row"
    gap="3xs"
    style={{
      justifyContent: "space-between",
    }}
  >
    {/* USD Value Skeleton */}
    <div
      style={{
        backgroundColor: props.theme.colors.skeletonBg,
        borderRadius: spacing.xs,
        height: "32px",
        width: "80px",
      }}
    />

    {/* Function Name Skeleton */}
    <div
      style={{
        backgroundColor: props.theme.colors.skeletonBg,
        borderRadius: spacing.sm,
        height: "24px",
        width: "120px",
      }}
    />
  </Container>
);

// Skeleton component for loading state
const SkeletonRow = ({
  width = "100%",
  theme,
}: {
  width?: string;
  theme: Theme;
}) => (
  <Container
    flex="row"
    style={{
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <div
      style={{
        backgroundColor: theme.colors.skeletonBg,
        borderRadius: spacing.xs,
        height: "16px",
        width: "30%",
      }}
    />
    <div
      style={{
        backgroundColor: theme.colors.skeletonBg,
        borderRadius: spacing.xs,
        height: "16px",
        width,
      }}
    />
  </Container>
);

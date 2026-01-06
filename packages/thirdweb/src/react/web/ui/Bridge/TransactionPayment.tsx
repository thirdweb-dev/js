"use client";
import { useQuery } from "@tanstack/react-query";
import type { TokenWithPrices } from "../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import type { SupportedFiatCurrency } from "../../../../pay/convert/type.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import {
  type Address,
  getAddress,
  shortenAddress,
} from "../../../../utils/address.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import { getDefaultWalletsForBridgeComponents } from "../../../../wallets/defaultWallets.js";
import { getWalletBalance } from "../../../../wallets/utils/getWalletBalance.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
  type Theme,
} from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { useTransactionDetails } from "../../../core/hooks/useTransactionDetails.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import { formatCurrencyAmount } from "../ConnectWallet/screens/formatTokenBalance.js";
import { Container, Line } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { ChainName } from "../components/ChainName.js";
import { Skeleton } from "../components/Skeleton.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Text } from "../components/text.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { ChainIcon } from "./common/TokenAndChain.js";
import { WithHeader } from "./common/WithHeader.js";

type TransactionPaymentProps = {
  /**
   * UI configuration and mode
   */
  transaction: PreparedTransaction;
  currency: SupportedFiatCurrency;
  buttonLabel: string | undefined;
  metadata: {
    title: string | undefined;
    description: string | undefined;
    image: string | undefined;
  };

  /**
   * ThirdwebClient for blockchain interactions
   */
  client: ThirdwebClient;

  /**
   * Called when user confirms transaction execution
   */
  onContinue: (
    amount: string,
    token: TokenWithPrices,
    receiverAddress: Address,
  ) => void;

  /**
   * Request to execute the transaction immediately (skips funding flow)
   */
  onExecuteTransaction: () => void;

  /**
   * Connect options for wallet connection
   */
  connectOptions?: PayEmbedConnectOptions;

  /**
   * Whether to show thirdweb branding in the widget.
   * @default true
   */
  showThirdwebBranding?: boolean;
};

export function TransactionPayment({
  transaction,
  client,
  onContinue,
  onExecuteTransaction,
  connectOptions,
  currency,
  showThirdwebBranding = true,
  buttonLabel: _buttonLabel,
  metadata,
}: TransactionPaymentProps) {
  const theme = useCustomTheme();
  const activeAccount = useActiveAccount();
  const wallet = useActiveWallet();

  // Get chain metadata for native currency symbol
  const chainMetadata = useChainMetadata(transaction.chain);

  // Use the extracted hook for transaction details
  const transactionDataQuery = useTransactionDetails({
    client,
    transaction: transaction,
    wallet,
  });

  // We can't use useWalletBalance here because erc20Value is a possibly async value
  const { data: userBalance } = useQuery({
    enabled: !!activeAccount?.address,
    queryFn: async (): Promise<string> => {
      if (!activeAccount?.address) {
        return "0";
      }
      const erc20Value = await resolvePromisedValue(transaction.erc20Value);
      const walletBalance = await getWalletBalance({
        address: activeAccount?.address,
        chain: transaction.chain,
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

  const buttonLabel = _buttonLabel || `Execute ${functionName}`;

  const tokenFiatPricePerToken =
    transactionDataQuery.data?.tokenInfo?.prices[currency] || undefined;

  const totalFiatCost =
    tokenFiatPricePerToken && transactionDataQuery.data
      ? tokenFiatPricePerToken * Number(transactionDataQuery.data.totalCost)
      : undefined;

  const costToDisplay =
    totalFiatCost !== undefined
      ? formatCurrencyAmount(currency, totalFiatCost)
      : transactionDataQuery.data?.txCostDisplay;

  if (isLoading) {
    return (
      <WithHeader
        client={client}
        title={metadata.title || "Transaction"}
        description={metadata.description}
        image={metadata.image}
      >
        {/* Loading Header */}
        <SkeletonHeader theme={theme} />

        <Spacer y="md" />

        <Line dashed />

        <Spacer y="lg" />

        {/* Loading Rows */}
        <Container flex="column" gap="sm">
          <SkeletonRow valueWidth="110px" labelWidth="60px" />
          <SkeletonRow valueWidth="40%" labelWidth="90px" />
          <SkeletonRow valueWidth="50%" labelWidth="60px" />
          <SkeletonRow valueWidth="45%" labelWidth="90px" />
        </Container>

        <Spacer y="lg" />

        <Line dashed />

        <Spacer y="lg" />

        {/* Loading Button */}
        <Button
          fullWidth
          variant="primary"
          gap="xs"
          disabled
          style={{ borderRadius: radius.full, fontSize: fontSize.md }}
        >
          <Spinner size="sm" /> Loading
        </Button>

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
      title={metadata.title || "Transaction"}
      description={metadata.description}
      image={metadata.image}
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
        <Text color="primaryText" size="xl" weight={500}>
          {costToDisplay}
        </Text>

        {/* Function Name */}
        <Text
          color="secondaryText"
          size="sm"
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

      <Line dashed />

      <Spacer y="lg" />

      <Container flex="column" gap="sm">
        {/* Contract Info */}
        {contractName !== "UnknownContract" &&
          contractName !== undefined &&
          contractName !== "Unknown Contract" && (
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
          )}

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
            href={`https://thirdweb.com/${transaction.chain.id}/${transaction.to}`}
            rel="noopener noreferrer"
            style={{
              color: theme.colors.accentText,
              fontFamily: "monospace",
              fontSize: fontSize.sm,
              textDecoration: "none",
            }}
            target="_blank"
          >
            {shortenAddress(transaction.to as string)}
          </a>
        </Container>

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
            <ChainIcon chain={transaction.chain} client={client} size="xs" />
            <ChainName
              chain={transaction.chain}
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

        {/* Cost */}
        {transactionDataQuery.data?.txCostDisplay && (
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
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "60%",
              }}
            >
              {transactionDataQuery.data?.txCostDisplay}
            </Text>
          </Container>
        )}

        {/* Network Fees */}
        {transactionDataQuery.data?.gasCostDisplay && (
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
        )}
      </Container>

      <Spacer y="lg" />

      <Line dashed />

      <Spacer y="lg" />

      {/* Action Button */}
      {activeAccount ? (
        <Button
          fullWidth
          onClick={() => {
            if (transactionDataQuery.data?.tokenInfo) {
              if (
                userBalance &&
                Number(userBalance) <
                  Number(transactionDataQuery.data.totalCost)
              ) {
                // if user has funds, but not enough, we need to fund the wallet with the difference
                onContinue(
                  (
                    Number(transactionDataQuery.data.totalCost) -
                    Number(userBalance)
                  ).toString(),
                  transactionDataQuery.data.tokenInfo,
                  getAddress(activeAccount.address),
                );
                return;
              }

              // If the user has enough to pay, skip the payment step altogether
              if (
                userBalance &&
                Number(userBalance) >=
                  Number(transactionDataQuery.data.totalCost)
              ) {
                onExecuteTransaction();
                return;
              }

              // otherwise, use the full transaction cost
              onContinue(
                transactionDataQuery.data.totalCost,
                transactionDataQuery.data.tokenInfo,
                getAddress(activeAccount.address),
              );
            } else {
              // if token not supported, can't go into buy flow, so skip to execute transaction
              onExecuteTransaction();
            }
          }}
          style={{
            fontSize: fontSize.md,
            borderRadius: radius.full,
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
            style: {
              borderRadius: radius.full,
            },
          }}
          theme={theme}
          {...connectOptions}
          wallets={
            connectOptions?.wallets ||
            getDefaultWalletsForBridgeComponents({
              appMetadata: connectOptions?.appMetadata,
              chains: connectOptions?.chains,
            })
          }
        />
      )}

      {showThirdwebBranding ? (
        <div>
          <Spacer y="md" />
          <PoweredByThirdweb />
        </div>
      ) : null}
      <Spacer y="md" />
    </WithHeader>
  );
}

const SkeletonHeader = (_props: { theme: Theme }) => (
  <Container
    center="y"
    flex="row"
    gap="sm"
    style={{
      justifyContent: "space-between",
    }}
  >
    <Skeleton
      height="32px"
      width="60px"
      style={{ borderRadius: radius.full }}
    />
    <Skeleton
      height="32px"
      width="180px"
      style={{ borderRadius: radius.full }}
    />
  </Container>
);

function SkeletonRow(props: { labelWidth?: string; valueWidth?: string }) {
  return (
    <Container
      flex="row"
      style={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Skeleton height="16px" width={props.labelWidth} />
      <Skeleton height="16px" width={props.valueWidth} />
    </Container>
  );
}

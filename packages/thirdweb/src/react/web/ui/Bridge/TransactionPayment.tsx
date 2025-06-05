"use client";
import { useQuery } from "@tanstack/react-query";
import type { AbiFunction } from "abitype";
import { toFunctionSelector } from "viem";
import type { Token } from "../../../../bridge/index.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../constants/addresses.js";
import { getCompilerMetadata } from "../../../../contract/actions/get-compiler-metadata.js";
import { getContract } from "../../../../contract/contract.js";
import { decimals } from "../../../../extensions/erc20/read/decimals.js";
import { getToken } from "../../../../pay/convert/get-token.js";
import { encode } from "../../../../transaction/actions/encode.js";
import type { PreparedTransaction } from "../../../../transaction/prepare-transaction.js";
import { getTransactionGasCost } from "../../../../transaction/utils.js";
import {
  type Address,
  getAddress,
  shortenAddress,
} from "../../../../utils/address.js";
import { resolvePromisedValue } from "../../../../utils/promise/resolve-promised-value.js";
import { toTokens } from "../../../../utils/units.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { fontSize, spacing } from "../../../core/design-system/index.js";
import { useChainMetadata } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { ConnectButton } from "../ConnectWallet/ConnectButton.js";
import { PoweredByThirdweb } from "../ConnectWallet/PoweredByTW.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../ConnectWallet/screens/formatTokenBalance.js";
import type { PayEmbedConnectOptions } from "../PayEmbed.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Container, Line, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";
import { ChainIcon } from "./common/TokenAndChain.js";

export interface TransactionPaymentProps {
  /**
   * The prepared transaction to execute
   */
  transaction: PreparedTransaction;

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
  transaction,
  client,
  onContinue,
  connectOptions,
}: TransactionPaymentProps) {
  const theme = useCustomTheme();
  const activeAccount = useActiveAccount();

  // Get chain metadata for native currency symbol
  const chainMetadata = useChainMetadata(transaction.chain);

  // Combined query that fetches everything in parallel
  const transactionDataQuery = useQuery({
    queryKey: [
      "transaction-data",
      transaction.to,
      transaction.chain.id,
      transaction.erc20Value,
    ],
    queryFn: async () => {
      // Create contract instance for metadata fetching
      const contract = getContract({
        client,
        chain: transaction.chain,
        address: transaction.to as string,
      });
      const [contractMetadata, value, erc20Value, transactionData] =
        await Promise.all([
          getCompilerMetadata(contract).catch(() => null),
          resolvePromisedValue(transaction.value),
          resolvePromisedValue(transaction.erc20Value),
          encode(transaction).catch(() => "0x"),
        ]);

      const [tokenInfo, gasCostWei] = await Promise.all([
        getToken(
          client,
          erc20Value ? erc20Value.tokenAddress : NATIVE_TOKEN_ADDRESS,
          transaction.chain.id,
        ).catch(() => null),
        getTransactionGasCost(transaction).catch(() => null),
      ]);

      // Process function info from ABI if available
      let functionInfo = {
        functionName: "Contract Call",
        selector: "0x",
        description: undefined,
      };

      if (contractMetadata?.abi && transactionData.length >= 10) {
        try {
          const selector = transactionData.slice(0, 10) as `0x${string}`;
          const abi = contractMetadata.abi;

          // Find matching function in ABI
          const abiItems = Array.isArray(abi) ? abi : [];
          const functions = abiItems
            .filter(
              (item) =>
                item &&
                typeof item === "object" &&
                "type" in item &&
                (item as { type: string }).type === "function",
            )
            .map((item) => item as AbiFunction);

          const matchingFunction = functions.find((fn) => {
            return toFunctionSelector(fn) === selector;
          });

          if (matchingFunction) {
            functionInfo = {
              functionName: matchingFunction.name,
              selector,
              description: undefined, // Skip devdoc for now
            };
          }
        } catch {
          // Keep default values
        }
      }

      const resolveDecimals = async () => {
        if (tokenInfo) {
          return tokenInfo.decimals;
        }
        if (erc20Value) {
          return decimals({
            contract: getContract({
              client,
              chain: transaction.chain,
              address: erc20Value.tokenAddress,
            }),
          });
        }
        return 18;
      };

      const decimal = await resolveDecimals();
      const costWei = erc20Value ? erc20Value.amountWei : value || 0n;
      const nativeTokenSymbol =
        chainMetadata.data?.nativeCurrency?.symbol || "ETH";
      const tokenSymbol = tokenInfo?.symbol || nativeTokenSymbol;

      const totalCostWei = erc20Value
        ? erc20Value.amountWei
        : (value || 0n) + (gasCostWei || 0n);
      const totalCost = toTokens(totalCostWei, decimal);

      const usdValue = tokenInfo?.priceUsd
        ? Number(totalCost) * tokenInfo.priceUsd
        : null;

      return {
        contractMetadata,
        functionInfo,
        usdValueDisplay: usdValue
          ? formatCurrencyAmount("USD", usdValue)
          : null,
        txCostDisplay: `${formatTokenAmount(costWei, decimal)} ${tokenSymbol}`,
        gasCostDisplay: gasCostWei
          ? `${formatTokenAmount(gasCostWei, 18)} ${nativeTokenSymbol}`
          : null,
        tokenInfo,
        costWei,
        gasCostWei,
        totalCost,
        totalCostWei,
      };
    },
    enabled: !!transaction.to && !!chainMetadata.data,
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
      <Container flex="column">
        <Container flex="column" px="lg">
          <Spacer y="lg" />

          <ModalHeader title="Transaction" leftAligned />

          <Spacer y="lg" />

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
        </Container>
      </Container>
    );
  }

  return (
    <Container flex="column">
      <Container flex="column" px="lg">
        <Spacer y="lg" />

        <ModalHeader title="Transaction" leftAligned />

        <Spacer y="lg" />

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
            href={`https://thirdweb.com/${transaction.chain.id}/${transaction.to}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.colors.accentText,
              textDecoration: "none",
              fontFamily: "monospace",
              fontSize: fontSize.sm,
            }}
          >
            {shortenAddress(transaction.to as string)}
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
            <ChainIcon chain={transaction.chain} size="xs" client={client} />
            <ChainName
              chain={transaction.chain}
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
      </Container>
    </Container>
  );
}

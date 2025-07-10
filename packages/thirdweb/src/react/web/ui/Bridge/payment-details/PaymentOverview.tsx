import type { Token } from "../../../../../bridge/index.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import { useTransactionDetails } from "../../../../core/hooks/useTransactionDetails.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import { getFiatCurrencyIcon } from "../../ConnectWallet/screens/Buy/fiat/currencies.js";
import { FiatValue } from "../../ConnectWallet/screens/Buy/swap/FiatValue.js";
import { StepConnectorArrow } from "../../ConnectWallet/screens/Buy/swap/StepConnector.js";
import { WalletRow } from "../../ConnectWallet/screens/Buy/swap/WalletRow.js";
import { Container } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import type { UIOptions } from "../BridgeOrchestrator.js";
import { TokenBalanceRow } from "../common/TokenBalanceRow.js";

export function PaymentOverview(props: {
  uiOptions: UIOptions;
  receiver: string;
  sender?: string;
  client: ThirdwebClient;
  paymentMethod: PaymentMethod;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}) {
  const theme = useCustomTheme();
  const sender =
    props.sender ||
    (props.paymentMethod.type === "wallet"
      ? props.paymentMethod.payerWallet.getAccount()?.address
      : undefined);
  const isDifferentRecipient =
    props.receiver.toLowerCase() !== sender?.toLowerCase();
  return (
    <Container>
      {/* Sell */}
      <Container
        bg="tertiaryBg"
        flex="column"
        style={{
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.lg,
        }}
      >
        {sender && (
          <Container
            flex="row"
            gap="sm"
            px="md"
            py="sm"
            style={{
              borderBottom: `1px solid ${theme.colors.borderColor}`,
            }}
          >
            <WalletRow
              address={sender}
              client={props.client}
              iconSize="md"
              textSize="sm"
            />
          </Container>
        )}
        {props.paymentMethod.type === "wallet" && (
          <TokenBalanceRow
            currency={props.uiOptions.currency}
            amount={props.fromAmount}
            client={props.client}
            onClick={() => {}}
            style={{
              background: "transparent",
              border: "none",
              borderRadius: 0,
            }}
            token={props.paymentMethod.originToken}
          />
        )}
        {props.paymentMethod.type === "fiat" && (
          <Container
            center="y"
            flex="row"
            gap="sm"
            px="md"
            py="sm"
            style={{ justifyContent: "space-between" }}
          >
            <Container center="y" flex="row" gap="sm">
              {getFiatCurrencyIcon({
                currency: props.paymentMethod.currency,
                size: "lg",
              })}
              <Container center="y" flex="column" gap="3xs">
                <Text color="primaryText" size="sm" style={{ fontWeight: 600 }}>
                  {props.paymentMethod.currency}
                </Text>
                <Text color="secondaryText" size="xs">
                  {props.paymentMethod.onramp.charAt(0).toUpperCase() +
                    props.paymentMethod.onramp.slice(1)}
                </Text>
              </Container>
            </Container>
            <Text color="primaryText" size="sm" style={{ fontWeight: 600 }}>
              {props.fromAmount}
            </Text>
          </Container>
        )}
      </Container>
      {/* Connector Icon */}
      <StepConnectorArrow />
      {/* Buy */}
      <Container
        bg="tertiaryBg"
        flex="column"
        style={{
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: radius.lg,
        }}
      >
        {isDifferentRecipient && (
          <Container
            flex="row"
            gap="sm"
            px="md"
            py="sm"
            style={{
              borderBottom: `1px solid ${theme.colors.borderColor}`,
            }}
          >
            <WalletRow
              address={props.receiver}
              client={props.client}
              iconSize="md"
              textSize="sm"
            />
          </Container>
        )}
        {props.uiOptions.mode === "direct_payment" && (
          <Container
            center="y"
            flex="row"
            gap="sm"
            p="md"
            style={{ justifyContent: "space-between" }}
          >
            <Container center="y" flex="column" gap="3xs" style={{ flex: 1 }}>
              <Text color="primaryText" size="sm" style={{ fontWeight: 600 }}>
                {props.uiOptions.metadata?.title || "Payment"}
              </Text>
              {props.uiOptions.metadata?.description && (
                <Text color="secondaryText" size="xs">
                  {props.uiOptions.metadata.description}
                </Text>
              )}
            </Container>
            <Container
              center="y"
              flex="column"
              gap="3xs"
              style={{ alignItems: "flex-end" }}
            >
              <FiatValue
                currency={props.uiOptions.currency}
                chain={defineChain(props.toToken.chainId)}
                client={props.client}
                color="primaryText"
                size="sm"
                token={props.toToken}
                tokenAmount={props.uiOptions.paymentInfo.amount}
                weight={600}
              />
              <Text color="secondaryText" size="xs">
                {props.uiOptions.paymentInfo.amount} {props.toToken.symbol}
              </Text>
            </Container>
          </Container>
        )}
        {props.uiOptions.mode === "fund_wallet" && (
          <TokenBalanceRow
            currency={props.uiOptions.currency}
            amount={props.toAmount}
            client={props.client}
            onClick={() => {}}
            style={{
              background: "transparent",
              border: "none",
              borderRadius: 0,
            }}
            token={props.toToken}
          />
        )}
        {props.uiOptions.mode === "transaction" && (
          <TransactionOverViewCompact
            client={props.client}
            paymentMethod={props.paymentMethod}
            uiOptions={props.uiOptions}
          />
        )}
      </Container>
    </Container>
  );
}

const TransactionOverViewCompact = (props: {
  uiOptions: Extract<UIOptions, { mode: "transaction" }>;
  paymentMethod: PaymentMethod;
  client: ThirdwebClient;
}) => {
  const theme = useCustomTheme();
  const txInfo = useTransactionDetails({
    client: props.client,
    transaction: props.uiOptions.transaction,
    wallet: props.paymentMethod.payerWallet,
  });

  if (!txInfo.data) {
    // Skeleton loading state
    return (
      <Container
        center="y"
        flex="row"
        gap="sm"
        p="md"
        style={{ justifyContent: "space-between" }}
      >
        <Container center="y" flex="column" gap="3xs" style={{ flex: 1 }}>
          {/* Title skeleton */}
          <div
            style={{
              backgroundColor: theme.colors.skeletonBg,
              borderRadius: spacing.xs,
              height: "16px",
              width: "120px",
            }}
          />
          {/* Description skeleton - only if metadata exists */}
          {props.uiOptions.metadata?.description && (
            <div
              style={{
                backgroundColor: theme.colors.skeletonBg,
                borderRadius: spacing.xs,
                height: "12px",
                width: "80px",
              }}
            />
          )}
        </Container>
        <Container
          center="y"
          flex="column"
          gap="3xs"
          style={{ alignItems: "flex-end" }}
        >
          {/* Function name skeleton */}
          <div
            style={{
              backgroundColor: theme.colors.skeletonBg,
              borderRadius: spacing.sm,
              height: "24px",
              width: "100px",
            }}
          />
        </Container>
      </Container>
    );
  }

  return (
    <Container
      center="y"
      flex="row"
      gap="sm"
      p="md"
      style={{ justifyContent: "space-between" }}
    >
      <Container center="y" flex="column" gap="3xs" style={{ flex: 1 }}>
        <Text color="primaryText" size="sm" style={{ fontWeight: 600 }}>
          {props.uiOptions.metadata?.title || "Transaction"}
        </Text>
        {props.uiOptions.metadata?.description && (
          <Text color="secondaryText" size="xs">
            {props.uiOptions.metadata.description}
          </Text>
        )}
      </Container>
      <Container
        center="y"
        flex="column"
        gap="3xs"
        style={{ alignItems: "flex-end" }}
      >
        <Text
          color="secondaryText"
          size="xs"
          style={{
            backgroundColor: theme.colors.secondaryButtonBg,
            borderRadius: spacing.sm,
            fontFamily: "monospace",
            padding: `${spacing.xs} ${spacing.sm}`,
            textAlign: "right",
          }}
        >
          {txInfo.data.functionInfo.functionName}
        </Text>
      </Container>
    </Container>
  );
};

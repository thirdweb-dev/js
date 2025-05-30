"use client";
import type { Token } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import { useBridgeQuote } from "../../../../core/hooks/useBridgeQuote.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { TokenAndChain } from "../TokenAndChain.js";

export interface TokenSelectionProps {
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  destinationToken: Token;
  destinationAmount: string;
}

// Individual payment method token row component
interface PaymentMethodTokenRowProps {
  paymentMethod: PaymentMethod & { type: "wallet" };
  destinationToken: Token;
  destinationAmount: string;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
}

function PaymentMethodTokenRow({
  paymentMethod,
  destinationToken,
  destinationAmount,
  client,
  onPaymentMethodSelected,
}: PaymentMethodTokenRowProps) {
  const theme = useCustomTheme();

  // Fetch individual quote for this specific token pair
  const {
    data: quote,
    isLoading: quoteLoading,
    error: quoteError,
  } = useBridgeQuote({
    originToken: paymentMethod.originToken,
    destinationToken,
    destinationAmount,
    client,
  });

  // Use the fetched originAmount if available, otherwise fall back to the one from paymentMethod
  const displayOriginAmount = quote?.originAmount;
  const hasEnoughBalance = displayOriginAmount
    ? paymentMethod.balance >= displayOriginAmount
    : false;

  return (
    <Button
      key={`${paymentMethod.originToken.address}-${paymentMethod.originToken.chainId}`}
      variant="secondary"
      fullWidth
      onClick={() => onPaymentMethodSelected(paymentMethod)}
      disabled={!hasEnoughBalance}
      style={{
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: radius.md,
        padding: `${spacing.sm} ${spacing.md}`,
        backgroundColor: theme.colors.tertiaryBg,
        opacity: hasEnoughBalance ? 1 : 0.5,
        textAlign: "left",
      }}
    >
      <Container
        flex="row"
        gap="md"
        style={{ width: "100%", alignItems: "center" }}
      >
        <TokenAndChain
          token={paymentMethod.originToken}
          client={client}
          size="lg"
          style={{
            maxWidth: "50%",
          }}
        />
        <Container
          flex="column"
          gap="3xs"
          style={{ flex: 1, alignItems: "flex-end" }}
        >
          {quoteLoading ? (
            <Skeleton width="80px" height="16px" />
          ) : quoteError ? (
            <Text size="sm" color="danger" style={{ fontWeight: 600 }}>
              Quote failed
            </Text>
          ) : displayOriginAmount ? (
            <Text
              size="sm"
              color="primaryText"
              style={{ fontWeight: 600, textWrap: "nowrap" }}
            >
              {formatTokenAmount(
                displayOriginAmount,
                paymentMethod.originToken.decimals,
              )}{" "}
              {paymentMethod.originToken.symbol}
            </Text>
          ) : (
            "--.--"
          )}
          <Container flex="row" gap="3xs">
            <Text size="xs" color="secondaryText">
              Balance:{" "}
            </Text>
            <Text
              size="xs"
              color={
                !quoteLoading
                  ? hasEnoughBalance
                    ? "success"
                    : "danger"
                  : "secondaryText"
              }
            >
              {formatTokenAmount(
                paymentMethod.balance,
                paymentMethod.originToken.decimals,
              )}
            </Text>
          </Container>
        </Container>
      </Container>
    </Button>
  );
}

export function TokenSelection({
  paymentMethods,
  paymentMethodsLoading,
  client,
  onPaymentMethodSelected,
  onBack,
  destinationToken,
  destinationAmount,
}: TokenSelectionProps) {
  if (paymentMethodsLoading) {
    return (
      <>
        <Text size="md" color="primaryText">
          Loading your tokens
        </Text>
        <Spacer y="sm" />
        <Container flex="column" gap="sm">
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </Container>
      </>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <Container flex="column" center="both" style={{ minHeight: "250px" }}>
        <Text size="md" color="primaryText" center>
          No available tokens found for this wallet
        </Text>
        <Spacer y="sm" />
        <Text size="sm" color="secondaryText" center>
          Try connecting a different wallet or pay with card
        </Text>
        <Spacer y="lg" />
        <Button variant="primary" onClick={onBack}>
          Select another payment method
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Text size="md" color="primaryText">
        Select payment token
      </Text>
      <Spacer y="sm" />
      <Container
        flex="column"
        gap="sm"
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {paymentMethods
          .filter((method) => method.type === "wallet")
          .map((method) => (
            <PaymentMethodTokenRow
              key={`${method.originToken.address}-${method.originToken.chainId}`}
              paymentMethod={method}
              destinationToken={destinationToken}
              destinationAmount={destinationAmount}
              client={client}
              onPaymentMethodSelected={onPaymentMethodSelected}
            />
          ))}
      </Container>
    </>
  );
}

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
import { TokenAndChain } from "../common/TokenAndChain.js";

export interface TokenSelectionProps {
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  destinationToken: Token;
  destinationAmount: bigint;
}

// Individual payment method token row component
interface PaymentMethodTokenRowProps {
  paymentMethod: PaymentMethod & { type: "wallet" };
  destinationToken: Token;
  destinationAmount: bigint;
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
            <>
              {/* Price amount skeleton */}
              <Skeleton width="80px" height="16px" />
              {/* Balance skeleton */}
              <Container flex="row" gap="3xs">
                <Skeleton width="50px" height="12px" />
                <Skeleton width="40px" height="12px" />
              </Container>
            </>
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
          {!quoteLoading && (
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
          )}
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
  const theme = useCustomTheme();

  if (paymentMethodsLoading) {
    return (
      <>
        <Text size="md" color="primaryText">
          Loading your tokens
        </Text>
        <Spacer y="sm" />
        <Container flex="column" gap="sm">
          {/* Skeleton rows matching PaymentMethodTokenRow structure */}
          {[1, 2, 3].map((i) => (
            <Container
              key={i}
              style={{
                border: `1px solid ${theme.colors.borderColor}`,
                borderRadius: radius.md,
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: theme.colors.tertiaryBg,
              }}
            >
              <Container
                flex="row"
                gap="md"
                style={{ width: "100%", alignItems: "center" }}
              >
                {/* Left side: Token icon and name skeleton */}
                <Container
                  flex="row"
                  gap="sm"
                  center="y"
                  style={{ maxWidth: "50%" }}
                >
                  {/* Token icon skeleton */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: theme.colors.skeletonBg,
                      borderRadius: "50%",
                    }}
                  />
                  <Container flex="column" gap="3xs">
                    {/* Token name skeleton */}
                    <Skeleton width="60px" height="14px" />
                    {/* Chain name skeleton */}
                    <Skeleton width="40px" height="12px" />
                  </Container>
                </Container>

                {/* Right side: Price and balance skeleton */}
                <Container
                  flex="column"
                  gap="3xs"
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  {/* Price amount skeleton */}
                  <Skeleton width="80px" height="16px" />
                  {/* Balance skeleton */}
                  <Container flex="row" gap="3xs">
                    <Skeleton width="50px" height="12px" />
                    <Skeleton width="40px" height="12px" />
                  </Container>
                </Container>
              </Container>
            </Container>
          ))}
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
          maxHeight: "400px",
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

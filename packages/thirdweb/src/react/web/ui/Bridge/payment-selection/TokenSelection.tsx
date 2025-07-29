"use client";
import type { Token } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import { useBridgeQuote } from "../../../../core/hooks/useBridgeQuote.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import { formatTokenAmount } from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { TokenAndChain } from "../common/TokenAndChain.js";

interface TokenSelectionProps {
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  destinationToken: Token;
  destinationAmount: bigint;
  feePayer?: "sender" | "receiver";
}

// Individual payment method token row component
interface PaymentMethodTokenRowProps {
  paymentMethod: PaymentMethod & { type: "wallet" };
  destinationToken: Token;
  destinationAmount: bigint;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  feePayer?: "sender" | "receiver";
}

function PaymentMethodTokenRow({
  paymentMethod,
  destinationToken,
  destinationAmount,
  client,
  onPaymentMethodSelected,
  feePayer,
}: PaymentMethodTokenRowProps) {
  const theme = useCustomTheme();

  // Fetch individual quote for this specific token pair
  const {
    data: quote,
    isLoading: quoteLoading,
    error: quoteError,
  } = useBridgeQuote({
    client,
    destinationAmount,
    destinationToken,
    feePayer,
    originToken: paymentMethod.originToken,
  });

  // Use the fetched originAmount if available, otherwise fall back to the one from paymentMethod
  const displayOriginAmount = quote?.originAmount;
  const hasEnoughBalance = displayOriginAmount
    ? paymentMethod.balance >= displayOriginAmount
    : false;

  return (
    <Button
      disabled={!hasEnoughBalance}
      fullWidth
      key={`${paymentMethod.originToken.address}-${paymentMethod.originToken.chainId}`}
      onClick={() => onPaymentMethodSelected(paymentMethod)}
      style={{
        backgroundColor: theme.colors.tertiaryBg,
        border: `1px solid ${theme.colors.borderColor}`,
        borderRadius: radius.md,
        opacity: hasEnoughBalance ? 1 : 0.5,
        padding: `${spacing.sm} ${spacing.md}`,
        textAlign: "left",
      }}
      variant="secondary"
    >
      <Container
        flex="row"
        gap="md"
        style={{ alignItems: "center", width: "100%" }}
      >
        <TokenAndChain
          client={client}
          size="lg"
          style={{
            maxWidth: "50%",
          }}
          token={paymentMethod.originToken}
        />
        <Container
          flex="column"
          gap="3xs"
          style={{ alignItems: "flex-end", flex: 1 }}
        >
          {quoteLoading ? (
            <>
              {/* Price amount skeleton */}
              <Skeleton height="16px" width="80px" />
              {/* Balance skeleton */}
              <Container flex="row" gap="3xs">
                <Skeleton height="12px" width="50px" />
                <Skeleton height="12px" width="40px" />
              </Container>
            </>
          ) : quoteError ? (
            <Text color="danger" size="sm" style={{ fontWeight: 600 }}>
              Quote failed
            </Text>
          ) : displayOriginAmount ? (
            <Text
              color="primaryText"
              size="sm"
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
              <Text color="secondaryText" size="xs">
                Balance:{" "}
              </Text>
              <Text
                color={
                  !quoteLoading
                    ? hasEnoughBalance
                      ? "success"
                      : "danger"
                    : "secondaryText"
                }
                size="xs"
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
  feePayer,
}: TokenSelectionProps) {
  const theme = useCustomTheme();

  if (paymentMethodsLoading) {
    return (
      <>
        <Text color="primaryText" size="md">
          Loading your tokens
        </Text>
        <Spacer y="sm" />
        <Container flex="column" gap="sm">
          {/* Skeleton rows matching PaymentMethodTokenRow structure */}
          {[1, 2, 3].map((i) => (
            <Container
              key={i}
              style={{
                backgroundColor: theme.colors.tertiaryBg,
                border: `1px solid ${theme.colors.borderColor}`,
                borderRadius: radius.md,
                padding: `${spacing.sm} ${spacing.md}`,
              }}
            >
              <Container
                flex="row"
                gap="md"
                style={{ alignItems: "center", width: "100%" }}
              >
                {/* Left side: Token icon and name skeleton */}
                <Container
                  center="y"
                  flex="row"
                  gap="sm"
                  style={{ maxWidth: "50%" }}
                >
                  {/* Token icon skeleton */}
                  <div
                    style={{
                      backgroundColor: theme.colors.skeletonBg,
                      borderRadius: "50%",
                      height: "32px",
                      width: "32px",
                    }}
                  />
                  <Container flex="column" gap="3xs">
                    {/* Token name skeleton */}
                    <Skeleton height="14px" width="60px" />
                    {/* Chain name skeleton */}
                    <Skeleton height="12px" width="40px" />
                  </Container>
                </Container>

                {/* Right side: Price and balance skeleton */}
                <Container
                  flex="column"
                  gap="3xs"
                  style={{ alignItems: "flex-end", flex: 1 }}
                >
                  {/* Price amount skeleton */}
                  <Skeleton height="16px" width="80px" />
                  {/* Balance skeleton */}
                  <Container flex="row" gap="3xs">
                    <Skeleton height="12px" width="50px" />
                    <Skeleton height="12px" width="40px" />
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
      <Container center="both" flex="column" style={{ minHeight: "250px" }}>
        <Text center color="primaryText" size="md">
          No available tokens found for this wallet
        </Text>
        <Spacer y="sm" />
        <Text center color="secondaryText" size="sm">
          Try connecting a different wallet or pay with card
        </Text>
        <Spacer y="lg" />
        <Button onClick={onBack} variant="primary">
          Select another payment method
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Text color="primaryText" size="md">
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
              client={client}
              destinationAmount={destinationAmount}
              destinationToken={destinationToken}
              feePayer={feePayer}
              key={`${method.originToken.address}-${method.originToken.chainId}`}
              onPaymentMethodSelected={onPaymentMethodSelected}
              paymentMethod={method}
            />
          ))}
      </Container>
    </>
  );
}

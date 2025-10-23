"use client";
import type { Token } from "../../../../../bridge/types/Token.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { SupportedFiatCurrency } from "../../../../../pay/convert/type.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Skeleton } from "../../components/Skeleton.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { TokenAndChain } from "../common/TokenAndChain.js";
import type { PaymentMethod } from "../types.js";

interface TokenSelectionProps {
  paymentMethods: PaymentMethod[];
  paymentMethodsLoading: boolean;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
  destinationToken: Token;
  destinationAmount: bigint;
  feePayer?: "sender" | "receiver";
  currency?: SupportedFiatCurrency;
}

// Individual payment method token row component
interface PaymentMethodTokenRowProps {
  paymentMethod: PaymentMethod & { type: "wallet" };
  destinationToken: Token;
  destinationAmount: bigint;
  client: ThirdwebClient;
  onPaymentMethodSelected: (paymentMethod: PaymentMethod) => void;
  feePayer?: "sender" | "receiver";
  currency?: SupportedFiatCurrency;
}

function PaymentMethodTokenRow({
  paymentMethod,
  client,
  onPaymentMethodSelected,
  currency,
}: PaymentMethodTokenRowProps) {
  const theme = useCustomTheme();

  const displayOriginAmount = paymentMethod.quote.originAmount;
  const hasEnoughBalance = displayOriginAmount
    ? paymentMethod.balance >= displayOriginAmount
    : false;
  const currencyPrice = paymentMethod.originToken.prices[currency || "USD"];

  return (
    <Button
      disabled={!hasEnoughBalance}
      fullWidth
      key={`${paymentMethod.originToken.address}-${paymentMethod.originToken.chainId}`}
      onClick={() => onPaymentMethodSelected(paymentMethod)}
      style={{
        backgroundColor: theme.colors.tertiaryBg,
        borderRadius: radius.lg,
        padding: `${spacing.md} ${spacing.md}`,
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
          {currencyPrice && (
            <Text
              color="primaryText"
              size="sm"
              style={{ fontWeight: 600, textWrap: "nowrap" }}
            >
              {formatCurrencyAmount(
                currency || "USD",
                Number(
                  formatTokenAmount(
                    paymentMethod.balance,
                    paymentMethod.originToken.decimals,
                  ),
                ) * currencyPrice,
              )}
            </Text>
          )}
          <Container flex="row" gap="3xs">
            <Text color={hasEnoughBalance ? "success" : "danger"} size="xs">
              {formatTokenAmount(
                paymentMethod.balance,
                paymentMethod.originToken.decimals,
              )}{" "}
              {paymentMethod.originToken.symbol}
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
  feePayer,
  currency,
}: TokenSelectionProps) {
  const theme = useCustomTheme();

  if (paymentMethodsLoading) {
    return (
      <Container
        flex="column"
        gap="xs"
        pb="lg"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {/* Skeleton rows matching PaymentMethodTokenRow structure */}
        {new Array(10).fill(0).map((_, i) => (
          <Container
            // biome-ignore lint/suspicious/noArrayIndexKey: ok
            key={i}
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              borderRadius: radius.lg,
              padding: `${spacing.md} ${spacing.md}`,
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
    <Container
      flex="column"
      gap="xs"
      pb="lg"
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
            currency={currency}
          />
        ))}
    </Container>
  );
}

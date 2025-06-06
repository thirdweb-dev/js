"use client";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import {} from "../../ConnectWallet/screens/Buy/fiat/currencies.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import type { UIOptions } from "../BridgeOrchestrator.js";
import { PaymentOverview } from "./PaymentOverview.js";

export interface PaymentDetailsProps {
  /**
   * The UI mode to use
   */
  uiOptions: UIOptions;
  /**
   * The client to use
   */
  client: ThirdwebClient;
  /**
   * The payment method to use
   */
  paymentMethod: PaymentMethod;
  /**
   * The prepared quote to preview
   */
  preparedQuote: BridgePrepareResult;

  /**
   * Called when user confirms the route
   */
  onConfirm: () => void;

  /**
   * Called when user wants to go back
   */
  onBack: () => void;

  /**
   * Called when an error occurs
   */
  onError: (error: Error) => void;
}

export function PaymentDetails({
  uiOptions,
  client,
  paymentMethod,
  preparedQuote,
  onConfirm,
  onBack,
  onError,
}: PaymentDetailsProps) {
  const theme = useCustomTheme();

  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      onError(error as Error);
    }
  };

  // Extract common data based on quote type
  const getDisplayData = () => {
    switch (preparedQuote.type) {
      case "transfer": {
        const token =
          paymentMethod.type === "wallet"
            ? paymentMethod.originToken
            : undefined;
        if (!token) {
          // can never happen
          onError(new Error("Invalid payment method"));
          return {
            originToken: undefined,
            destinationToken: undefined,
            originAmount: "0",
            destinationAmount: "0",
            estimatedTime: 0,
          };
        }
        return {
          originToken: token,
          destinationToken: token,
          originAmount: formatTokenAmount(
            preparedQuote.originAmount,
            token.decimals,
          ),
          destinationAmount: formatTokenAmount(
            preparedQuote.destinationAmount,
            token.decimals,
          ),
          estimatedTime: preparedQuote.estimatedExecutionTimeMs,
        };
      }
      case "buy": {
        const method =
          paymentMethod.type === "wallet" ? paymentMethod : undefined;
        if (!method) {
          // can never happen
          onError(new Error("Invalid payment method"));
          return {
            originToken: undefined,
            destinationToken: undefined,
            originAmount: "0",
            destinationAmount: "0",
            estimatedTime: 0,
          };
        }
        return {
          originToken:
            paymentMethod.type === "wallet"
              ? paymentMethod.originToken
              : undefined,
          destinationToken:
            preparedQuote.steps[preparedQuote.steps.length - 1]
              ?.destinationToken,
          originAmount: formatTokenAmount(
            preparedQuote.originAmount,
            method.originToken.decimals,
          ),
          destinationAmount: formatTokenAmount(
            preparedQuote.destinationAmount,
            preparedQuote.steps[preparedQuote.steps.length - 1]
              ?.destinationToken?.decimals ?? 18,
          ),
          estimatedTime: preparedQuote.estimatedExecutionTimeMs,
        };
      }
      case "onramp": {
        const method =
          paymentMethod.type === "fiat" ? paymentMethod : undefined;
        if (!method) {
          // can never happen
          onError(new Error("Invalid payment method"));
          return {
            originToken: undefined,
            destinationToken: undefined,
            originAmount: "0",
            destinationAmount: "0",
            estimatedTime: 0,
          };
        }
        return {
          originToken: undefined, // Onramp starts with fiat
          destinationToken: preparedQuote.destinationToken,
          originAmount: formatCurrencyAmount(
            method.currency,
            Number(preparedQuote.currencyAmount),
          ),
          destinationAmount: formatTokenAmount(
            preparedQuote.destinationAmount,
            preparedQuote.destinationToken.decimals,
          ),
          estimatedTime: undefined,
        };
      }
      default: {
        throw new Error(
          `Unsupported bridge prepare type: ${preparedQuote.type}`,
        );
      }
    }
  };

  const displayData = getDisplayData();

  return (
    <Container flex="column" fullHeight p="lg">
      <ModalHeader title="Payment Details" onBack={onBack} />

      <Spacer y="xl" />

      <Container flex="column">
        {/* Quote Summary */}
        <Container flex="column">
          {displayData.destinationToken && (
            <PaymentOverview
              uiOptions={uiOptions}
              sender={
                preparedQuote.intent.sender ||
                paymentMethod.payerWallet.getAccount()?.address
              }
              client={client}
              paymentMethod={paymentMethod}
              toToken={displayData.destinationToken}
              receiver={preparedQuote.intent.receiver}
              fromAmount={displayData.originAmount}
              toAmount={displayData.destinationAmount}
            />
          )}

          <Spacer y="md" />
          <Container flex="row" gap="sm">
            <Container
              flex="row"
              gap="xs"
              style={{ justifyContent: "center", flex: 1 }}
            >
              <Text size="sm" color="secondaryText">
                Estimated Time
              </Text>
              <Text size="sm" color="primaryText">
                {displayData.estimatedTime
                  ? `~${Math.ceil(displayData.estimatedTime / 60000)} min`
                  : "~2 min"}
              </Text>
            </Container>

            {preparedQuote.steps.length > 1 ? (
              <Container
                flex="row"
                gap="xs"
                style={{ justifyContent: "center", flex: 1 }}
              >
                <Text size="sm" color="secondaryText">
                  Route Length
                </Text>
                <Text size="sm" color="primaryText">
                  {preparedQuote.steps.length} step
                  {preparedQuote.steps.length !== 1 ? "s" : ""}
                </Text>
              </Container>
            ) : null}
          </Container>
        </Container>

        {/* Route Steps */}
        {preparedQuote.steps.length > 1 && (
          <Container flex="column">
            <Spacer y="sm" />

            <Container
              flex="column"
              gap="sm"
              style={{
                border: `1px solid ${theme.colors.borderColor}`,
                borderRadius: radius.md,
                backgroundColor: theme.colors.tertiaryBg,
                padding: `${spacing.sm} ${spacing.md}`,
              }}
            >
              {preparedQuote.steps.map((step, stepIndex) => (
                <Container
                  key={`step-${stepIndex}-${step.originToken.address}-${step.destinationToken.address}`}
                  flex="column"
                  gap="sm"
                >
                  {/* Step Header */}
                  <Container
                    flex="row"
                    gap="md"
                    style={{ alignItems: "center" }}
                  >
                    <Container
                      center="both"
                      flex="row"
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: theme.colors.accentButtonBg,
                        color: theme.colors.accentButtonText,
                        fontSize: "12px",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      <Text size="xs" color="accentButtonText">
                        {stepIndex + 1}
                      </Text>
                    </Container>

                    <Container
                      flex="row"
                      center="y"
                      gap="sm"
                      style={{ flex: 1 }}
                    >
                      <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                        <Text size="sm" color="primaryText">
                          {step.originToken.symbol} →{" "}
                          {step.destinationToken.symbol}
                        </Text>
                        <Text size="xs" color="secondaryText">
                          {step.originToken.name} to{" "}
                          {step.destinationToken.name}
                        </Text>
                      </Container>
                    </Container>
                  </Container>
                </Container>
              ))}
            </Container>
          </Container>
        )}

        <Spacer y="lg" />

        {/* Action Buttons */}
        <Container flex="column" gap="sm">
          <Button variant="accent" fullWidth onClick={handleConfirm}>
            Confirm Payment
          </Button>
        </Container>
      </Container>
    </Container>
  );
}

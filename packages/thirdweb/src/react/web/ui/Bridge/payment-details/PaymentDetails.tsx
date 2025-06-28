"use client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { trackPayEvent } from "../../../../../analytics/track/pay.js";
import { defineChain } from "../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../../core/design-system/index.js";
import { useChainsQuery } from "../../../../core/hooks/others/useChainQuery.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { PaymentMethod } from "../../../../core/machines/paymentMachine.js";
import {
  formatCurrencyAmount,
  formatTokenAmount,
} from "../../ConnectWallet/screens/formatTokenBalance.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Spacer } from "../../components/Spacer.js";
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

  useQuery({
    queryFn: () => {
      if (
        preparedQuote.type === "buy" ||
        preparedQuote.type === "sell" ||
        preparedQuote.type === "transfer"
      ) {
        trackPayEvent({
          chainId:
            preparedQuote.type === "transfer"
              ? preparedQuote.intent.chainId
              : preparedQuote.intent.originChainId,
          client,
          event: "payment_details",
          fromToken:
            preparedQuote.type === "transfer"
              ? preparedQuote.intent.tokenAddress
              : preparedQuote.intent.originTokenAddress,
          toChainId:
            preparedQuote.type === "transfer"
              ? preparedQuote.intent.chainId
              : preparedQuote.intent.destinationChainId,
          toToken:
            preparedQuote.type === "transfer"
              ? preparedQuote.intent.tokenAddress
              : preparedQuote.intent.destinationTokenAddress,
        });
      }
    },
    queryKey: ["payment_details", preparedQuote.type],
  });

  const chainsQuery = useChainsQuery(
    preparedQuote.steps.flatMap((s) => [
      defineChain(s.originToken.chainId),
      defineChain(s.destinationToken.chainId),
    ]),
    10,
  );
  const chainsMetadata = useMemo(
    () => chainsQuery.map((c) => c.data),
    [chainsQuery],
  ).filter((c) => !!c);

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
            destinationAmount: "0",
            destinationToken: undefined,
            estimatedTime: 0,
            originAmount: "0",
            originToken: undefined,
          };
        }
        return {
          destinationAmount: formatTokenAmount(
            preparedQuote.destinationAmount,
            token.decimals,
          ),
          destinationToken: token,
          estimatedTime: preparedQuote.estimatedExecutionTimeMs,
          originAmount: formatTokenAmount(
            preparedQuote.originAmount,
            token.decimals,
          ),
          originToken: token,
        };
      }
      case "buy": {
        const method =
          paymentMethod.type === "wallet" ? paymentMethod : undefined;
        if (!method) {
          // can never happen
          onError(new Error("Invalid payment method"));
          return {
            destinationAmount: "0",
            destinationToken: undefined,
            estimatedTime: 0,
            originAmount: "0",
            originToken: undefined,
          };
        }
        return {
          destinationAmount: formatTokenAmount(
            preparedQuote.destinationAmount,
            preparedQuote.steps[preparedQuote.steps.length - 1]
              ?.destinationToken?.decimals ?? 18,
          ),
          destinationToken:
            preparedQuote.steps[preparedQuote.steps.length - 1]
              ?.destinationToken,
          estimatedTime: preparedQuote.estimatedExecutionTimeMs,
          originAmount: formatTokenAmount(
            preparedQuote.originAmount,
            method.originToken.decimals,
          ),
          originToken:
            paymentMethod.type === "wallet"
              ? paymentMethod.originToken
              : undefined,
        };
      }
      case "onramp": {
        const method =
          paymentMethod.type === "fiat" ? paymentMethod : undefined;
        if (!method) {
          // can never happen
          onError(new Error("Invalid payment method"));
          return {
            destinationAmount: "0",
            destinationToken: undefined,
            estimatedTime: 0,
            originAmount: "0",
            originToken: undefined,
          };
        }
        return {
          destinationAmount: formatTokenAmount(
            preparedQuote.destinationAmount,
            preparedQuote.destinationToken.decimals,
          ), // Onramp starts with fiat
          destinationToken: preparedQuote.destinationToken,
          estimatedTime: undefined,
          originAmount: formatCurrencyAmount(
            method.currency,
            Number(preparedQuote.currencyAmount),
          ),
          originToken: undefined,
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
      <ModalHeader onBack={onBack} title="Payment Details" />

      <Spacer y="xl" />

      <Container flex="column">
        {/* Quote Summary */}
        <Container flex="column">
          {displayData.destinationToken && (
            <PaymentOverview
              client={client}
              fromAmount={displayData.originAmount}
              paymentMethod={paymentMethod}
              receiver={preparedQuote.intent.receiver}
              sender={
                preparedQuote.intent.sender ||
                paymentMethod.payerWallet.getAccount()?.address
              }
              toAmount={displayData.destinationAmount}
              toToken={displayData.destinationToken}
              uiOptions={uiOptions}
            />
          )}

          <Spacer y="md" />
          <Container flex="row" gap="sm">
            <Container
              flex="row"
              gap="xs"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <Text color="secondaryText" size="sm">
                Estimated Time
              </Text>
              <Text color="primaryText" size="sm">
                {displayData.estimatedTime
                  ? `~${Math.ceil(displayData.estimatedTime / 60000)} min`
                  : "~2 min"}
              </Text>
            </Container>

            {preparedQuote.steps.length > 1 ? (
              <Container
                flex="row"
                gap="xs"
                style={{ flex: 1, justifyContent: "center" }}
              >
                <Text color="secondaryText" size="sm">
                  Route Length
                </Text>
                <Text color="primaryText" size="sm">
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
                backgroundColor: theme.colors.tertiaryBg,
                border: `1px solid ${theme.colors.borderColor}`,
                borderRadius: radius.md,
                padding: `${spacing.sm} ${spacing.md}`,
              }}
            >
              {preparedQuote.steps.map((step, stepIndex) => (
                <Container
                  flex="column"
                  gap="sm"
                  key={`step-${stepIndex}-${step.originToken.address}-${step.destinationToken.address}`}
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
                        backgroundColor: theme.colors.accentButtonBg,
                        borderRadius: "50%",
                        color: theme.colors.accentButtonText,
                        flexShrink: 0,
                        fontSize: "12px",
                        fontWeight: "bold",
                        height: "24px",
                        width: "24px",
                      }}
                    >
                      <Text color="accentButtonText" size="xs">
                        {stepIndex + 1}
                      </Text>
                    </Container>

                    <Container
                      center="y"
                      flex="row"
                      gap="sm"
                      style={{ flex: 1 }}
                    >
                      <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                        <Text color="primaryText" size="sm">
                          {step.destinationToken.chainId !==
                          step.originToken.chainId ? (
                            <>
                              Bridge{" "}
                              {step.originToken.symbol ===
                              step.destinationToken.symbol
                                ? step.originToken.symbol
                                : `${step.originToken.symbol} to ${step.destinationToken.symbol}`}
                            </>
                          ) : (
                            <>
                              Swap {step.originToken.symbol} to{" "}
                              {step.destinationToken.symbol}
                            </>
                          )}
                        </Text>
                        <Text color="secondaryText" size="xs">
                          {step.originToken.chainId !==
                          step.destinationToken.chainId ? (
                            <>
                              {
                                chainsMetadata.find(
                                  (c) => c.chainId === step.originToken.chainId,
                                )?.name
                              }{" "}
                              to{" "}
                              {
                                chainsMetadata.find(
                                  (c) =>
                                    c.chainId === step.destinationToken.chainId,
                                )?.name
                              }
                            </>
                          ) : (
                            chainsMetadata.find(
                              (c) => c.chainId === step.originToken.chainId,
                            )?.name
                          )}
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
          <Button fullWidth onClick={handleConfirm} variant="accent">
            Confirm Payment
          </Button>
        </Container>
      </Container>
    </Container>
  );
}

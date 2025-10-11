"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { trackPayEvent } from "../../../../../analytics/track/pay.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { WindowAdapter } from "../../../../core/adapters/WindowAdapter.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../../core/hooks/useStepExecutor.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { PaymentReceipt } from "./PaymentReceipt.js";

type SuccessScreenProps = {
  /**
   * UI options
   */
  showContinueWithTx: boolean;
  /**
   * Prepared quote from Bridge.prepare
   */
  preparedQuote: BridgePrepareResult;

  /**
   * Completed status results from step execution
   */
  completedStatuses: CompletedStatusResult[];

  /**
   * Called when user closes the success screen
   */
  onDone: () => void;

  /**
   * Window adapter for opening URLs
   */
  windowAdapter: WindowAdapter;

  client: ThirdwebClient;

  /**
   * Whether or not this payment is associated with a payment ID. If it does, we show a different message.
   */
  hasPaymentId: boolean;
};

type ViewState = "success" | "detail";

export function SuccessScreen({
  preparedQuote,
  completedStatuses,
  onDone,
  windowAdapter,
  client,
  hasPaymentId = false,
  showContinueWithTx,
}: SuccessScreenProps) {
  const theme = useCustomTheme();
  const [viewState, setViewState] = useState<ViewState>("success");

  useQuery({
    queryFn: () => {
      if (preparedQuote.type === "buy" || preparedQuote.type === "sell") {
        trackPayEvent({
          chainId: preparedQuote.intent.originChainId,
          client: client,
          event: "ub:ui:success_screen",
          fromToken: preparedQuote.intent.originTokenAddress,
          toChainId: preparedQuote.intent.destinationChainId,
          toToken: preparedQuote.intent.destinationTokenAddress,
        });
      }
    },
    queryKey: ["success_screen", preparedQuote.type],
  });

  if (viewState === "detail") {
    return (
      <PaymentReceipt
        completedStatuses={completedStatuses}
        onBack={() => setViewState("success")}
        preparedQuote={preparedQuote}
        windowAdapter={windowAdapter}
      />
    );
  }

  return (
    <Container flex="column" fullHeight px="md" pb="md" pt="md+">
      <ModalHeader title="Payment Complete" />

      <Spacer y="xxl" />

      <Container center="x" flex="column" gap="md">
        {/* Success Icon with Animation */}
        <Container
          center="both"
          flex="row"
          style={{
            animation: "successBounce 0.6s ease-out",
            border: `2px solid ${theme.colors.success}`,
            borderRadius: "50%",
            height: "64px",
            marginBottom: "16px",
            width: "64px",
          }}
        >
          <CheckIcon
            color={theme.colors.success}
            height={iconSize.xl}
            style={{
              animation: "checkAppear 0.3s ease-out 0.3s both",
            }}
            width={iconSize.xl}
          />
        </Container>

        <div>
          <Text
            center
            color="primaryText"
            size="xl"
            weight={600}
            trackingTight
            style={{
              marginBottom: spacing.xxs,
            }}
          >
            Payment Successful!
          </Text>

          <Text center color="secondaryText" size="sm">
            {hasPaymentId
              ? "You can now close this page and return to the application."
              : showContinueWithTx
                ? "Click continue to execute your transaction."
                : "Your payment has been completed successfully."}
          </Text>
        </div>
      </Container>

      <Spacer y="xxl" />

      {/* Action Buttons */}
      <Container flex="column" gap="sm" style={{ width: "100%" }}>
        <Button
          fullWidth
          onClick={() => setViewState("detail")}
          variant="secondary"
        >
          View Payment Receipt
        </Button>

        {!hasPaymentId && (
          <Button fullWidth onClick={onDone} variant="accent">
            {showContinueWithTx ? "Continue" : "Done"}
          </Button>
        )}
      </Container>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes successBounce {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes checkAppear {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Container>
  );
}

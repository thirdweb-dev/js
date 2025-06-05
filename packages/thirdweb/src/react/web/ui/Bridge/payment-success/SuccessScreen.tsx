"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { WindowAdapter } from "../../../../core/adapters/WindowAdapter.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize } from "../../../../core/design-system/index.js";
import type { BridgePrepareResult } from "../../../../core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../../../core/hooks/useStepExecutor.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { PaymentReceipt } from "./PaymentReceipt.js";

export interface SuccessScreenProps {
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
  onClose: () => void;

  /**
   * Called when user wants to start a new payment
   */
  onNewPayment?: () => void;

  /**
   * Window adapter for opening URLs
   */
  windowAdapter: WindowAdapter;
}

type ViewState = "success" | "detail";

export function SuccessScreen({
  preparedQuote,
  completedStatuses,
  onClose,
  windowAdapter,
}: SuccessScreenProps) {
  const theme = useCustomTheme();
  const [viewState, setViewState] = useState<ViewState>("success");

  if (viewState === "detail") {
    return (
      <PaymentReceipt
        preparedQuote={preparedQuote}
        completedStatuses={completedStatuses}
        windowAdapter={windowAdapter}
        onBack={() => setViewState("success")}
      />
    );
  }

  return (
    <Container flex="column" fullHeight p="lg">
      <ModalHeader title="Payment Complete" />

      <Spacer y="xl" />

      <Container flex="column" gap="md" center="x">
        {/* Success Icon with Animation */}
        <Container
          center="both"
          flex="row"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: theme.colors.tertiaryBg,
            marginBottom: "16px",
            border: `2px solid ${theme.colors.success}`,
            animation: "successBounce 0.6s ease-out",
          }}
        >
          <CheckIcon
            width={iconSize.xl}
            height={iconSize.xl}
            color={theme.colors.success}
            style={{
              animation: "checkAppear 0.3s ease-out 0.3s both",
            }}
          />
        </Container>

        <Text size="xl" color="primaryText" center>
          Payment Successful!
        </Text>

        <Text size="sm" color="secondaryText" center>
          Your cross-chain payment has been completed successfully.
        </Text>
      </Container>
      <Spacer y="lg" />

      {/* Action Buttons */}
      <Container flex="column" gap="sm" style={{ width: "100%" }}>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setViewState("detail")}
        >
          View Payment Receipt
        </Button>

        <Button variant="accent" fullWidth onClick={onClose}>
          Done
        </Button>
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

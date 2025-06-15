"use client";
import { CheckIcon, ClockIcon, Cross1Icon } from "@radix-ui/react-icons";
import type { RouteStep } from "../../../../bridge/types/Route.js";
import type { Chain } from "../../../../chains/types.js";
import { defineChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WindowAdapter } from "../../../core/adapters/WindowAdapter.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import type { BridgePrepareRequest } from "../../../core/hooks/useBridgePrepare.js";
import {
  type CompletedStatusResult,
  useStepExecutor,
} from "../../../core/hooks/useStepExecutor.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
import { Container, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";

interface StepRunnerProps {
  request: BridgePrepareRequest;

  /**
   * Wallet instance for executing transactions
   */
  wallet: Wallet;

  /**
   * Thirdweb client for API calls
   */
  client: ThirdwebClient;

  /**
   * Window adapter for opening URLs (web/RN)
   */
  windowAdapter: WindowAdapter;

  /**
   * Whether to automatically start the transaction process
   */
  autoStart?: boolean;

  /**
   * Called when all steps are completed - receives array of completed status results
   */
  onComplete: (completedStatuses: CompletedStatusResult[]) => void;

  /**
   * Called when user cancels the flow
   */
  onCancel?: () => void;

  /**
   * Called when user clicks the back button
   */
  onBack?: () => void;
}

export function StepRunner({
  request,
  wallet,
  client,
  windowAdapter,
  onComplete,
  onCancel,
  onBack,
  autoStart,
}: StepRunnerProps) {
  const theme = useCustomTheme();

  // Use the real step executor hook
  const {
    currentStep,
    progress,
    executionState,
    onrampStatus,
    steps,
    error,
    start,
    cancel,
    retry,
  } = useStepExecutor({
    request,
    wallet,
    client,
    windowAdapter,
    autoStart,
    onComplete: (completedStatuses: CompletedStatusResult[]) => {
      onComplete(completedStatuses);
    },
  });

  const handleCancel = () => {
    cancel();
    if (onCancel) {
      onCancel();
    }
  };

  const handleRetry = () => {
    retry();
  };

  const getStepStatus = (
    stepIndex: number,
  ): "pending" | "executing" | "completed" | "failed" => {
    if (!currentStep || !steps) {
      // Not started yet
      return stepIndex === 0 ? (error ? "failed" : "pending") : "pending";
    }

    const currentStepIndex = steps.findIndex((step) => step === currentStep);

    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex && executionState === "executing")
      return "executing";
    if (stepIndex === currentStepIndex && error) return "failed";
    if (
      stepIndex === currentStepIndex &&
      executionState === "idle" &&
      progress === 100
    )
      return "completed";

    return "pending";
  };

  const getStatusIcon = (
    status: "pending" | "executing" | "completed" | "failed",
  ) => {
    switch (status) {
      case "completed":
        return (
          <CheckIcon
            width={iconSize.sm}
            height={iconSize.sm}
            color={theme.colors.accentButtonText}
          />
        );
      case "executing":
        return <Spinner size="sm" color={"accentButtonText"} />;
      case "failed":
        return (
          <Cross1Icon
            width={iconSize.sm}
            height={iconSize.sm}
            color={theme.colors.primaryText}
          />
        );
      default:
        return (
          <ClockIcon
            width={iconSize.sm}
            height={iconSize.sm}
            color={theme.colors.primaryText}
          />
        );
    }
  };

  const getStepBackgroundColor = (
    status: "pending" | "executing" | "completed" | "failed",
  ) => {
    switch (status) {
      case "completed":
        return theme.colors.tertiaryBg;
      case "executing":
        return theme.colors.tertiaryBg;
      case "failed":
        return theme.colors.tertiaryBg;
      default:
        return theme.colors.tertiaryBg;
    }
  };

  const getIconBackgroundColor = (
    status: "pending" | "executing" | "completed" | "failed",
  ) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "executing":
        return theme.colors.accentButtonBg;
      case "failed":
        return theme.colors.danger;
      default:
        return theme.colors.borderColor;
    }
  };

  const getStepDescription = (step: RouteStep) => {
    const { originToken, destinationToken } = step;

    // If tokens are the same, it's likely a bridge operation
    if (originToken.chainId !== destinationToken.chainId) {
      return (
        <Container flex="row" gap="3xs">
          <Text size="sm" color="primaryText">
            Bridge {originToken.symbol} to{" "}
          </Text>
          <ChainName
            chain={getDestinationChain(request)}
            size="sm"
            client={client}
            short
            color="primaryText"
          />
        </Container>
      );
    }

    // If different tokens on same chain, it's a swap
    if (originToken.symbol !== destinationToken.symbol) {
      return (
        <Text size="sm" color="primaryText">
          Swap {originToken.symbol} to {destinationToken.symbol}
        </Text>
      );
    }

    // Fallback to step number
    return (
      <Text size="sm" color="primaryText">
        Process transaction
      </Text>
    );
  };

  const getStepStatusText = (
    status: "pending" | "executing" | "completed" | "failed",
  ) => {
    switch (status) {
      case "executing":
        return "Processing...";
      case "completed":
        return "Completed";
      case "pending":
        return "Waiting...";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <Container flex="column" fullHeight p="lg">
      <ModalHeader title="Processing Payment" onBack={onBack} />

      <Spacer y="xl" />

      <Container flex="column">
        {/* Progress Bar */}
        <Container flex="column" gap="sm">
          <Container flex="row" center="y">
            <Text size="sm" color="secondaryText" style={{ flex: 1 }}>
              Progress
            </Text>
            <Text size="sm" color="primaryText">
              {progress}%
            </Text>
          </Container>

          <Container
            style={{
              width: "100%",
              height: "8px",
              backgroundColor: theme.colors.tertiaryBg,
              border: `1px solid ${theme.colors.borderColor}`,
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Container
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: error
                  ? theme.colors.danger
                  : theme.colors.accentButtonBg,
                transition: "width 0.3s ease",
              }}
            >
              <Text />
            </Container>
          </Container>
        </Container>

        <Spacer y="lg" />

        {/* Steps List */}
        <Container flex="column" gap="sm">
          {request.type === "onramp" && onrampStatus ? (
            <Container
              flex="row"
              gap="md"
              style={{
                alignItems: "center",
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: radius.md,
                backgroundColor: getStepBackgroundColor(onrampStatus),
                border: `1px solid ${theme.colors.borderColor}`,
              }}
            >
              <Container
                center="both"
                flex="row"
                style={{
                  width: `${iconSize.lg}px`,
                  height: `${iconSize.lg}px`,
                  borderRadius: "50%",
                  backgroundColor: getIconBackgroundColor(onrampStatus),
                  color: theme.colors.primaryButtonText,
                  flexShrink: 0,
                }}
              >
                {getStatusIcon(onrampStatus)}
              </Container>

              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text size="sm" color="primaryText">
                  TEST
                </Text>
                <Text size="xs" color="secondaryText">
                  {getStepStatusText(onrampStatus)}
                </Text>
              </Container>
            </Container>
          ) : null}
          {steps?.map((step, index) => {
            const status = getStepStatus(index);

            return (
              <Container
                key={`${step.originToken.chainId}-${step.destinationToken.chainId}-${index}`}
                flex="row"
                gap="md"
                style={{
                  alignItems: "center",
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: radius.md,
                  backgroundColor: getStepBackgroundColor(status),
                  border: `1px solid ${theme.colors.borderColor}`,
                }}
              >
                <Container
                  center="both"
                  flex="row"
                  style={{
                    width: `${iconSize.lg}px`,
                    height: `${iconSize.lg}px`,
                    borderRadius: "50%",
                    backgroundColor: getIconBackgroundColor(status),
                    color: theme.colors.primaryButtonText,
                    flexShrink: 0,
                  }}
                >
                  {getStatusIcon(status)}
                </Container>

                <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                  {getStepDescription(step)}
                  <Text size="xs" color="secondaryText">
                    {getStepStatusText(status)}
                  </Text>
                </Container>
              </Container>
            );
          })}
        </Container>

        <Spacer y="md" />
        <Text size="xs" color="secondaryText" center>
          Keep this window open until all
          <br /> transactions are complete.
        </Text>

        <Spacer y="lg" />

        {/* Action Buttons */}
        {error ? (
          <Container flex="row" gap="md">
            <Button variant="primary" fullWidth onClick={handleRetry}>
              Retry
            </Button>
          </Container>
        ) : executionState === "idle" && progress === 0 ? (
          <Button variant="accent" fullWidth onClick={start}>
            Start Transaction
          </Button>
        ) : executionState === "executing" ||
          executionState === "auto-starting" ? (
          <Button variant="secondary" fullWidth onClick={handleCancel}>
            Cancel Transaction
          </Button>
        ) : null}
      </Container>
    </Container>
  );
}

function getDestinationChain(request: BridgePrepareRequest): Chain {
  switch (request.type) {
    case "onramp":
      return defineChain(request.chainId);
    case "buy":
    case "sell":
      return defineChain(request.destinationChainId);
    case "transfer":
      return defineChain(request.chainId);
    default:
      throw new Error("Invalid quote type");
  }
}

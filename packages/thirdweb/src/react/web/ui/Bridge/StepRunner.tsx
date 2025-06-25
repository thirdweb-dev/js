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
import { Container, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { ChainName } from "../components/ChainName.js";
import { Spacer } from "../components/Spacer.js";
import { Spinner } from "../components/Spinner.js";
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
    autoStart,
    client,
    onComplete: (completedStatuses: CompletedStatusResult[]) => {
      onComplete(completedStatuses);
    },
    request,
    wallet,
    windowAdapter,
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
            color={theme.colors.accentButtonText}
            height={iconSize.sm}
            width={iconSize.sm}
          />
        );
      case "executing":
        return <Spinner color={"accentButtonText"} size="sm" />;
      case "failed":
        return (
          <Cross1Icon color="white" height={iconSize.sm} width={iconSize.sm} />
        );
      default:
        return (
          <ClockIcon
            color={theme.colors.primaryText}
            height={iconSize.sm}
            width={iconSize.sm}
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
          <Text color="primaryText" size="sm">
            Bridge {originToken.symbol} to{" "}
          </Text>
          <ChainName
            chain={getDestinationChain(request)}
            client={client}
            color="primaryText"
            short
            size="sm"
          />
        </Container>
      );
    }

    // If different tokens on same chain, it's a swap
    if (originToken.symbol !== destinationToken.symbol) {
      return (
        <Text color="primaryText" size="sm">
          Swap {originToken.symbol} to {destinationToken.symbol}
        </Text>
      );
    }

    // Fallback to step number
    return (
      <Text color="primaryText" size="sm">
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
      <ModalHeader onBack={onBack} title="Processing Payment" />

      <Spacer y="xl" />

      <Container flex="column">
        {/* Progress Bar */}
        <Container flex="column" gap="sm">
          <Container center="y" flex="row">
            <Text color="secondaryText" size="sm" style={{ flex: 1 }}>
              Progress
            </Text>
            <Text color="primaryText" size="sm">
              {progress}%
            </Text>
          </Container>

          <Container
            style={{
              backgroundColor: theme.colors.tertiaryBg,
              border: `1px solid ${theme.colors.borderColor}`,
              borderRadius: "4px",
              height: "8px",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Container
              style={{
                backgroundColor: error
                  ? theme.colors.danger
                  : theme.colors.accentButtonBg,
                height: "100%",
                transition: "width 0.3s ease",
                width: `${progress}%`,
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
                backgroundColor: getStepBackgroundColor(onrampStatus),
                border: `1px solid ${theme.colors.borderColor}`,
                borderRadius: radius.md,
                padding: `${spacing.sm} ${spacing.md}`,
              }}
            >
              <Container
                center="both"
                flex="row"
                style={{
                  backgroundColor: getIconBackgroundColor(onrampStatus),
                  borderRadius: "50%",
                  color: theme.colors.primaryButtonText,
                  flexShrink: 0,
                  height: `${iconSize.lg}px`,
                  width: `${iconSize.lg}px`,
                }}
              >
                {getStatusIcon(onrampStatus)}
              </Container>

              <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                <Text color="primaryText" size="sm">
                  {request.onramp.slice(0, 1).toUpperCase() +
                    request.onramp.slice(1)}
                </Text>
                <Text color="secondaryText" size="xs">
                  {getStepStatusText(onrampStatus)}
                </Text>
              </Container>
            </Container>
          ) : null}
          {steps?.map((step, index) => {
            const status = getStepStatus(index);

            return (
              <Container
                flex="row"
                gap="md"
                key={`${step.originToken.chainId}-${step.destinationToken.chainId}-${index}`}
                style={{
                  alignItems: "center",
                  backgroundColor: getStepBackgroundColor(status),
                  border: `1px solid ${theme.colors.borderColor}`,
                  borderRadius: radius.md,
                  padding: `${spacing.sm} ${spacing.md}`,
                }}
              >
                <Container
                  center="both"
                  flex="row"
                  style={{
                    backgroundColor: getIconBackgroundColor(status),
                    borderRadius: "50%",
                    color: theme.colors.primaryButtonText,
                    flexShrink: 0,
                    height: `${iconSize.lg}px`,
                    width: `${iconSize.lg}px`,
                  }}
                >
                  {getStatusIcon(status)}
                </Container>

                <Container flex="column" gap="3xs" style={{ flex: 1 }}>
                  {getStepDescription(step)}
                  <Text color="secondaryText" size="xs">
                    {getStepStatusText(status)}
                  </Text>
                </Container>
              </Container>
            );
          })}
        </Container>

        <Spacer y="md" />
        <Text center color="secondaryText" size="xs">
          Keep this window open until all
          <br /> transactions are complete.
        </Text>

        <Spacer y="lg" />

        {/* Action Buttons */}
        {error ? (
          <Container flex="row" gap="md">
            <Button fullWidth onClick={handleRetry} variant="primary">
              Retry
            </Button>
          </Container>
        ) : executionState === "idle" && progress === 0 ? (
          <Button fullWidth onClick={start} variant="accent">
            Start Transaction
          </Button>
        ) : executionState === "executing" ||
          executionState === "auto-starting" ? (
          <Button fullWidth onClick={handleCancel} variant="secondary">
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

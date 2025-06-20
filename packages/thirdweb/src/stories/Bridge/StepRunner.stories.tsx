import type { Meta, StoryObj } from "@storybook/react";
import type { ThirdwebClient } from "../../client/client.js";
import type { WindowAdapter } from "../../react/core/adapters/WindowAdapter.js";
import type { Theme } from "../../react/core/design-system/index.js";
import type { BridgePrepareRequest } from "../../react/core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../react/core/hooks/useStepExecutor.js";
import { StepRunner } from "../../react/web/ui/Bridge/StepRunner.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { STORY_MOCK_WALLET, simpleBuyRequest } from "./fixtures.js";

// Mock window adapter
const mockWindowAdapter: WindowAdapter = {
  open: async (_url: string) => {},
};

// Props interface for the wrapper component
interface StepRunnerWithThemeProps {
  request: BridgePrepareRequest;
  wallet: Wallet;
  client: ThirdwebClient;
  windowAdapter: WindowAdapter;
  onComplete: (completedStatuses: CompletedStatusResult[]) => void;
  onError: (error: Error) => void;
  onCancel?: () => void;
  onBack?: () => void;
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const StepRunnerWithTheme = (props: StepRunnerWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <StepRunner {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  args: {
    client: storyClient,
    onCancel: () => {},
    onComplete: (_completedStatuses: CompletedStatusResult[]) => {},
    onError: (error: Error) => console.error("Error:", error),
    theme: "dark",
    wallet: STORY_MOCK_WALLET,
    windowAdapter: mockWindowAdapter,
  },
  argTypes: {
    onCancel: { action: "execution cancelled" },
    onComplete: { action: "execution completed" },
    onError: { action: "error occurred" },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: StepRunnerWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "**StepRunner** executes prepared route steps sequentially, showing real-time progress and transaction status.\n\n" +
          "## Features\n" +
          "- **Real Execution**: Uses useStepExecutor hook for actual transaction processing\n" +
          "- **Progress Tracking**: Visual progress bar and step-by-step status updates\n" +
          "- **Error Handling**: Retry functionality for failed transactions\n" +
          "- **Transaction Batching**: Optimizes multiple transactions when possible\n" +
          "- **Onramp Support**: Handles fiat-to-crypto onramp flows\n\n" +
          "## Props\n" +
          "- `steps`: Array of RouteStep objects from Bridge.prepare()\n" +
          "- `wallet`: Connected wallet for transaction signing\n" +
          "- `client`: ThirdwebClient instance\n" +
          "- `windowAdapter`: Platform-specific window/URL handler\n" +
          "- `onramp`: Optional onramp configuration\n\n" +
          "## Integration\n" +
          "This component is typically used within the BridgeOrchestrator after route preparation.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/StepRunner",
} satisfies Meta<typeof StepRunnerWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    request: simpleBuyRequest,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Dark: Story = {
  args: {
    request: simpleBuyRequest,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

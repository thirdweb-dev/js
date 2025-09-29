import type { Meta, StoryObj } from "@storybook/react";
import type { ThirdwebClient } from "../../client/client.js";
import type { WindowAdapter } from "../../react/core/adapters/WindowAdapter.js";
import type { Theme } from "../../react/core/design-system/index.js";
import type { BridgePrepareRequest } from "../../react/core/hooks/useBridgePrepare.js";
import type { CompletedStatusResult } from "../../react/core/hooks/useStepExecutor.js";
import { StepRunner } from "../../react/web/ui/Bridge/StepRunner.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  STORY_MOCK_WALLET,
  simpleBuyQuote,
  simpleBuyRequest,
} from "./fixtures.js";

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
      <StepRunner {...componentProps} preparedQuote={simpleBuyQuote} />
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
    layout: "centered",
  },
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

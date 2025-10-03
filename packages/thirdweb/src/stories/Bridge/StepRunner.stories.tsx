import type { Meta, StoryObj } from "@storybook/react";
import type { CompletedStatusResult } from "../../react/core/hooks/useStepExecutor.js";
import { webWindowAdapter } from "../../react/web/adapters/WindowAdapter.js";
import { StepRunner } from "../../react/web/ui/Bridge/StepRunner.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import {
  STORY_MOCK_WALLET,
  simpleBuyQuote,
  simpleBuyRequest,
} from "./fixtures.js";

const meta: Meta<typeof StepRunner> = {
  args: {
    client: storyClient,
    onCancel: () => {},
    onComplete: (_completedStatuses: CompletedStatusResult[]) => {},
    wallet: STORY_MOCK_WALLET,
    windowAdapter: webWindowAdapter,
    title: undefined,
    autoStart: true,
    onBack: undefined,
    preparedQuote: simpleBuyQuote,
  },
  component: StepRunner,
  decorators: [
    (Story) => (
      <ModalThemeWrapper>
        <Story />
      </ModalThemeWrapper>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  title: "Bridge/screens/StepRunner",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    request: simpleBuyRequest,
  },
};

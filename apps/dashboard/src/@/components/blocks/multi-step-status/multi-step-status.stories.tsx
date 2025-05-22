import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepStatus } from "./multi-step-status";

const meta = {
  title: "Blocks/MultiStepStatus",
  component: MultiStepStatus,
  decorators: [
    (Story) => (
      <div className="container w-full max-w-md py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MultiStepStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AllStates: Story = {
  args: {
    steps: [
      {
        status: "completed",
        label: "Connect Wallet",
        retryLabel: "Failed to connect wallet",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: "pending",
        label: "Sign Message",
        retryLabel: "Failed to sign message",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: "error",
        label: "Approve Transaction",
        retryLabel: "Transaction approval failed",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: "idle",
        label: "Confirm Transaction",
        retryLabel: "Transaction confirmation failed",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: "idle",
        label: "Finalize",
        retryLabel: "Finalization failed",
        execute: async () => {
          await sleep(1000);
        },
      },
    ],
  },
};

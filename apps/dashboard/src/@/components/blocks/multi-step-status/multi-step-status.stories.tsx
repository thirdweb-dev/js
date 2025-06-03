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
        status: { type: "completed" },
        label: "Connect Wallet",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: { type: "pending" },
        label: "Sign Message",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: { type: "error", message: "This is an error message" },
        label: "Approve Transaction",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: { type: "idle" },
        label: "Confirm Transaction",
        execute: async () => {
          await sleep(1000);
        },
      },
      {
        status: { type: "idle" },
        label: "Finalize",
        execute: async () => {
          await sleep(1000);
        },
      },
    ],
  },
};

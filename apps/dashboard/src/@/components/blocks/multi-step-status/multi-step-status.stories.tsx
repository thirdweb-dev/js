import type { Meta, StoryObj } from "@storybook/nextjs";
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

export const AllStates: Story = {
  args: {
    onRetry: () => {},
    steps: [
      {
        status: { type: "completed" },
        label: "Connect Wallet",
        id: "connect-wallet",
      },
      {
        status: { type: "pending" },
        label: "Sign Message",
        id: "sign-message",
      },
      {
        status: { type: "error", message: "This is an error message" },
        label: "Approve Transaction",
        id: "approve-transaction",
      },
      {
        status: { type: "idle" },
        label: "Confirm Transaction",
        id: "confirm-transaction",
      },
      {
        status: { type: "idle" },
        label: "Finalize",
        id: "finalize",
      },
    ],
  },
};

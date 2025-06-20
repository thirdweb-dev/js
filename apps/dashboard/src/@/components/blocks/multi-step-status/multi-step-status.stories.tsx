import type { Meta, StoryObj } from "@storybook/nextjs";
import { MultiStepStatus } from "./multi-step-status";

const meta = {
  component: MultiStepStatus,
  decorators: [
    (Story) => (
      <div className="container w-full max-w-md py-10">
        <Story />
      </div>
    ),
  ],
  title: "Blocks/MultiStepStatus",
} satisfies Meta<typeof MultiStepStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  args: {
    onRetry: () => {},
    steps: [
      {
        id: "connect-wallet",
        label: "Connect Wallet",
        status: { type: "completed" },
      },
      {
        id: "sign-message",
        label: "Sign Message",
        status: { type: "pending" },
      },
      {
        id: "approve-transaction",
        label: "Approve Transaction",
        status: { message: "This is an error message", type: "error" },
      },
      {
        id: "confirm-transaction",
        label: "Confirm Transaction",
        status: { type: "idle" },
      },
      {
        id: "finalize",
        label: "Finalize",
        status: { type: "idle" },
      },
    ],
  },
};

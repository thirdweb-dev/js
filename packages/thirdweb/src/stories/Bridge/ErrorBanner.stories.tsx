import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBanner } from "../../react/web/ui/Bridge/ErrorBanner.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";

const mockNetworkError = new Error(
  "Network connection failed. Please check your internet connection and try again.",
);
const mockUserRejectedError = new Error("Transaction was rejected by user.");
const mockInsufficientFundsError = new Error(
  "Insufficient funds to complete this transaction.",
);
const mockGenericError = new Error("An unexpected error occurred.");

const meta: Meta<typeof ErrorBanner> = {
  args: {
    onCancel: () => {},
    onRetry: () => {},
    client: storyClient,
  },
  component: ErrorBanner,
  decorators: [
    (Story) => (
      <ModalThemeWrapper>
        <Story />
      </ModalThemeWrapper>
    ),
  ],
  title: "Bridge/screens/ErrorBanner",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NetworkError: Story = {
  args: {
    error: mockNetworkError,
  },
};

export const UserRejectedError: Story = {
  args: {
    error: mockUserRejectedError,
  },
};

export const InsufficientFundsError: Story = {
  args: {
    error: mockInsufficientFundsError,
  },
};

export const WithoutCancelButton: Story = {
  args: {
    error: mockGenericError,
    onCancel: undefined,
  },
};

export const EmptyMessage: Story = {
  args: {
    error: new Error(""),
  },
};

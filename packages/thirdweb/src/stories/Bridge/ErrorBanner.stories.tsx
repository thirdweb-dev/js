import type { Meta, StoryObj } from "@storybook/react";
import { createThirdwebClient } from "../../client/client.js";
import type { Theme } from "../../react/core/design-system/index.js";
import { ErrorBanner } from "../../react/web/ui/Bridge/ErrorBanner.js";
import { ModalThemeWrapper } from "../utils.js";

const mockNetworkError = new Error(
  "Network connection failed. Please check your internet connection and try again.",
);
const mockUserRejectedError = new Error("Transaction was rejected by user.");
const mockInsufficientFundsError = new Error(
  "Insufficient funds to complete this transaction.",
);
const mockGenericError = new Error("An unexpected error occurred.");

// Props interface for the wrapper component
interface ErrorBannerWithThemeProps {
  error: Error;
  onRetry: () => void;
  onCancel?: () => void;
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const ErrorBannerWithTheme = (props: ErrorBannerWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <ErrorBanner
        client={createThirdwebClient({ clientId: "test" })}
        {...componentProps}
      />
    </ModalThemeWrapper>
  );
};

const meta = {
  args: {
    error: mockNetworkError,
    onCancel: () => {},
    onRetry: () => {},
    theme: "dark",
  },
  argTypes: {
    onCancel: { action: "cancel clicked" },
    onRetry: { action: "retry clicked" },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
  },
  component: ErrorBannerWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "Error banner component that displays user-friendly error messages with retry functionality and optional cancel action.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/ErrorBanner",
} satisfies Meta<typeof ErrorBannerWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NetworkError: Story = {
  args: {
    error: mockNetworkError,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NetworkErrorLight: Story = {
  args: {
    error: mockNetworkError,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const UserRejectedError: Story = {
  args: {
    error: mockUserRejectedError,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const UserRejectedErrorLight: Story = {
  args: {
    error: mockUserRejectedError,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const InsufficientFundsError: Story = {
  args: {
    error: mockInsufficientFundsError,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const InsufficientFundsErrorLight: Story = {
  args: {
    error: mockInsufficientFundsError,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const WithoutCancelButton: Story = {
  args: {
    error: mockGenericError,
    onCancel: undefined,
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithoutCancelButtonLight: Story = {
  args: {
    error: mockGenericError,
    onCancel: undefined,
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const EmptyMessage: Story = {
  args: {
    error: new Error(""),
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const EmptyMessageLight: Story = {
  args: {
    error: new Error(""),
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

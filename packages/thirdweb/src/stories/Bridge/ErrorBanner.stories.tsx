import type { Meta, StoryObj } from "@storybook/react";
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
      <ErrorBanner {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  title: "Bridge/ErrorBanner",
  component: ErrorBannerWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Error banner component that displays user-friendly error messages with retry functionality and optional cancel action.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    error: mockNetworkError,
    onRetry: () => console.log("Retry clicked"),
    onCancel: () => console.log("Cancel clicked"),
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onRetry: { action: "retry clicked" },
    onCancel: { action: "cancel clicked" },
  },
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
    theme: "dark",
    error: mockNetworkError,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const NetworkErrorLight: Story = {
  args: {
    theme: "light",
    error: mockNetworkError,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const UserRejectedError: Story = {
  args: {
    theme: "dark",
    error: mockUserRejectedError,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const UserRejectedErrorLight: Story = {
  args: {
    theme: "light",
    error: mockUserRejectedError,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const InsufficientFundsError: Story = {
  args: {
    theme: "dark",
    error: mockInsufficientFundsError,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const InsufficientFundsErrorLight: Story = {
  args: {
    theme: "light",
    error: mockInsufficientFundsError,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const WithoutCancelButton: Story = {
  args: {
    theme: "dark",
    error: mockGenericError,
    onCancel: undefined,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WithoutCancelButtonLight: Story = {
  args: {
    theme: "light",
    error: mockGenericError,
    onCancel: undefined,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const EmptyMessage: Story = {
  args: {
    theme: "dark",
    error: new Error(""),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const EmptyMessageLight: Story = {
  args: {
    theme: "light",
    error: new Error(""),
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

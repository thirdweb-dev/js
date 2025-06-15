import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import {
  PaymentSelection,
  type PaymentSelectionProps,
} from "../../react/web/ui/Bridge/payment-selection/PaymentSelection.js";
import en from "../../react/web/ui/ConnectWallet/locale/en.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { UNI, USDC } from "./fixtures.js";

// Props interface for the wrapper component
interface PaymentSelectionWithThemeProps extends PaymentSelectionProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const PaymentSelectionWithTheme = (props: PaymentSelectionWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <PaymentSelection {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  title: "Bridge/PaymentSelection",
  component: PaymentSelectionWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Payment method selection screen with a 2-step flow:\n\n" +
          "**Step 1:** Choose payment method - shows connected wallets, connect wallet option, and pay with fiat option\n\n" +
          "**Step 2a:** If wallet selected - shows available origin tokens for bridging to the destination token (fetches real routes data from the Bridge API)\n\n" +
          "**Step 2b:** If fiat selected - shows onramp provider options (Coinbase, Stripe, Transak)\n\n" +
          "The component intelligently manages wallet context and provides proper error handling for each step.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    destinationToken: USDC,
    client: storyClient,
    onPaymentMethodSelected: (_paymentMethod) => {},
    onError: (error) => console.error("Error:", error),
    theme: "dark",
    destinationAmount: "1",
    connectLocale: en,
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    destinationToken: {
      description: "The target token to bridge to",
    },
    destinationAmount: {
      description: "Amount of destination token to bridge",
    },
    onPaymentMethodSelected: {
      action: "payment method selected",
      description: "Called when user selects a wallet token or fiat provider",
    },
    onError: {
      action: "error occurred",
      description: "Called when an error occurs during the flow",
    },
    onBack: {
      action: "back clicked",
      description: "Called when user wants to go back (only shown in Step 1)",
    },
    connectLocale: {
      description: "Locale for connecting wallets",
    },
  },
} satisfies Meta<typeof PaymentSelectionWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version showing the initial wallet selection step. Click on a connected wallet to see token selection, or click 'Pay with Fiat' to see provider selection.",
      },
    },
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Dark theme version of the payment selection flow. The component starts with wallet selection and provides navigation through the 2-step process.",
      },
    },
  },
};

export const WithBackButton: Story = {
  args: {
    theme: "dark",
    onBack: () => {},
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Version with a back button in the header. The back behavior changes based on the current step - Step 1 calls onBack, Steps 2a/2b return to Step 1.",
      },
    },
  },
};

export const WithBackButtonLight: Story = {
  args: {
    theme: "light",
    onBack: () => {},
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version with back button functionality. Demonstrates the navigation flow between steps.",
      },
    },
  },
};

export const DifferentDestinationToken: Story = {
  args: {
    theme: "dark",
    destinationToken: UNI,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example with a different destination token (UNI). This will show different available origin tokens in Step 2a when a wallet is selected.",
      },
    },
  },
};

export const LargeAmount: Story = {
  args: {
    theme: "dark",
    destinationAmount: "1000",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example with a larger destination amount (1000 USDC). This may affect which origin tokens are available based on user balances.",
      },
    },
  },
};

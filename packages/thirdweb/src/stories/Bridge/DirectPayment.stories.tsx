import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import {
  DirectPayment,
  type DirectPaymentProps,
} from "../../react/web/ui/Bridge/DirectPayment.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { DIRECT_PAYMENT_UI_OPTIONS } from "./fixtures.js";

// Props interface for the wrapper component
interface DirectPaymentWithThemeProps extends DirectPaymentProps {
  theme: "light" | "dark" | Theme;
}

// Wrapper component to provide theme context
const DirectPaymentWithTheme = (props: DirectPaymentWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <ModalThemeWrapper theme={theme}>
      <DirectPayment {...componentProps} />
    </ModalThemeWrapper>
  );
};

const meta = {
  args: {
    client: storyClient,
    onContinue: (_amount, _token, _receiverAddress) => {},
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.digitalArt,
  },
  argTypes: {
    onContinue: {
      action: "continue clicked",
      description: "Called when user continues with the payment",
    },
    theme: {
      control: "select",
      description: "Theme for the component",
      options: ["light", "dark"],
    },
    uiOptions: {
      description:
        "UI configuration for direct payment mode including payment info and metadata",
    },
  },
  component: DirectPaymentWithTheme,
  parameters: {
    docs: {
      description: {
        component:
          "DirectPayment component displays a product/service purchase interface with payment details.\n\n" +
          "## Features\n" +
          "- **Product Display**: Shows product name, image, and pricing\n" +
          "- **Payment Details**: Token amount, network information, and seller address\n" +
          "- **Wallet Integration**: Connect button or continue with active wallet\n" +
          "- **Responsive Design**: Adapts to different screen sizes and themes\n" +
          "- **Fee Configuration**: Support for sender or receiver paying fees\n\n" +
          "This component is used in the 'direct_payment' mode of BridgeOrchestrator for purchasing specific items or services. It now accepts uiOptions directly to configure payment info and metadata.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Bridge/DirectPayment",
} satisfies Meta<typeof DirectPaymentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DigitalArt: Story = {
  args: {
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.digitalArt,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing a digital art NFT with ETH payment. Shows the product image, pricing in ETH, and seller information with sender paying fees.",
      },
    },
  },
};

export const DigitalArtLight: Story = {
  args: {
    theme: "light",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.digitalArt,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Light theme version of the digital art purchase interface.",
      },
    },
  },
};

export const ConcertTicket: Story = {
  args: {
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.concertTicket,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing a concert ticket with USDC payment. Shows different product type, stable token pricing, and receiver paying fees.",
      },
    },
  },
};

export const ConcertTicketLight: Story = {
  args: {
    theme: "light",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.concertTicket,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Light theme version of the concert ticket purchase.",
      },
    },
  },
};

export const SubscriptionService: Story = {
  args: {
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.subscription,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of a subscription service payment with detailed description. Shows how the component works for recurring service payments with comprehensive product information.",
      },
    },
  },
};

export const SubscriptionServiceLight: Story = {
  args: {
    theme: "light",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.subscription,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Light theme version of subscription service payment with full description text.",
      },
    },
  },
};

export const PhysicalProduct: Story = {
  args: {
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.sneakers,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing physical products with crypto payments. Shows how the component adapts to different product types with ETH payment.",
      },
    },
  },
};

export const PhysicalProductLight: Story = {
  args: {
    theme: "light",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.sneakers,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Light theme version of physical product purchase.",
      },
    },
  },
};

export const NoImage: Story = {
  args: {
    theme: "dark",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.credits,
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing digital credits without product image. Shows how the component handles text-only products with description fallback.",
      },
    },
  },
};

export const NoImageLight: Story = {
  args: {
    theme: "light",
    uiOptions: DIRECT_PAYMENT_UI_OPTIONS.credits,
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story: "Light theme version of credits purchase without image.",
      },
    },
  },
};

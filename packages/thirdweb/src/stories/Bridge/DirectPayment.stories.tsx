import type { Meta, StoryObj } from "@storybook/react";
import type { Theme } from "../../react/core/design-system/index.js";
import {
  DirectPayment,
  type DirectPaymentProps,
} from "../../react/web/ui/Bridge/DirectPayment.js";
import { ModalThemeWrapper, storyClient } from "../utils.js";
import { ETH, USDC } from "./fixtures.js";

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
  title: "Bridge/DirectPayment",
  component: DirectPaymentWithTheme,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "DirectPayment component displays a product/service purchase interface with payment details.\n\n" +
          "## Features\n" +
          "- **Product Display**: Shows product name, image, and pricing\n" +
          "- **Payment Details**: Token amount, network information, and seller address\n" +
          "- **Wallet Integration**: Connect button or continue with active wallet\n" +
          "- **Responsive Design**: Adapts to different screen sizes and themes\n\n" +
          "This component is used in the 'direct_payment' mode of BridgeOrchestrator for purchasing specific items or services.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    client: storyClient,
    onContinue: (amount, token, receiverAddress) =>
      console.log("Continue with payment:", {
        amount,
        token,
        receiverAddress,
      }),
    theme: "dark",
  },
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "Theme for the component",
    },
    onContinue: {
      action: "continue clicked",
      description: "Called when user continues with the payment",
    },
    paymentInfo: {
      description:
        "Payment information including token, amount, seller, and metadata",
    },
  },
} satisfies Meta<typeof DirectPaymentWithTheme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DigitalArt: Story = {
  args: {
    theme: "dark",
    paymentInfo: {
      sellerAddress: "0x1234567890123456789012345678901234567890",
      token: ETH,
      amount: "0.1",
      feePayer: "sender",
      metadata: {
        name: "Premium Digital Art NFT",
        image:
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&h=300&fit=crop",
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing a digital art NFT with ETH payment. Shows the product image, pricing in ETH, and seller information.",
      },
    },
  },
};

export const DigitalArtLight: Story = {
  args: {
    theme: "light",
    paymentInfo: {
      sellerAddress: "0x1234567890123456789012345678901234567890",
      token: ETH,
      amount: "0.1",
      feePayer: "sender",
      metadata: {
        name: "Premium Digital Art NFT",
        image:
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500&h=300&fit=crop",
      },
    },
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
    paymentInfo: {
      sellerAddress: "0x2247d5d238d0f9d37184d8332aE0289d1aD9991b",
      token: USDC,
      amount: "25.00",
      feePayer: "receiver",
      metadata: {
        name: "Concert Ticket - The Midnight Live",

        image:
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&h=300&fit=crop",
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing a concert ticket with USDC payment. Shows different product type and stable token pricing.",
      },
    },
  },
};

export const SubscriptionService: Story = {
  args: {
    theme: "light",
    paymentInfo: {
      sellerAddress: "0x9876543210987654321098765432109876543210",
      token: USDC,
      amount: "9.99",
      feePayer: "sender",
      metadata: {
        name: "Premium Streaming Service - Monthly",
        image:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop",
      },
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Example of a subscription service payment. Shows how the component works for recurring service payments.",
      },
    },
  },
};

export const SubscriptionServiceWithDescription: Story = {
  args: {
    theme: "light",
    paymentInfo: {
      sellerAddress: "0x9876543210987654321098765432109876543210",
      token: USDC,
      amount: "9.99",
      feePayer: "sender",
      metadata: {
        name: "Premium Streaming Service - Monthly",
        image:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=300&fit=crop",
        description:
          "Get unlimited access to our premium streaming service with this monthly subscription. Enjoy ad-free viewing, exclusive content, and the ability to download shows for offline viewing.",
      },
    },
  },
  parameters: {
    backgrounds: { default: "light" },
    docs: {
      description: {
        story:
          "Example of a subscription service payment. Shows how the component works for recurring service payments.",
      },
    },
  },
};

export const PhysicalProduct: Story = {
  args: {
    theme: "dark",
    paymentInfo: {
      sellerAddress: "0x5555666677778888999900001111222233334444",
      token: ETH,
      amount: "0.05",
      feePayer: "receiver",
      metadata: {
        name: "Limited Edition Sneakers",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing physical products with crypto payments. Shows how the component adapts to different product types.",
      },
    },
  },
};

export const NoImage: Story = {
  args: {
    theme: "dark",
    paymentInfo: {
      sellerAddress: "0x5555666677778888999900001111222233334444",
      token: USDC,
      amount: "25",
      feePayer: "receiver",
      metadata: {
        name: "Thirdweb Credits",
        description:
          "Add credits to your account for future billing cycles. Credits are non-refundable and do not expire.",
      },
    },
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Example of purchasing physical products with crypto payments. Shows how the component adapts to different product types.",
      },
    },
  },
};

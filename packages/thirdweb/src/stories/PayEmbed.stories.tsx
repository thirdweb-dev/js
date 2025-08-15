import type { Meta } from "@storybook/react-vite";
import { base } from "../chains/chain-definitions/base.js";
import { polygon } from "../chains/chain-definitions/polygon.js";
import { lightTheme } from "../react/core/design-system/index.js";
import { PayEmbed } from "../react/web/ui/PayEmbed.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
import { toWei } from "../utils/units.js";
import { storyClient } from "./utils.js";

const meta = {
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Connect/PayEmbed",
} satisfies Meta<typeof PayEmbed>;

export function BasicUsage() {
  return <PayEmbed client={storyClient} />;
}

export function BasicUsageWithMetadata() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        metadata: {
          name: "this is a title",
          // This is not shown in UI - TODO fix this
          description: "this is a description",
        },
      }}
    />
  );
}

export function FundWallet() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "fund_wallet",
      }}
    />
  );
}

export function FundWalletWithMetadata() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "fund_wallet",
        metadata: {
          name: "this is a title",
          // This is not shown in UI - TODO fix this
          description: "this is a description",
        },
      }}
    />
  );
}

export function FundWalletWithOptions() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "fund_wallet",
        prefillBuy: {
          amount: "0.123",
          chain: polygon,
        },
      }}
    />
  );
}

export function FundWalletERC20() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "fund_wallet",
        prefillBuy: {
          amount: "0.123",
          chain: base,
          token: {
            address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
            name: "USDC",
            // This icon is not being used - TODO fix this, either remove this prop or use it
            icon: "https://picsum.photos/200/200",
          },
        },
      }}
    />
  );
}

export function DirectPayment() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "direct_payment",
        paymentInfo: {
          amount: "0.123",
          chain: polygon,
          sellerAddress: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
        },
      }}
    />
  );
}

export function DirectPaymentERC20() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "direct_payment",
        paymentInfo: {
          amount: "0.123",
          chain: base,
          sellerAddress: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
          token: {
            address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
            name: "USDC",
            // This icon is not being used - TODO fix this, either remove this prop or use it
            icon: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png",
          },
        },
      }}
    />
  );
}

export function DirectPaymentWithMetadata() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "direct_payment",
        paymentInfo: {
          amount: "0.123",
          chain: polygon,
          sellerAddress: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
        },
        metadata: {
          name: "this is a title",
          description: "this is a description",
        },
      }}
    />
  );
}

export function Transaction() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        mode: "transaction",
        transaction: prepareTransaction({
          to: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
          chain: polygon,
          client: storyClient,
          value: toWei("0.123"),
        }),
      }}
    />
  );
}

export function TransactionWithMetadata() {
  return (
    <PayEmbed
      client={storyClient}
      payOptions={{
        metadata: {
          name: "this is a title",
          description: "this is a description",
        },
        mode: "transaction",
        transaction: prepareTransaction({
          to: "0x83Dd93fA5D8343094f850f90B3fb90088C1bB425",
          chain: polygon,
          client: storyClient,
          value: toWei("0.123"),
        }),
      }}
    />
  );
}

export function LightMode() {
  return <PayEmbed client={storyClient} theme="light" />;
}

export function CustomLightTheme() {
  return (
    <PayEmbed
      client={storyClient}
      theme={lightTheme({
        colors: {
          modalBg: "#FFFFF0",
          tertiaryBg: "#DBE4C9",
          borderColor: "#8AA624",
          secondaryText: "#3E3F29",
          accentText: "#E43636",
        },
      })}
    />
  );
}

export default meta;

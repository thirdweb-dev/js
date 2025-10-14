import type { Meta, StoryObj } from "@storybook/nextjs";
import type { Status } from "thirdweb/bridge";
import { storybookThirdwebClient } from "@/storybook/utils";
import { BridgeStatus } from "./bridge-status";

const meta = {
  component: BridgeStatus,
  title: "chain/tx/bridge-status",
  decorators: [
    (Story) => (
      <div className="container max-w-6xl py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BridgeStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

const completedStatus: Status = {
  status: "COMPLETED",
  paymentId:
    "0x8e0a0d9c0254a75a3004a28e0fb69bae7f2d659938ddd461753627270930db60",
  originAmount: 129935n,
  destinationAmount: 100000n,
  transactions: [
    {
      chainId: 42161,
      transactionHash:
        "0x37daf698878e73590adb2d6f833e810304a9981829ad983fb355245af1183107",
    },
    {
      chainId: 8453,
      transactionHash:
        "0xc72abba2761bb48f605125dc12c17b15088303db960816fa12316f0c90796417",
    },
  ],
  originChainId: 42161,
  originTokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  originToken: {
    chainId: 42161,
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    iconUri: "https://ethereum-optimism.github.io/data/USDC/logo.png",
  },
  destinationChainId: 8453,
  destinationTokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  destinationToken: {
    chainId: 8453,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    iconUri:
      "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
  },
  sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
  receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
};

const pendingStatus: Status = {
  ...completedStatus,
  status: "PENDING",
};

const failedStatus: Status = {
  ...completedStatus,
  status: "FAILED",
};

const notFoundStatus: Status = {
  ...completedStatus,
  status: "NOT_FOUND",
  transactions: [],
};

export const Completed: Story = {
  args: {
    bridgeStatus: completedStatus,
    client: storybookThirdwebClient,
  },
};

export const Pending: Story = {
  args: {
    bridgeStatus: pendingStatus,
    client: storybookThirdwebClient,
  },
};

export const Failed: Story = {
  args: {
    bridgeStatus: failedStatus,
    client: storybookThirdwebClient,
  },
};

export const NotFound: Story = {
  args: {
    bridgeStatus: notFoundStatus,
    client: storybookThirdwebClient,
  },
};

export const WithPurchaseData: Story = {
  args: {
    bridgeStatus: {
      ...completedStatus,
      purchaseData: {
        userId: "68d645b7ded999651272bf1e",
        credits: 32000,
        transactionId: "fd2606d1-90df-45c6-bd2c-b19a34764a31",
      },
    },
    client: storybookThirdwebClient,
  },
};

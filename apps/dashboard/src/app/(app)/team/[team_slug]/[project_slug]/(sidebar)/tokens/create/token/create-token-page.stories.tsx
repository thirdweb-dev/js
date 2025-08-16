import type { Meta, StoryObj } from "@storybook/nextjs";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { storybookThirdwebClient } from "@/storybook/utils";
import {
  CreateTokenAssetPageUI,
  type CreateTokenFunctions,
} from "./create-token-page.client";

const meta = {
  component: CreateTokenAssetPageUI,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container max-w-5xl py-10">
          <Story />
          <div className="h-10" />
          <ConnectButton client={storybookThirdwebClient} />
        </div>
      </ThirdwebProvider>
    ),
  ],
  title: "Assets/CreateTokenPage",
} satisfies Meta<typeof CreateTokenAssetPageUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCreateTokenFunctions: CreateTokenFunctions = {
  ERC20Asset: {
    airdropTokens: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    approveAirdropTokens: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    deployContract: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { contractAddress: "0x123" };
    },
  },
  DropERC20: {
    airdropTokens: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    deployContract: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" };
    },
    setClaimConditions: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    mintTokens: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  },
};

export const Default: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    client: storybookThirdwebClient,
    createTokenFunctions: mockCreateTokenFunctions,
    onLaunchSuccess: () => {},
    projectSlug: "test-project",
    teamPlan: "free",
    teamSlug: "test-team",
  },
};

export const ErrorOnDeploy: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    client: storybookThirdwebClient,
    createTokenFunctions: {
      ...mockCreateTokenFunctions,
      ERC20Asset: {
        ...mockCreateTokenFunctions.ERC20Asset,
        deployContract: async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          throw new Error("Failed to deploy contract");
        },
      },
    },
    onLaunchSuccess: () => {},
    projectSlug: "test-project",
    teamPlan: "free",
    teamSlug: "test-team",
  },
};

export const StorageErrorOnDeploy: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    client: storybookThirdwebClient,
    createTokenFunctions: {
      ...mockCreateTokenFunctions,
      ERC20Asset: {
        ...mockCreateTokenFunctions.ERC20Asset,
        deployContract: async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          throw new Error(
            "You have reached your storage limit. Please add a valid payment method to continue using the service.",
          );
        },
      },
    },
    onLaunchSuccess: () => {},
    projectSlug: "test-project",
    teamPlan: "free",
    teamSlug: "test-team",
  },
};

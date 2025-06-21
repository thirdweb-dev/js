import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookThirdwebClient } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { CreateTokenAssetPageUI } from "./create-token-page.client";

const meta = {
  component: CreateTokenAssetPageUI,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <div className="container max-w-5xl py-10">
          <ConnectButton client={storybookThirdwebClient} />
          <div className="h-10" />
          <Story />
        </div>
      </ThirdwebProvider>
    ),
  ],
  title: "Assets/CreateTokenPage",
} satisfies Meta<typeof CreateTokenAssetPageUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCreateTokenFunctions = {
  airdropTokens: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  deployContract: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { contractAddress: "0x123" };
  },
  mintTokens: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  setClaimConditions: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};

export const Default: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    client: storybookThirdwebClient,
    createTokenFunctions: mockCreateTokenFunctions,
    onLaunchSuccess: () => {},
    projectSlug: "test-project",
    teamSlug: "test-team",
  },
};

export const ErrorOnDeploy: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    client: storybookThirdwebClient,
    createTokenFunctions: {
      ...mockCreateTokenFunctions,
      deployContract: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error("Failed to deploy contract");
      },
    },
    onLaunchSuccess: () => {},
    projectSlug: "test-project",
    teamSlug: "test-team",
  },
};

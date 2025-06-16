import type { Meta, StoryObj } from "@storybook/nextjs";
import { storybookThirdwebClient } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import {
  CreateTokenAssetPageUI,
  type CreateTokenFunctions,
} from "./create-token-page.client";

const meta = {
  title: "Assets/CreateTokenPage",
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
} satisfies Meta<typeof CreateTokenAssetPageUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCreateTokenFunctions: CreateTokenFunctions = {
  deployContract: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { contractAddress: "0x123" };
  },
  airdropTokens: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};

export const Default: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    teamSlug: "test-team",
    projectSlug: "test-project",
    client: storybookThirdwebClient,
    createTokenFunctions: mockCreateTokenFunctions,
    onLaunchSuccess: () => {},
  },
};

export const ErrorOnDeploy: Story = {
  args: {
    accountAddress: "0x1234567890123456789012345678901234567890",
    teamSlug: "test-team",
    projectSlug: "test-project",
    client: storybookThirdwebClient,
    onLaunchSuccess: () => {},
    createTokenFunctions: {
      ...mockCreateTokenFunctions,
      deployContract: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error("Failed to deploy contract");
      },
    },
  },
};

import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { accountStub } from "../../../../../stories/stubs";
import { examplePrompts } from "../../data/examplePrompts";
import { NebulaFloatingChatButton } from "./FloatingChat";

const meta = {
  title: "Nebula/FloatingChat",
  component: NebulaFloatingChatButton,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <Story />
      </ThirdwebProvider>
    ),
  ],
} satisfies Meta<typeof NebulaFloatingChatButton>;

export default meta;
type Story = StoryObj<typeof NebulaFloatingChatButton>;

const client = getThirdwebClient();

export const LoggedIn: Story = {
  args: {
    account: accountStub(),
    authToken: "foo",
    nebulaParams: undefined,
    label: "Ask AI about this contract",
    examplePrompts: examplePrompts,
    client,
  },
};

export const LoggedOut: Story = {
  args: {
    account: undefined,
    authToken: undefined,
    nebulaParams: undefined,
    label: "Ask AI about this contract",
    examplePrompts: examplePrompts,
    client,
  },
};

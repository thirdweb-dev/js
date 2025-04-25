import type { Meta, StoryObj } from "@storybook/react";
import { storybookThirdwebClient } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { examplePrompts } from "../../data/examplePrompts";
import { NebulaChatButton } from "./FloatingChat";

const meta = {
  title: "Nebula/FloatingChat",
  component: NebulaChatButton,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <Story />
      </ThirdwebProvider>
    ),
  ],
} satisfies Meta<typeof NebulaChatButton>;

export default meta;
type Story = StoryObj<typeof NebulaChatButton>;

export const LoggedIn: Story = {
  args: {
    authToken: "foo",
    nebulaParams: undefined,
    label: "Ask AI about this contract",
    examplePrompts: examplePrompts,
    client: storybookThirdwebClient,
  },
};

export const LoggedOut: Story = {
  args: {
    authToken: undefined,
    nebulaParams: undefined,
    label: "Ask AI about this contract",
    examplePrompts: examplePrompts,
    client: storybookThirdwebClient,
  },
};

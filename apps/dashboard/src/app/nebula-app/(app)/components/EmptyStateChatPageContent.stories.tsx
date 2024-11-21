import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../../stories/utils";
import { EmptyStateChatPageContent } from "./EmptyStateChatPageContent";

const meta = {
  title: "Nebula/EmptyStateChatPage",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <div className="container flex max-w-[800px] grow flex-col justify-center overflow-hidden">
      <EmptyStateChatPageContent
        config={{
          mode: "client",
          signer_wallet_address: "xxxxx",
        }}
        sendMessage={() => {}}
        updateConfig={() => {}}
      />
    </div>
  );
}

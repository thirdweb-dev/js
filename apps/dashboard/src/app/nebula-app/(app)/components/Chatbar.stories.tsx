import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { Chatbar } from "./ChatBar";

const meta = {
  title: "Nebula/Chatbar",
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
    <div className="container flex max-w-[800px] flex-col gap-14 py-10">
      <BadgeContainer label="Not Streaming">
        <Chatbar
          abortChatStream={() => {}}
          isChatStreaming={false}
          sendMessage={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Streaming ">
        <Chatbar
          abortChatStream={() => {}}
          isChatStreaming={true}
          sendMessage={() => {}}
        />
      </BadgeContainer>
    </div>
  );
}

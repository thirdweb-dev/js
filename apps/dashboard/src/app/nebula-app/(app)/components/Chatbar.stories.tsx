import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "../../../../stories/utils";
import { ChatBar } from "./ChatBar";

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

export const Variants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-14 py-10">
      <BadgeContainer label="Not Streaming">
        <ChatBar
          abortChatStream={() => {}}
          isChatStreaming={false}
          sendMessage={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Streaming ">
        <ChatBar
          abortChatStream={() => {}}
          isChatStreaming={true}
          sendMessage={() => {}}
        />
      </BadgeContainer>
    </div>
  );
}

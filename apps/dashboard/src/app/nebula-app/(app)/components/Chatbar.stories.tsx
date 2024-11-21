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
      <BadgeContainer label="Not Streaming - Client Config">
        <Chatbar
          abortChatStream={() => {}}
          config={{
            mode: "client",
            signer_wallet_address: "xxxxx",
          }}
          isChatStreaming={false}
          sendMessage={() => {}}
          updateConfig={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Streaming - Client Config">
        <Chatbar
          abortChatStream={() => {}}
          config={{
            mode: "client",
            signer_wallet_address: "xxxxx",
          }}
          isChatStreaming={true}
          sendMessage={() => {}}
          updateConfig={() => {}}
        />
      </BadgeContainer>

      <BadgeContainer label="Not Streaming - Engine Config">
        <Chatbar
          abortChatStream={() => {}}
          config={{
            mode: "engine",
            engine_authorization_token: "xxxxx",
            engine_backend_wallet_address: "0x1234",
            engine_url: "https://some-engine-url.com",
          }}
          isChatStreaming={false}
          sendMessage={() => {}}
          updateConfig={() => {}}
        />
      </BadgeContainer>
    </div>
  );
}

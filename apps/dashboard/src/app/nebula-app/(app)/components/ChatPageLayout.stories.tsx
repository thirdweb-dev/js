import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { randomLorem } from "../../../../stories/stubs";
import type { TruncatedSessionInfo } from "../api/types";
import { ChatPageLayout } from "./ChatPageLayout";

const meta = {
  title: "Nebula/ChatPageLayout",
  component: Variant,
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <Story />
      </ThirdwebProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoRecentChats: Story = {
  args: {
    sessions: [],
  },
};

export const ThreeChats: Story = {
  args: {
    sessions: generateRandomSessions(3),
  },
};

export const ThirtyChats: Story = {
  args: {
    sessions: generateRandomSessions(30),
  },
};

function generateRandomSessions(count: number): TruncatedSessionInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i.toString(),
    title: randomLorem(Math.floor(Math.random() * 10) + 1),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function Variant(props: {
  sessions: TruncatedSessionInfo[];
}) {
  return (
    <ChatPageLayout
      accountAddress="0xC569B9FD77d132e10954cA5E6EF617414e314b11"
      authToken="xxxxx"
      sessions={props.sessions}
    >
      <div className="flex h-full w-full items-center justify-center">
        CHILDREN
      </div>
    </ChatPageLayout>
  );
}

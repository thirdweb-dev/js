import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThirdwebProvider } from "thirdweb/react";
import { projectStub, randomLorem } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import type { TruncatedSessionInfo } from "../api/types";
import { ChatPageLayout } from "./ChatPageLayout";

const meta = {
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
  title: "AI/ChatPageLayout",
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
    created_at: new Date().toISOString(),
    id: i.toString(),
    title: randomLorem(Math.floor(Math.random() * 10) + 1),
    updated_at: new Date().toISOString(),
  }));
}

function Variant(props: { sessions: TruncatedSessionInfo[] }) {
  return (
    <ChatPageLayout
      accountAddress="0xC569B9FD77d132e10954cA5E6EF617414e314b11"
      authToken="xxxxx"
      sessions={props.sessions}
      project={projectStub("xxxxx", "team-1")}
      client={storybookThirdwebClient}
      team_slug="team-1"
    >
      <div className="flex h-full w-full items-center justify-center">
        CHILDREN
      </div>
    </ChatPageLayout>
  );
}

import type { Meta, StoryObj } from "@storybook/nextjs";
import { subDays } from "date-fns";
import { ThirdwebProvider } from "thirdweb/react";
import { projectStub, randomLorem } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import { ChatPageLayout } from "../../components/ChatPageLayout";
import { ChatHistoryPageUI } from "./ChatHistoryPage";

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
  title: "AI/history",
} satisfies Meta<typeof Variant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TenChats: Story = {
  args: {
    length: 10,
  },
};

export const ZeroChats: Story = {
  args: {
    length: 0,
  },
};

export const OneChat: Story = {
  args: {
    length: 1,
  },
};

export const PrefillSearch: Story = {
  args: {
    length: 10,
    prefillSearch: "xxxxxxxxxxxx",
  },
};

function createRandomSessions(length: number) {
  const sessions = [];
  for (let i = 0; i < length; i++) {
    sessions.push({
      created_at: new Date().toISOString(),
      id: Math.random().toString(),
      title: randomLorem(Math.floor(5 + Math.random() * 15)),
      updated_at: subDays(
        new Date(),
        Math.floor(Math.random() * 10),
      ).toISOString(),
    });
  }

  return sessions;
}

function Variant(props: { length: number; prefillSearch?: string }) {
  return (
    <ChatPageLayout
      accountAddress="0x1234567890"
      authToken="xxxxxxxx"
      sessions={createRandomSessions(props.length)}
      project={projectStub("xxxxx", "team-1")}
      client={storybookThirdwebClient}
      team_slug="team-1"
    >
      <ChatHistoryPageUI
        deleteSession={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        prefillSearch={props.prefillSearch}
        sessions={createRandomSessions(props.length)}
        team_slug="team-1"
        project={projectStub("xxxxx", "team-1")}
      />
    </ChatPageLayout>
  );
}

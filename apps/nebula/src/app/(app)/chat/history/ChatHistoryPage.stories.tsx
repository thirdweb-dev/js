import { randomLorem } from "@/storybook/stubs";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { subDays } from "date-fns";
import { ThirdwebProvider } from "thirdweb/react";
import { ChatPageLayout } from "../../components/ChatPageLayout";
import { ChatHistoryPageUI } from "./ChatHistoryPage";

const meta = {
  title: "Nebula/history",
  component: Variant,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThirdwebProvider>
        <Story />
      </ThirdwebProvider>
    ),
  ],
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
      updated_at: subDays(
        new Date(),
        Math.floor(Math.random() * 10),
      ).toISOString(),
      title: randomLorem(Math.floor(5 + Math.random() * 15)),
    });
  }

  return sessions;
}

function Variant(props: {
  length: number;
  prefillSearch?: string;
}) {
  return (
    <ChatPageLayout
      accountAddress="0x1234567890"
      authToken="xxxxxxxx"
      sessions={createRandomSessions(props.length)}
    >
      <ChatHistoryPageUI
        sessions={createRandomSessions(props.length)}
        prefillSearch={props.prefillSearch}
        deleteSession={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </ChatPageLayout>
  );
}

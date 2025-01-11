import type { Meta, StoryObj } from "@storybook/react";
import { subDays } from "date-fns";
import { ThirdwebProvider } from "thirdweb/react";
import { accountStub, randomLorem } from "../../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../../stories/utils";
import { ChatPageLayout } from "../../components/ChatPageLayout";
import { ChatHistoryPageUI } from "./ChatHistoryPage";

const meta = {
  title: "Nebula/history",
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
  args: {
    length: 10,
  },
};

export const Mobile: Story = {
  args: {
    length: 10,
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
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

function Story() {
  return (
    <ThirdwebProvider>
      <div className="flex flex-col gap-10 py-10">
        <BadgeContainer label="10 chats">
          <Variant length={10} />
        </BadgeContainer>

        <BadgeContainer label="0 chats">
          <Variant length={0} />
        </BadgeContainer>

        <BadgeContainer label="1 chat">
          <Variant length={1} />
        </BadgeContainer>

        <BadgeContainer label="No search result">
          <Variant length={10} prefillSearch="xxxxxxxxxxxx" />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  length: number;
  prefillSearch?: string;
}) {
  return (
    <ChatPageLayout
      account={accountStub()}
      accountAddress="0x1234567890"
      authToken="xxxxxxxx"
      sessions={createRandomSessions(props.length)}
      className="h-[700px] border-b lg:h-[800px]"
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

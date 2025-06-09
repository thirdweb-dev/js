import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import type { SessionInfo } from "../api/types";
import { ShareChatDialogUI } from "./ShareChatDialog";

const meta = {
  title: "Nebula/ShareChatDialog",
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

const sessionBase = {
  id: "123",
  account_id: "123",
  modal_name: "test",
  archive_at: null,
  can_execute: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  history: [],
  title: "Fake Public Session",
  deleted_at: null,
  archived_at: null,
  context: {
    chain_ids: ["1", "137", "10", "146", "80094"],
    wallet_address: null,
  },
};

const publicSession: SessionInfo = {
  ...sessionBase,
  is_public: true,
};

const privateSession: SessionInfo = {
  ...sessionBase,
  is_public: false,
};

function Story() {
  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[800px] flex-col gap-14 py-10">
        <Variant label="With Public Session" session={publicSession} />
        <Variant label="With Private Session" session={privateSession} />
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  label: string;
  session: SessionInfo;
}) {
  return (
    <BadgeContainer label={props.label}>
      <ShareChatDialogUI session={props.session} />
    </BadgeContainer>
  );
}

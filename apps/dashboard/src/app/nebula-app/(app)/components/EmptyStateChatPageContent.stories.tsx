import type { Meta, StoryObj } from "@storybook/react";
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

export const Default: Story = {
  args: {
    prefillMessage: undefined,
  },
};

export const PrefilledMessage: Story = {
  args: {
    prefillMessage: "This is a prefilled message",
  },
};

function Story(props: {
  prefillMessage: string | undefined;
}) {
  return (
    <div className="container flex max-w-[800px] grow flex-col justify-center overflow-hidden">
      <EmptyStateChatPageContent
        sendMessage={() => {}}
        prefillMessage={props.prefillMessage}
      />
    </div>
  );
}

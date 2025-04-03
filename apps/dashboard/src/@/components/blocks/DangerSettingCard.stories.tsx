import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "../../../stories/utils";
import { DangerSettingCard } from "./DangerSettingCard";

const meta = {
  title: "blocks/Cards/DangerSettingCard",
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
    <div className="container flex max-w-[1000px] flex-col gap-8 py-10">
      <BadgeContainer label="Base">
        <DangerSettingCard
          title="This is a title"
          description="This is a description"
          buttonLabel="Some Action"
          buttonOnClick={() => {}}
          isPending={false}
          confirmationDialog={{
            title: "This is confirmation title",
            description: "This is confirmation description",
          }}
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <DangerSettingCard
          title="This is a title"
          description="This is a description"
          buttonLabel="Some Action"
          buttonOnClick={() => {}}
          isPending={true}
          confirmationDialog={{
            title: "This is confirmation title",
            description: "This is confirmation description",
          }}
        />
      </BadgeContainer>
    </div>
  );
}

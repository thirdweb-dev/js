import type { Meta, StoryObj } from "@storybook/nextjs";
import { BadgeContainer } from "@/storybook/utils";
import { DangerSettingCard } from "./DangerSettingCard";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/Cards/DangerSettingCard",
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
          buttonLabel="Some Action"
          buttonOnClick={() => {}}
          confirmationDialog={{
            description: "This is confirmation description",
            title: "This is confirmation title",
          }}
          description="This is a description"
          isPending={false}
          title="This is a title"
        />
      </BadgeContainer>

      <BadgeContainer label="Loading">
        <DangerSettingCard
          buttonLabel="Some Action"
          buttonOnClick={() => {}}
          confirmationDialog={{
            description: "This is confirmation description",
            title: "This is confirmation title",
          }}
          description="This is a description"
          isPending={true}
          title="This is a title"
        />
      </BadgeContainer>
    </div>
  );
}

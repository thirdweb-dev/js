import type { Meta, StoryObj } from "@storybook/react";
import { BadgeContainer } from "../../../../../../../stories/utils";
import { DangerSettingCard } from "./DangerSettingCard";

const meta = {
  title: "Team/Settings/components/DangerCard",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {},
};

function Story() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="lg:p-10 container max-w-[1000px] flex flex-col gap-8">
        <BadgeContainer label="Base">
          <DangerSettingCard
            title="This is a title"
            description="This is a description"
            buttonLabel="Some Action"
            buttonOnClick={() => {}}
            isLoading={false}
          />
        </BadgeContainer>

        <BadgeContainer label="Loading">
          <DangerSettingCard
            title="This is a title"
            description="This is a description"
            buttonLabel="Some Action"
            buttonOnClick={() => {}}
            isLoading={true}
          />
        </BadgeContainer>
      </div>
    </div>
  );
}

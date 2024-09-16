import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { AccountTeamsUI } from "./AccountTeamsUI";

const meta = {
  title: "Account/Pages/Teams",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    type: "desktop",
  },
};

export const Mobile: Story = {
  args: {
    type: "mobile",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Variants() {
  return (
    <div className="container py-10 max-w-[1100px] mx-auto w-full flex flex-col gap-10">
      <BadgeContainer label="4 Teams">
        <AccountTeamsUI
          teamsWithRole={[
            {
              team: teamStub("1", "free"),
              role: "MEMBER",
            },
            {
              team: teamStub("2", "pro"),
              role: "OWNER",
            },
            {
              team: teamStub("3", "growth"),
              role: "MEMBER",
            },
            {
              team: teamStub("4", "growth"),
              role: "MEMBER",
            },
          ]}
        />
      </BadgeContainer>

      <BadgeContainer label="1 Team">
        <AccountTeamsUI
          teamsWithRole={[
            {
              team: teamStub("1", "free"),
              role: "MEMBER",
            },
          ]}
        />
      </BadgeContainer>
    </div>
  );
}

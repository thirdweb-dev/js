import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
  storybookThirdwebClient,
} from "stories/utils";
import { AccountTeamsUI } from "./AccountTeamsUI";

const meta = {
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Account/Pages/Teams",
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
    <div className="container mx-auto flex w-full max-w-[1100px] flex-col gap-10 py-10">
      <BadgeContainer label="4 Teams">
        <AccountTeamsUI
          client={storybookThirdwebClient}
          teamsWithRole={[
            {
              role: "MEMBER",
              team: teamStub("1", "free"),
            },
            {
              role: "OWNER",
              team: teamStub("2", "pro"),
            },
            {
              role: "MEMBER",
              team: teamStub("3", "growth"),
            },
            {
              role: "MEMBER",
              team: teamStub("4", "growth"),
            },
          ]}
        />
      </BadgeContainer>

      <BadgeContainer label="1 Team">
        <AccountTeamsUI
          client={storybookThirdwebClient}
          teamsWithRole={[
            {
              role: "MEMBER",
              team: teamStub("1", "free"),
            },
          ]}
        />
      </BadgeContainer>
    </div>
  );
}

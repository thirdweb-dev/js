import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "stories/stubs";
import { storybookThirdwebClient } from "stories/utils";
import {
  DeleteTeamCard,
  LeaveTeamCard,
  TeamGeneralSettingsPageUI,
} from "./TeamGeneralSettingsPageUI";

const meta = {
  title: "Team/Settings/General",
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

const testTeam = teamStub("foo", "free");

function Story() {
  return (
    <div className="container max-w-6xl py-10">
      <TeamGeneralSettingsPageUI
        team={testTeam}
        updateTeamImage={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        updateTeamField={async (value) => {
          console.log(value);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        client={storybookThirdwebClient}
        leaveTeam={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
      <ComponentVariants />
    </div>
  );
}

function ComponentVariants() {
  return (
    <div className="border-border border-t pt-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-5 text-3xl"> Component variations </h2>
        <div className="flex flex-col gap-6">
          <LeaveTeamCard
            teamName="foo"
            leaveTeam={async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }}
          />
          <DeleteTeamCard enabled={true} teamName="foo" />
          <DeleteTeamCard enabled={false} teamName="foo" />
        </div>
      </div>
    </div>
  );
}

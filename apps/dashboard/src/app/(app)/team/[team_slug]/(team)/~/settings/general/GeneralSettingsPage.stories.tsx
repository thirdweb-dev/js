import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import {
  DeleteTeamCard,
  LeaveTeamCard,
  TeamGeneralSettingsPageUI,
} from "./TeamGeneralSettingsPageUI";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Team/Settings/General",
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
        client={storybookThirdwebClient}
        initialVerification={null}
        isOwnerAccount={true}
        leaveTeam={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        team={testTeam}
        updateTeamField={async (value) => {
          console.log(value);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        updateTeamImage={async () => {
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
            leaveTeam={async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }}
            teamName="foo"
          />
          <DeleteTeamCard canDelete={true} teamId="1" teamName="foo" />
          <DeleteTeamCard canDelete={false} teamId="2" teamName="foo" />
        </div>
      </div>
    </div>
  );
}

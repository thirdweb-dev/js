import { Toaster } from "@/components/ui/sonner";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../../../../../stories/stubs";
import { mobileViewport } from "../../../../../../../stories/utils";
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

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

const testTeam = teamStub("foo", "free");

function Story() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <TeamGeneralSettingsPageUI
        team={testTeam}
        updateTeamImage={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        updateTeamField={async (value) => {
          console.log(value);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        client={getThirdwebClient()}
      />
      <ComponentVariantions />
      <Toaster richColors />
    </div>
  );
}

function ComponentVariantions() {
  return (
    <div className="border-border border-t p-6 pt-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-5 text-3xl"> Component variations </h2>
        <div className="flex flex-col gap-6">
          <LeaveTeamCard enabled={true} teamName="foo" />
          <LeaveTeamCard enabled={false} teamName="foo" />
          <DeleteTeamCard enabled={true} teamName="foo" />
          <DeleteTeamCard enabled={false} teamName="foo" />
        </div>
      </div>
    </div>
  );
}

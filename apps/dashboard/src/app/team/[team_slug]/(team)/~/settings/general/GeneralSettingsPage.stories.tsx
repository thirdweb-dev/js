import type { Team } from "@/api/team";
import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../../../../../stories/utils";
import {
  DeleteTeamCard,
  GeneralSettingsPage,
  LeaveTeamCard,
} from "./GeneralSettingsPage";

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

const testTeam: Team = {
  id: "team-id-foo-bar",
  name: "Team XYZ",
  slug: "team-slug-foo-bar",
  createdAt: "2023-07-07T19:21:33.604Z",
  updatedAt: "2024-07-11T00:01:02.241Z",
  deletedAt: null,
  bannedAt: null,
  billingStatus: "validPayment",
  billingPlan: "free",
};

function Story() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <GeneralSettingsPage team={testTeam} />
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

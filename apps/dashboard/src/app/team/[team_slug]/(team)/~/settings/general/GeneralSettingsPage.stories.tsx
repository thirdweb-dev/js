import type { Team } from "@/api/team";
import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import SettingsLayout from "../layout";
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

export const AllVariants: Story = {
  args: {},
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
    <div className="bg-background min-h-screen text-foreground">
      <SettingsLayout
        params={{
          team_slug: testTeam.slug,
        }}
      >
        <GeneralSettingsPage team={testTeam} />
      </SettingsLayout>

      <ComponentVariantions />

      <Toaster richColors />
    </div>
  );
}

function ComponentVariantions() {
  return (
    <div className="pt-20 border-t p-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="mb-5 text-3xl"> Component variations </h2>
        <div className="flex flex-col gap-6">
          <LeaveTeamCard enabled={true} />
          <LeaveTeamCard enabled={false} />
          <DeleteTeamCard enabled={true} />
          <DeleteTeamCard enabled={false} />
        </div>
      </div>
    </div>
  );
}

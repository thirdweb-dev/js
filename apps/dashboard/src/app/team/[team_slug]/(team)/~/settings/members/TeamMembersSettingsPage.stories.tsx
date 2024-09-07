import type { Team } from "@/api/team";
import type { TeamAccountRole, TeamMember } from "@/api/team-members";
import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../stories/utils";
import SettingsLayout from "../layout";
import { InviteSection } from "./InviteSection";
import { ManageMembersSection } from "./ManageMembersSection";
import { TeamMembersSettingsPage } from "./TeamMembersSettingsPage";

const meta = {
  title: "Team/Settings/Members",
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

const freeTeam: Team = {
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

const proTeam: Team = {
  id: "team-id-foo-bar",
  name: "Team XYZ",
  slug: "team-slug-foo-bar",
  createdAt: "2023-07-07T19:21:33.604Z",
  updatedAt: "2024-07-11T00:01:02.241Z",
  deletedAt: null,
  bannedAt: null,
  billingStatus: "validPayment",
  billingPlan: "pro",
};

function createMemberStub(id: string, role: TeamAccountRole): TeamMember {
  const date = new Date();
  // add random time to the date
  date.setHours(Math.floor(Math.random() * 24));

  const member: TeamMember = {
    account: {
      email: `user-${id}@foo.com`,
      name: `username-${id}`,
    },
    accountId: `account-id-${id}`,
    createdAt: date,
    deletedAt: null,
    role: role,
    teamId: "team-id-foo-bar",
    updatedAt: new Date(),
  };

  return member;
}

const membersStub: TeamMember[] = [
  createMemberStub("1", "OWNER"),
  createMemberStub("2", "MEMBER"),
  createMemberStub("3", "OWNER"),
];

function Story() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <SettingsLayout
        params={{
          team_slug: freeTeam.slug,
        }}
      >
        <TeamMembersSettingsPage
          team={proTeam}
          userHasEditPermission={true}
          members={membersStub}
        />
      </SettingsLayout>

      <CompVariants />

      <Toaster richColors />
    </div>
  );
}

function CompVariants() {
  return (
    <div className="py-10 border-t border-border">
      <div className="max-w-[1000px] mx-auto px-4">
        <h2 className="text-3xl font-semibold py-4"> Invite Variants </h2>

        {/* Invite */}
        <div className="flex flex-col gap-10">
          <BadgeContainer label="Not a Pro Team">
            <InviteSection team={freeTeam} userHasEditPermission={false} />
          </BadgeContainer>

          <BadgeContainer label="Pro Team, User does not have permission">
            <InviteSection team={proTeam} userHasEditPermission={false} />
          </BadgeContainer>

          <BadgeContainer label="Pro, User has permission">
            <InviteSection team={proTeam} userHasEditPermission={true} />
          </BadgeContainer>
        </div>

        <div className="my-10" />

        {/* Invite */}
        <div className="flex flex-col gap-10">
          <BadgeContainer label="Pro Team, has permission">
            <ManageMembersSection
              team={proTeam}
              userHasEditPermission={true}
              members={membersStub}
            />
          </BadgeContainer>

          <BadgeContainer label="Not a Pro Team, No permission">
            <ManageMembersSection
              team={freeTeam}
              userHasEditPermission={false}
              members={membersStub}
            />
          </BadgeContainer>

          <BadgeContainer label="Pro Team, No permission">
            <ManageMembersSection
              team={proTeam}
              userHasEditPermission={false}
              members={membersStub}
            />
          </BadgeContainer>
        </div>
      </div>
    </div>
  );
}

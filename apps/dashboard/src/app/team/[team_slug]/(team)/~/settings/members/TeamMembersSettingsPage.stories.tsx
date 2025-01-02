import type { TeamAccountRole, TeamMember } from "@/api/team-members";
import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../../../../../stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../stories/utils";
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

const freeTeam = teamStub("foo", "free");
const proTeam = teamStub("bar", "pro");
const growthTeam = teamStub("bazz", "growth");

function createMemberStub(
  id: string,
  role: TeamAccountRole,
  createdHours: number,
): TeamMember {
  const date = new Date();
  date.setHours(createdHours);

  const member: TeamMember = {
    account: {
      email: `user-${id}@foo.com`,
      name: id,
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
  createMemberStub("first-member", "OWNER", 1),
  createMemberStub("third-member", "MEMBER", 3),
  createMemberStub("second-member", "OWNER", 2),
];

function Story() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <TeamMembersSettingsPage
        team={proTeam}
        userHasEditPermission={true}
        members={membersStub}
      />

      <CompVariants />

      <Toaster richColors />
    </div>
  );
}

function CompVariants() {
  return (
    <div className="mt-20 border-border border-t py-10">
      <div className="">
        <h2 className="py-4 font-semibold text-3xl"> Invite Variants </h2>

        {/* Invite */}
        <div className="flex flex-col gap-10">
          <BadgeContainer label="Free Team">
            <InviteSection team={freeTeam} userHasEditPermission={false} />
          </BadgeContainer>

          <BadgeContainer label="Pro Team, User does not have permission">
            <InviteSection team={proTeam} userHasEditPermission={false} />
          </BadgeContainer>

          <BadgeContainer label="Pro, User has permission">
            <InviteSection team={proTeam} userHasEditPermission={true} />
          </BadgeContainer>

          <BadgeContainer label="Growth, User has permission">
            <InviteSection team={growthTeam} userHasEditPermission={true} />
          </BadgeContainer>
        </div>

        <div className="my-10" />

        <h2 className="py-4 font-semibold text-3xl">Team Members Variants</h2>

        <div className="flex flex-col gap-10">
          <BadgeContainer label="Has permission">
            <ManageMembersSection
              team={freeTeam}
              userHasEditPermission={true}
              members={membersStub}
            />
          </BadgeContainer>

          <BadgeContainer label="No permission">
            <ManageMembersSection
              team={freeTeam}
              userHasEditPermission={false}
              members={membersStub}
            />
          </BadgeContainer>
        </div>
      </div>
    </div>
  );
}

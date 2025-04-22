import type { TeamAccountRole, TeamMember } from "@/api/team-members";
import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "stories/stubs";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ManageMembersSection } from "./ManageMembersSection";

const meta = {
  title: "Team/Settings/Members/Manage",
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

const freeTeam = teamStub("foo", "free");

function createMemberStub(
  id: string,
  name: string,
  role: TeamAccountRole,
  createdHours: number,
): TeamMember {
  const date = new Date();
  date.setHours(createdHours);

  const member: TeamMember = {
    account: {
      email: `user-${id}@foo.com`,
      name: name,
      creatorWalletAddress: "0x1234567890123456789012345678901234567890",
      image: null,
    },
    accountId: `account-id-${id}`,
    createdAt: date.toISOString(),
    deletedAt: null,
    role: role,
    teamId: "team-id-foo-bar",
    updatedAt: date.toISOString(),
  };

  return member;
}

const membersStub: TeamMember[] = [
  createMemberStub("first-member", "First Member", "OWNER", 1),
  createMemberStub("third-member", "Third Member", "MEMBER", 3),
  createMemberStub("second-member", "Second Member", "OWNER", 2),
];

const membersStubNoName: TeamMember[] = [
  createMemberStub("first-member", "", "OWNER", 1),
  createMemberStub("third-member", "", "MEMBER", 3),
  createMemberStub("second-member", "", "OWNER", 2),
];

const deleteMemberStub = async (memberId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("deleted", memberId);
};

function Story() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col gap-10">
        <BadgeContainer label="Has permission">
          <ManageMembersSection
            team={freeTeam}
            userHasEditPermission={true}
            members={membersStub}
            client={storybookThirdwebClient}
            deleteMember={deleteMemberStub}
          />
        </BadgeContainer>

        <BadgeContainer label="No permission">
          <ManageMembersSection
            team={freeTeam}
            userHasEditPermission={false}
            members={membersStub}
            client={storybookThirdwebClient}
            deleteMember={deleteMemberStub}
          />
        </BadgeContainer>

        <BadgeContainer label="Has permission, Members dont have names">
          <ManageMembersSection
            team={freeTeam}
            userHasEditPermission={true}
            members={membersStubNoName}
            client={storybookThirdwebClient}
            deleteMember={deleteMemberStub}
          />
        </BadgeContainer>
      </div>
    </div>
  );
}

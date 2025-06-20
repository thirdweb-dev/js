import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "stories/stubs";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import type { TeamInvite } from "@/api/team-invites";
import type { TeamAccountRole } from "@/api/team-members";
import { ManageInvitesSection } from "./ManageInvitesSection";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Team/Settings/Members/Invites",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const freeTeam = teamStub("foo", "free");

function createInviteStub(
  email: string,
  role: TeamAccountRole,
  createdDays: number,
  status: TeamInvite["status"],
): TeamInvite {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - createdDays);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 10);

  const invite: TeamInvite = {
    createdAt: createdAt.toISOString(),
    email,
    expiresAt: expiresAt.toISOString(),
    id: `invite-id-${email}`,
    role,
    status,
    teamId: "team-id-foo",
  };

  return invite;
}

const invitesStub: TeamInvite[] = [
  createInviteStub("firstUser@foo.com", "OWNER", 1, "pending"),
  createInviteStub("thirdUser@foo.com", "MEMBER", 3, "expired"),
  createInviteStub("secondUser@foo.com", "OWNER", 2, "pending"),
];

const deleteInviteStub = async (inviteId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("deleted", inviteId);
};

function Story() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col gap-10">
        <BadgeContainer label="Has permission">
          <ManageInvitesSection
            client={storybookThirdwebClient}
            deleteInvite={deleteInviteStub}
            team={freeTeam}
            teamInvites={invitesStub}
            userHasEditPermission={true}
          />
        </BadgeContainer>

        <BadgeContainer label="No permission">
          <ManageInvitesSection
            client={storybookThirdwebClient}
            deleteInvite={deleteInviteStub}
            team={freeTeam}
            teamInvites={invitesStub}
            userHasEditPermission={false}
          />
        </BadgeContainer>
      </div>
    </div>
  );
}

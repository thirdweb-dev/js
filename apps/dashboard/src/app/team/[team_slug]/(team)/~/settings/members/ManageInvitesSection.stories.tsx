import type { TeamInvite } from "@/api/team-invites";
import type { TeamAccountRole } from "@/api/team-members";
import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../../../../../stories/stubs";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../../../../../stories/utils";
import { ManageInvitesSection } from "./ManageInvitesSection";

const meta = {
  title: "Team/Settings/Members/Invites",
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
    id: `invite-id-${email}`,
    email,
    role,
    createdAt: createdAt.toISOString(),
    status,
    teamId: "team-id-foo",
    expiresAt: expiresAt.toISOString(),
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
            team={freeTeam}
            userHasEditPermission={true}
            teamInvites={invitesStub}
            client={storybookThirdwebClient}
            deleteInvite={deleteInviteStub}
          />
        </BadgeContainer>

        <BadgeContainer label="No permission">
          <ManageInvitesSection
            team={freeTeam}
            userHasEditPermission={false}
            teamInvites={invitesStub}
            client={storybookThirdwebClient}
            deleteInvite={deleteInviteStub}
          />
        </BadgeContainer>
      </div>
    </div>
  );
}

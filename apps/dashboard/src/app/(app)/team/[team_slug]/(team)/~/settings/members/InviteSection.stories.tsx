import type { Meta, StoryObj } from "@storybook/nextjs";
import { useId, useState } from "react";
import type { TeamAccountRole } from "@/api/team/team-members";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { teamStub } from "@/storybook/stubs";
import { storybookThirdwebClient } from "@/storybook/utils";
import { InviteSection } from "./InviteSection";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Team/Settings/Members/InviteSection",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const TEAM_CONFIGS = [
  { id: "free", label: "Free Team", team: teamStub("foo", "free") },
  { id: "starter", label: "Starter Team", team: teamStub("foo", "starter") },
  { id: "growth", label: "Growth Team", team: teamStub("bazz", "growth") },
  {
    id: "accelerate",
    label: "Accelerate Team",
    team: teamStub("baz", "accelerate"),
  },
  { id: "scale", label: "Scale Team", team: teamStub("qux", "scale") },
  { id: "pro", label: "Pro Team", team: teamStub("bar", "pro") },
] as const;

const RECOMMENDED_MEMBERS_COUNTS = [
  { id: "0", label: "No Recommended Members", value: 0 },
  { id: "1", label: "1 Recommended Member", value: 1 },
  { id: "3", label: "2 Recommended Members", value: 2 },
  { id: "5", label: "11 Recommended Members", value: 11 },
  { id: "100", label: "100 Recommended Members", value: 100 },
] as const;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type InviteParams = Array<{ email: string; role: TeamAccountRole }>;

const INVITE_HANDLERS = {
  failure: async (params: InviteParams) => {
    await sleep(500);
    return { results: params.map(() => "rejected" as const) };
  },
  mixed: async (params: InviteParams) => {
    await sleep(500);
    return {
      results: params.map((_, index) =>
        index % 2 === 0 ? ("fulfilled" as const) : ("rejected" as const),
      ),
    };
  },
  success: async (params: InviteParams) => {
    await sleep(500);
    return { results: params.map(() => "fulfilled" as const) };
  },
} as const;

function RadioOption({ label, value }: { label: string; value: string }) {
  const id = useId();
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem id={id} value={value} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

function Story() {
  const [selectedTeam, setSelectedTeam] = useState({
    id: "free",
    team: TEAM_CONFIGS[0].team,
  });
  const [hasEditPermission, setHasEditPermission] = useState("true");
  const [inviteResult, setInviteResult] =
    useState<keyof typeof INVITE_HANDLERS>("success");
  const [recommendedMembersCount, setRecommendedMembersCount] =
    useState<number>(0);

  const showPermissionControls =
    selectedTeam.id !== "free" && selectedTeam.id !== "pro";
  const showInviteControls =
    showPermissionControls && hasEditPermission === "true";

  const recommendedMembers = Array.from(
    { length: recommendedMembersCount },
    (_, i) => ({
      email: `user${i + 1}@example.com`,
      image:
        i % 3 === 0
          ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`
          : null,
      name: i % 2 === 0 ? `User ${i + 1}` : null,
    }),
  );

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h3 className="mb-3 font-medium">Team Type</h3>
          <RadioGroup
            className="flex gap-4"
            onValueChange={(value: typeof selectedTeam.id) => {
              const config = TEAM_CONFIGS.find(({ id }) => id === value);
              if (config) setSelectedTeam({ id: value, team: config.team });
            }}
            value={selectedTeam.id}
          >
            {TEAM_CONFIGS.map(({ id, label }) => (
              <RadioOption key={id} label={label} value={id} />
            ))}
          </RadioGroup>
        </div>

        {showPermissionControls && (
          <div>
            <h3 className="mb-3 font-medium">Edit Permission</h3>
            <RadioGroup
              className="flex gap-4"
              onValueChange={setHasEditPermission}
              value={hasEditPermission}
            >
              <RadioOption label="Has Permission" value="true" />
              <RadioOption label="No Permission" value="false" />
            </RadioGroup>
          </div>
        )}

        {showInviteControls && (
          <div>
            <h3 className="mb-3 font-medium">Invite Result</h3>
            <RadioGroup
              className="flex gap-4"
              onValueChange={(value: typeof inviteResult) => {
                setInviteResult(value as keyof typeof INVITE_HANDLERS);
              }}
              value={inviteResult}
            >
              <RadioOption label="All Success" value="success" />
              <RadioOption label="All Failure" value="failure" />
              <RadioOption label="Mixed Results" value="mixed" />
            </RadioGroup>
          </div>
        )}

        <div>
          <h3 className="mb-3 font-medium">Recommended Members</h3>
          <RadioGroup
            className="flex gap-4"
            onValueChange={(value) => {
              setRecommendedMembersCount(Number.parseInt(value));
            }}
            value={recommendedMembersCount.toString()}
          >
            {RECOMMENDED_MEMBERS_COUNTS.map(({ id, label, value }) => (
              <RadioOption key={id} label={label} value={value.toString()} />
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <InviteSection
          client={storybookThirdwebClient}
          inviteTeamMembers={INVITE_HANDLERS[inviteResult]}
          recommendedMembers={recommendedMembers}
          team={selectedTeam.team}
          userHasEditPermission={hasEditPermission === "true"}
        />
      </div>
    </div>
  );
}

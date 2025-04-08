import type { TeamAccountRole } from "@/api/team-members";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { teamStub } from "../../../../../../../stories/stubs";
import { InviteSection } from "./InviteSection";

const meta = {
  title: "Team/Settings/Members/InviteSection",
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type InviteParams = Array<{ email: string; role: TeamAccountRole }>;

const INVITE_HANDLERS = {
  success: async (params: InviteParams) => {
    await sleep(500);
    return { results: params.map(() => "fulfilled" as const) };
  },
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
} as const;

function RadioOption({
  id,
  label,
  value,
}: { id: string; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
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

  const showPermissionControls =
    selectedTeam.id !== "free" && selectedTeam.id !== "pro";
  const showInviteControls =
    showPermissionControls && hasEditPermission === "true";

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <h3 className="mb-3 font-medium">Team Type</h3>
          <RadioGroup
            value={selectedTeam.id}
            onValueChange={(value: typeof selectedTeam.id) => {
              const config = TEAM_CONFIGS.find(({ id }) => id === value);
              if (config) setSelectedTeam({ id: value, team: config.team });
            }}
            className="flex gap-4"
          >
            {TEAM_CONFIGS.map(({ id, label }) => (
              <RadioOption key={id} id={id} label={label} value={id} />
            ))}
          </RadioGroup>
        </div>

        {showPermissionControls && (
          <div>
            <h3 className="mb-3 font-medium">Edit Permission</h3>
            <RadioGroup
              value={hasEditPermission}
              onValueChange={setHasEditPermission}
              className="flex gap-4"
            >
              <RadioOption
                id="permission-true"
                label="Has Permission"
                value="true"
              />
              <RadioOption
                id="permission-false"
                label="No Permission"
                value="false"
              />
            </RadioGroup>
          </div>
        )}

        {showInviteControls && (
          <div>
            <h3 className="mb-3 font-medium">Invite Result</h3>
            <RadioGroup
              value={inviteResult}
              onValueChange={(value: typeof inviteResult) => {
                setInviteResult(value as keyof typeof INVITE_HANDLERS);
              }}
              className="flex gap-4"
            >
              <RadioOption
                id="result-success"
                label="All Success"
                value="success"
              />
              <RadioOption
                id="result-failure"
                label="All Failure"
                value="failure"
              />
              <RadioOption
                id="result-mixed"
                label="Mixed Results"
                value="mixed"
              />
            </RadioGroup>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-10">
        <InviteSection
          team={selectedTeam.team}
          userHasEditPermission={hasEditPermission === "true"}
          inviteTeamMembers={INVITE_HANDLERS[inviteResult]}
        />
      </div>
    </div>
  );
}

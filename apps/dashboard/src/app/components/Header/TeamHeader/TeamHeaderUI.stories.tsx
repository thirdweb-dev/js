import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import type { Project } from "../../../../@/api/projects";
import type { Team } from "../../../../@/api/team";
import { Button } from "../../../../@/components/ui/button";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { TeamHeaderDesktopUI, TeamHeaderMobileUI } from "./TeamHeaderUI";

const meta = {
  title: "Team/Team selector",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    type: "desktop",
  },
};

export const Mobile: Story = {
  args: {
    type: "mobile",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Variants(props: {
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <div
        className={"flex flex-col gap-6 bg-gray-700 px-4 py-10 min-h-screen"}
      >
        <BadgeContainer label="Team, Free">
          <Comp
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[0].team}
            currentProject={undefined}
            email="eng@thirdweb.com"
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
          />
        </BadgeContainer>

        <BadgeContainer label="Team, Growth">
          <Comp
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[1].team}
            currentProject={undefined}
            email={undefined}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
          />
        </BadgeContainer>

        <BadgeContainer label="Team, Pro">
          <Comp
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[2].team}
            currentProject={undefined}
            email="eng@thirdweb.com"
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
          />
        </BadgeContainer>

        <BadgeContainer label="Team + Project, Pro">
          <Comp
            teamsAndProjects={teamsAndProjects}
            currentTeam={teamsAndProjects[2].team}
            currentProject={teamsAndProjects[2].projects[0]}
            email="eng@thirdweb.com"
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

function projectStub(id: string, teamId: string) {
  const project: Project = {
    bundleIds: [] as string[],
    createdAt: new Date(),
    domains: [] as string[],
    id: id,
    updatedAt: new Date(),
    teamId: teamId,
    redirectUrls: [] as string[],
    slug: `project-${id}`,
    name: `Project ${id}`,
    publishableKey: "pb-key",
    lastAccessedAt: null,
    deletedAt: null,
    bannedAt: null,
  };

  return project;
}

function teamStub(id: string, billingPlan: "free" | "pro" | "growth"): Team {
  const team: Team = {
    id: `team-${id}-id`,
    billingPlan: billingPlan,
    billingStatus: "validPayment",
    name: `Team ${id}`,
    slug: `team-${id}`,
    bannedAt: null,
    createdAt: new Date().toISOString(),
    deletedAt: null,
    updatedAt: new Date().toISOString(),
  };

  return team;
}

const teamsAndProjects: Array<{ team: Team; projects: Project[] }> = [
  {
    team: teamStub("1", "free"),
    projects: [
      projectStub("t1p1", "team-1"),
      projectStub("t1p2", "team-1"),
      projectStub("t1p3", "team-1"),
      projectStub("t1p4", "team-1"),
    ],
  },
  {
    team: teamStub("2", "growth"),
    projects: [projectStub("t2p1", "team-2"), projectStub("t2p2", "team-2")],
  },
  {
    team: teamStub("3", "pro"),
    projects: [projectStub("t3p1", "team-3")],
  },
];

import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import type { Project } from "../../../../@/api/projects";
import type { Team } from "../../../../@/api/team";
import { Button } from "../../../../@/components/ui/button";
import { Separator } from "../../../../@/components/ui/separator";
import { BadgeContainer, useSetStoryTheme } from "../../../../stories/utils";
import { TeamHeaderDesktopUI, TeamHeaderMobileUI } from "./TeamHeaderUI";

const meta = {
  title: "Team/Team selector",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

function Story(props: { theme: "light" | "dark" }) {
  useSetStoryTheme(props.theme);

  return (
    <div className="dark:bg-zinc-900 bg-zinc-300 p-6">
      <h2 className="text-3xl mb-6 font-semibold tracking-tight">Desktop</h2>
      <Variants theme={props.theme} type="desktop" />
      <Separator className="my-10" />
      <h2 className="mt-10 mb-6 text-3xl font-semibold tracking-tight">
        Mobile
      </h2>
      <div className="w-[400px]">
        <Variants theme={props.theme} type="mobile" />
      </div>
    </div>
  );
}

function Variants(props: {
  theme: "light" | "dark";
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <div className={`flex flex-col gap-6 ${props.theme}`}>
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

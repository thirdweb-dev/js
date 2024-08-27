import type { Meta, StoryObj } from "@storybook/react";
import { useLayoutEffect } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import type { Project } from "../@/api/projects";
import type { Team } from "../@/api/team";
import { thirdwebClient } from "../@/constants/client";
import {
  TeamHeaderDesktopUI,
  TeamHeaderMobileUI,
} from "../app/components/Header/TeamHeader/TeamHeaderUI";

const meta = {
  title: "Shadcn/Header",
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

function createFakeProject(id: string, teamId: string) {
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

const teamsAndProjects: Array<{ team: Team; projects: Project[] }> = [
  {
    team: {
      billingPlan: "free",
      billingStatus: "",
      name: "Team 1",
      slug: "team-1",
    },
    projects: [
      createFakeProject("t1p1", "team-1"),
      createFakeProject("t1p2", "team-1"),
      createFakeProject("t1p3", "team-1"),
      createFakeProject("t1p4", "team-1"),
    ],
  },
  {
    team: {
      billingPlan: "pro",
      billingStatus: "validPayment",
      name: "Team 3",
      slug: "team-3",
    },
    projects: [
      createFakeProject("t2p1", "team-2"),
      createFakeProject("t2p2", "team-2"),
    ],
  },
  {
    team: {
      billingPlan: "growth",
      billingStatus: "validPayment",
      name: "Team 2",
      slug: "team-2",
    },
    projects: [createFakeProject("t3p1", "team-3")],
  },
];

function Variants(props: {
  theme: "light" | "dark";
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <ApplyTheme theme={props.theme} />
      <div className="flex flex-col gap-6">
        <span className="text-white font-bold">
          Connected, No Current Project, Free
        </span>
        <Comp
          teamsAndProjects={teamsAndProjects}
          currentTeam={teamsAndProjects[0].team}
          currentProject={undefined}
          email="eng@thirdweb.com"
          logout={() => {}}
          connectButton={<ConnectButton client={thirdwebClient} />}
        />

        <span className="text-white font-bold">
          Not yet Connected, No email, No Current Project, Growth
        </span>

        <Comp
          teamsAndProjects={teamsAndProjects}
          currentTeam={teamsAndProjects[1].team}
          currentProject={undefined}
          email={undefined}
          logout={() => {}}
          connectButton={<ConnectButton client={thirdwebClient} />}
        />

        <span className="text-white font-bold">
          Not yet Connected, No Current Project, Pro
        </span>
        <Comp
          teamsAndProjects={teamsAndProjects}
          currentTeam={teamsAndProjects[2].team}
          currentProject={undefined}
          email="eng@thirdweb.com"
          logout={() => {}}
          connectButton={<ConnectButton client={thirdwebClient} />}
        />

        <span className="text-white font-bold">
          Not yet Connected, Current Project, Pro
        </span>
        <Comp
          teamsAndProjects={teamsAndProjects}
          currentTeam={teamsAndProjects[2].team}
          currentProject={teamsAndProjects[2].projects[0]}
          email="eng@thirdweb.com"
          logout={() => {}}
          connectButton={<ConnectButton client={thirdwebClient} />}
        />
      </div>
    </ThirdwebProvider>
  );
}

function Story(props: { theme: "light" | "dark" }) {
  return (
    <div className="bg-zinc-700 p-4">
      <h2 className="text-3xl mb-2"> Desktop </h2>
      <Variants theme={props.theme} type="desktop" />
      <h2 className="mt-10 text-3xl mb-2"> Mobile </h2>
      <div className="w-[400px]">
        <Variants theme={props.theme} type="mobile" />
      </div>
    </div>
  );
}

function ApplyTheme(props: { theme: "light" | "dark" }) {
  const { theme } = props;
  useLayoutEffect(() => {
    if (theme === "light" || theme === "dark") {
      document.body.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}

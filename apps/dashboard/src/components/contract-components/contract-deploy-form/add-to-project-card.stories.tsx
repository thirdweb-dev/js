import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import {
  AddToProjectCardUI,
  type MinimalProject,
  type MinimalTeam,
  type MinimalTeamsAndProjects,
  type TeamAndProjectSelection,
} from "./add-to-project-card";

const meta = {
  title: "DeployContract/AddToProject",
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

function teamsAndProjectsStub(teamCount: number, projectCount: number) {
  const teamsAndProjects: MinimalTeamsAndProjects = [];

  // generate random names and ids
  for (let i = 0; i < teamCount; i++) {
    const team: MinimalTeam = {
      id: `team_${i + 1}`,
      name: `Team ${i + 1}`,
      image: `https://picsum.photos/200?random=${i}`,
      slug: `team-${i + 1}`,
    };

    const projects: MinimalProject[] = [];
    for (let j = 0; j < projectCount; j++) {
      projects.push({
        id: `project_${i + 1}_${j + 1}`,
        name: `Project ${i + 1}_${j + 1}`,
        image: `https://picsum.photos/200?random=${i}`,
      });
    }

    teamsAndProjects.push({ team, projects });
  }

  return teamsAndProjects;
}

function Story() {
  return (
    <div className="container flex max-w-[1000px] flex-col gap-8 py-10">
      <Variant label="1 Team, 0 Projects" teamCount={1} projectCount={0} />
      <Variant label="1 Team, 1 Project" teamCount={1} projectCount={1} />
      <Variant label="1 Team, 5 Projects" teamCount={1} projectCount={5} />
      <Variant label="5 Teams, 5 Projects" teamCount={5} projectCount={5} />
    </div>
  );
}

function Variant(props: {
  label: string;
  teamCount: number;
  projectCount: number;
}) {
  const [teamsAndProjects] = useState(() =>
    teamsAndProjectsStub(props.teamCount, props.projectCount),
  );
  const [isEnabled, setIsEnabled] = useState(true);
  const [selection, setSelection] = useState<TeamAndProjectSelection>({
    team: teamsAndProjects[0]?.team,
    project: teamsAndProjects[0]?.projects[0],
  });

  return (
    <BadgeContainer label={props.label}>
      <AddToProjectCardUI
        teamsAndProjects={teamsAndProjects}
        client={getThirdwebClient()}
        onSelectionChange={setSelection}
        selection={selection}
        enabled={isEnabled}
        onSetEnabled={setIsEnabled}
      />
    </BadgeContainer>
  );
}

import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../stories/utils";
import {
  AddToProjectCardUI,
  type MinimalProject,
  type MinimalTeam,
  type MinimalTeamsAndProjects,
  type TeamAndProjectSelection,
} from "./add-to-project-card";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "DeployContract/AddToProject",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function teamsAndProjectsStub(teamCount: number, projectCount: number) {
  const teamsAndProjects: MinimalTeamsAndProjects = [];

  // generate random names and ids
  for (let i = 0; i < teamCount; i++) {
    const team: MinimalTeam = {
      id: `team_${i + 1}`,
      image: `https://picsum.photos/200?random=${i}`,
      name: `Team ${i + 1}`,
      slug: `team-${i + 1}`,
    };

    const projects: MinimalProject[] = [];
    for (let j = 0; j < projectCount; j++) {
      projects.push({
        id: `project_${i + 1}_${j + 1}`,
        image: `https://picsum.photos/200?random=${i}`,
        name: `Project ${i + 1}_${j + 1}`,
        slug: `project-${i + 1}-${j + 1}`,
      });
    }

    teamsAndProjects.push({ projects, team });
  }

  return teamsAndProjects;
}

function Story() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
      <Variant label="1 Team, 0 Projects" projectCount={0} teamCount={1} />
      <Variant label="1 Team, 1 Project" projectCount={1} teamCount={1} />
      <Variant label="1 Team, 5 Projects" projectCount={5} teamCount={1} />
      <Variant label="5 Teams, 5 Projects" projectCount={5} teamCount={5} />
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
    project: teamsAndProjects[0]?.projects[0],
    team: teamsAndProjects[0]?.team,
  });

  return (
    <BadgeContainer label={props.label}>
      <AddToProjectCardUI
        client={storybookThirdwebClient}
        enabled={isEnabled}
        onSelectionChange={setSelection}
        onSetEnabled={setIsEnabled}
        selection={selection}
        teamsAndProjects={teamsAndProjects}
      />
    </BadgeContainer>
  );
}

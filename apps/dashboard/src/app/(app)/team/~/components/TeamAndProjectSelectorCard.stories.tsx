import type { Meta, StoryObj } from "@storybook/nextjs";
import type { PartialProject } from "@/api/getProjectContracts";
import { projectStub, teamStub } from "@/storybook/stubs";
import { storybookLog, storybookThirdwebClient } from "@/storybook/utils";
import { ProjectAndTeamSelectorCard } from "./TeamAndProjectSelectorCard";

const meta = {
  component: ProjectAndTeamSelectorCard,
  decorators: [
    (Story) => (
      <div className="py-20 flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "selectors/TeamAndProjectSelectorCard",
} satisfies Meta<typeof ProjectAndTeamSelectorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create PartialProject from full Project
function createPartialProject(
  project: ReturnType<typeof projectStub>,
): PartialProject {
  return {
    id: project.id,
    image: project.image,
    name: project.name,
    slug: project.slug,
  };
}

export const OneTeamFiveProjects: Story = {
  args: {
    client: storybookThirdwebClient,
    description: "Select a project to continue",
    onSelect: (selected) => {
      console.log("Selected:", selected);
    },
    teamAndProjects: [
      {
        projects: [
          createPartialProject(projectStub("1", "team-1")),
          createPartialProject(projectStub("2", "team-1")),
          createPartialProject(projectStub("3", "team-1")),
          createPartialProject(projectStub("4", "team-1")),
          createPartialProject(projectStub("5", "team-1")),
        ],
        team: teamStub("1", "growth"),
      },
    ],
  },
};

export const TwoTeamsTwoProjectsEach: Story = {
  args: {
    client: storybookThirdwebClient,
    description: "Select a project to continue",
    onSelect: (selected) => {
      storybookLog(selected);
    },
    teamAndProjects: [
      {
        projects: [
          createPartialProject(projectStub("1", "team-1")),
          createPartialProject(projectStub("2", "team-1")),
        ],
        team: teamStub("1", "free"),
      },
      {
        projects: [
          createPartialProject(projectStub("3", "team-2")),
          createPartialProject(projectStub("4", "team-2")),
        ],
        team: teamStub("2", "starter"),
      },
    ],
  },
};

export const TwoTeamsOneWithThreeProjectsOtherWithZero: Story = {
  args: {
    client: storybookThirdwebClient,
    description: "Select a project to continue",
    onSelect: (selected) => {
      storybookLog(selected);
    },
    teamAndProjects: [
      {
        projects: [
          createPartialProject(projectStub("1", "team-1")),
          createPartialProject(projectStub("2", "team-1")),
          createPartialProject(projectStub("3", "team-1")),
        ],
        team: teamStub("1", "growth"),
      },
      {
        projects: [],
        team: teamStub("2", "free"), // Empty projects array
      },
    ],
  },
};

export const TwoTeamsLotsOfProjects: Story = {
  args: {
    client: storybookThirdwebClient,
    description: "Select a project to continue",
    onSelect: (selected) => {
      console.log("Selected:", selected);
    },
    teamAndProjects: [
      {
        projects: Array.from({ length: 100 }, (_, i) =>
          createPartialProject(projectStub(`${i + 1}`, "team-1")),
        ),
        team: teamStub("1", "growth"),
      },
      {
        projects: Array.from({ length: 100 }, (_, i) =>
          createPartialProject(projectStub(`${i + 1}`, "team-2")),
        ),
        team: teamStub("2", "growth"),
      },
    ],
  },
};

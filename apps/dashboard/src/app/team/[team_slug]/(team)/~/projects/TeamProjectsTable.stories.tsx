import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { projectStub, teamStub } from "../../../../../../stories/stubs";
import { storybookLog } from "../../../../../../stories/utils";
import {
  type ProjectWithAnalytics,
  TeamProjectsTable,
} from "./TeamProjectsTable";

const meta: Meta<typeof Variant> = {
  title: "Team/Projects",
  component: Variant,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="container py-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Variant>;

function createProjectWithAnalyticsStub(len: number) {
  return Array.from({ length: len }, (_, i) => {
    return {
      ...projectStub(`${i + 1}`, "foo"),
      monthlyActiveUsers: Math.floor(Math.random() * 1000),
    };
  });
}

export const MultipleProjects: Story = {
  args: {
    projects: createProjectWithAnalyticsStub(10),
  },
};

export const SingleProject: Story = {
  args: {
    projects: createProjectWithAnalyticsStub(1),
  },
};

export const NoProjects: Story = {
  args: {
    projects: [],
  },
};

export const NoUsers: Story = {
  args: {
    projects: createProjectWithAnalyticsStub(10).map((p) => ({
      ...p,
      monthlyActiveUsers: 0,
    })),
  },
};

const client = getThirdwebClient();
const team = teamStub("foo", "free");

function Variant(props: {
  projects: ProjectWithAnalytics[];
}) {
  return (
    <TeamProjectsTable
      team={team}
      client={client}
      projects={props.projects}
      openCreateProjectModal={() => {
        storybookLog("showCreateProjectModal");
      }}
    />
  );
}

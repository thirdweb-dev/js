import type { Meta, StoryObj } from "@storybook/react";
import { projectStub } from "stories/stubs";
import { ProjectFTUX } from "./ProjectFTUX";

const meta = {
  title: "Project/ProjectFTUX",
  component: ProjectFTUX,
  decorators: [
    (Story) => (
      <div className="container py-8 pb-20">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectFTUX>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project: {
      ...projectStub("foo", "bar"),
      secretKeys: [
        {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          hash: "1234567890",
          masked: "1234567890",
        },
      ],
    },
    teamSlug: "bar",
  },
};

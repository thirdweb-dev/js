import type { Meta, StoryObj } from "@storybook/nextjs";
import { projectStub } from "@/storybook/stubs";
import { ProjectFTUX } from "./ProjectFTUX";

const meta = {
  component: ProjectFTUX,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="container py-8 pb-20 max-w-7xl">
        <Story />
      </div>
    ),
  ],
  title: "Project/ProjectFTUX",
} satisfies Meta<typeof ProjectFTUX>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projectWalletSection: undefined,
    project: {
      ...projectStub("foo", "bar"),
      secretKeys: [
        {
          createdAt: new Date().toISOString(),
          hash: "1234567890",
          masked: "1234567890",
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    teamSlug: "bar",
  },
};

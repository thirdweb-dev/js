import type { Meta, StoryObj } from "@storybook/react";
import { projectStub } from "../../../../stories/stubs";
import { CreateProjectPageUI } from "./CreateProjectPageUI";

const meta = {
  title: "Onboarding/CreateProject",
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

function Story() {
  return (
    <CreateProjectPageUI
      createProject={async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          project: projectStub("foo", "bar"),
          secret: "secret",
        };
      }}
      teamSlug="foo"
      enableNebulaServiceByDefault={false}
    />
  );
}

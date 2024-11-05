import type { Meta, StoryObj } from "@storybook/react";
import { projectStub } from "stories/stubs";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ProjectOverviewHeader } from "./ProjectOverviewHeader";

const meta = {
  title: "project/Overview/Header",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export const Mobile: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: mobileViewport("iphone14"),
  },
};

function Component() {
  return (
    <div className="container max-w-[1150px] py-8">
      <BadgeContainer label="Base">
        <ProjectOverviewHeader project={projectStub("123", "456")} />
      </BadgeContainer>
    </div>
  );
}

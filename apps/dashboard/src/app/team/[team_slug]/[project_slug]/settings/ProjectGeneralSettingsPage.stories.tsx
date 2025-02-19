import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { projectStub } from "../../../../../stories/stubs";
import { mobileViewport } from "../../../../../stories/utils";
import { ProjectGeneralSettingsPageUI } from "./ProjectGeneralSettingsPage";

const meta = {
  title: "Project/Settings/General",
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

function Story() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <ProjectGeneralSettingsPageUI
        updateProject={async (params) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("updateProject", params);
          return projectStub("foo", "team-1");
        }}
        deleteProject={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("deleteProject");
        }}
        project={projectStub("foo", "team-1")}
        teamSlug="foo"
        onKeyUpdated={undefined}
        rotateSecretKey={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            data: {
              secret: new Array(86).fill("x").join(""),
              secretHash: new Array(64).fill("x").join(""),
              secretMasked: "123...4567",
            },
          };
        }}
        showNebulaSettings={false}
      />

      <Toaster richColors />
    </div>
  );
}

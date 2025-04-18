import type { Meta, StoryObj } from "@storybook/react";
import { projectStub, teamStub } from "../../../../../stories/stubs";
import { storybookThirdwebClient } from "../../../../../stories/utils";
import { ProjectGeneralSettingsPageUI } from "./ProjectGeneralSettingsPage";

const meta = {
  title: "Project/Settings",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OwnerAccount: Story = {
  args: {
    isOwnerAccount: true,
  },
};

export const MemberAccount: Story = {
  args: {
    isOwnerAccount: false,
  },
};

function Story(props: {
  isOwnerAccount: boolean;
}) {
  const currentTeam = teamStub("currentTeam", "free");
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <ProjectGeneralSettingsPageUI
        updateProjectImage={async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("updateProjectImage", file);
        }}
        isOwnerAccount={props.isOwnerAccount}
        transferProject={async (newTeam) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("transferProject", newTeam);
        }}
        client={storybookThirdwebClient}
        teamsWithRole={[
          {
            role: props.isOwnerAccount ? "OWNER" : "MEMBER",
            team: currentTeam,
          },
          {
            role: "OWNER",
            team: teamStub("bar", "growth"),
          },
          {
            role: "MEMBER",
            team: teamStub("baz", "starter"),
          },
        ]}
        updateProject={async (params) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("updateProject", params);
          return projectStub("foo", "currentTeam");
        }}
        deleteProject={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("deleteProject");
        }}
        project={projectStub("foo", currentTeam.id)}
        teamSlug={currentTeam.slug}
        onKeyUpdated={undefined}
        rotateSecretKey={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            data: {
              secret: `sk_${new Array(86).fill("x").join("")}`,
              secretMasked: "sk_123...4567",
            },
          };
        }}
        showNebulaSettings={false}
      />
    </div>
  );
}

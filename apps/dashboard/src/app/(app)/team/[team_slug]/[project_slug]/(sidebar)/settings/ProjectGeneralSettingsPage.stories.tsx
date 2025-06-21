import type { Meta, StoryObj } from "@storybook/nextjs";
import { projectStub, teamStub } from "stories/stubs";
import { storybookThirdwebClient } from "stories/utils";
import { ProjectGeneralSettingsPageUI } from "./ProjectGeneralSettingsPage";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Project/Settings",
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

function Story(props: { isOwnerAccount: boolean }) {
  const currentTeam = teamStub("currentTeam", "free");
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <ProjectGeneralSettingsPageUI
        client={storybookThirdwebClient}
        deleteProject={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("deleteProject");
        }}
        isOwnerAccount={props.isOwnerAccount}
        onKeyUpdated={undefined}
        project={projectStub("foo", currentTeam.id)}
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
        teamSlug={currentTeam.slug}
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
        transferProject={async (newTeam) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("transferProject", newTeam);
        }}
        updateProject={async (params) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("updateProject", params);
          return projectStub("foo", "currentTeam");
        }}
        updateProjectImage={async (file) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("updateProjectImage", file);
        }}
      />
    </div>
  );
}

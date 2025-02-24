import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { projectStub, teamStub } from "../../../../../stories/stubs";
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
        isOwnerAccount={props.isOwnerAccount}
        transferProject={async (newTeam) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("transferProject", newTeam);
        }}
        client={getThirdwebClient()}
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

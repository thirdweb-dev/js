import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { teamsAndProjectsStub } from "../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { TeamHeaderDesktopUI, TeamHeaderMobileUI } from "./TeamHeaderUI";

const meta = {
  title: "Team/Team selector",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    type: "desktop",
  },
};

export const Mobile: Story = {
  args: {
    type: "mobile",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Variants(props: {
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  return (
    <ThirdwebProvider>
      <div className="flex min-h-screen flex-col gap-6 bg-gray-700 px-4 py-10">
        <BadgeContainer label="Team Free, Account Loaded">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            currentTeam={teamsAndProjectsStub[0].team}
            currentProject={undefined}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
            account={{
              email: "foo@example.com",
              id: "1",
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Team Growth, Account Loading">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            currentTeam={teamsAndProjectsStub[1].team}
            currentProject={undefined}
            account={undefined}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
          />
        </BadgeContainer>

        <BadgeContainer label="Team, Pro">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            currentTeam={teamsAndProjectsStub[2].team}
            currentProject={undefined}
            account={{
              email: "foo@example.com",
              id: "foo",
            }}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
          />
        </BadgeContainer>

        <BadgeContainer label="Team + Project, Pro">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            currentTeam={teamsAndProjectsStub[2].team}
            currentProject={teamsAndProjectsStub[2].projects[0]}
            account={{
              email: "foo@example.com",
              id: "foo",
            }}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

import { Button } from "@/components/ui/button";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { teamsAndProjectsStub } from "../../../../stories/stubs";
import { BadgeContainer, mobileViewport } from "../../../../stories/utils";
import { TeamHeaderDesktopUI, TeamHeaderMobileUI } from "./TeamHeaderUI";

const meta = {
  title: "Headers/TeamHeader/LoggedIn",
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

const client = getThirdwebClient();

function Variants(props: {
  type: "mobile" | "desktop";
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  const acccountAddressStub = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

  const team1 = teamsAndProjectsStub[0]?.team;
  const team2 = teamsAndProjectsStub[1]?.team;
  const team3 = teamsAndProjectsStub[2]?.team;
  const team3Project = teamsAndProjectsStub[2]?.projects[0];

  if (!team1 || !team2 || !team3 || !team3Project) {
    return <div> failed to get team and project stubs </div>;
  }
  return (
    <ThirdwebProvider>
      <div className="flex min-h-dvh flex-col gap-6 bg-gray-700 px-4 py-10">
        <BadgeContainer label="Team Free, Account Loaded">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            currentTeam={team1}
            accountAddress={acccountAddressStub}
            currentProject={undefined}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
            account={{
              email: "foo@example.com",
              id: "1",
            }}
            client={client}
          />
        </BadgeContainer>

        <BadgeContainer label="Team, Pro">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            currentTeam={team3}
            currentProject={undefined}
            accountAddress={acccountAddressStub}
            account={{
              email: "foo@example.com",
              id: "foo",
            }}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
            client={client}
          />
        </BadgeContainer>

        <BadgeContainer label="Team + Project, Pro">
          <Comp
            teamsAndProjects={teamsAndProjectsStub}
            accountAddress={acccountAddressStub}
            currentTeam={team3}
            currentProject={team3Project}
            account={{
              email: "foo@example.com",
              id: "foo",
            }}
            logout={() => {}}
            connectButton={<ConnectButtonStub />}
            createProject={() => {}}
            client={client}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

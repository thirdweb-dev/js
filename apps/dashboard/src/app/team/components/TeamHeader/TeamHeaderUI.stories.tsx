import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import { teamsAndProjectsStub } from "../../../../stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
  storybookThirdwebClient,
} from "../../../../stories/utils";
import { TeamHeaderDesktopUI, TeamHeaderMobileUI } from "./TeamHeaderUI";

const meta = {
  title: "Headers/TeamHeader",
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
  const freeTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "free",
  );
  const starterTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "starter",
  );

  const starterLegacyTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "starter_legacy",
  );

  const growthTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "growth",
  );

  const growthLegacyTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "growth_legacy",
  );

  const accelerateTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "accelerate",
  );

  const scaleTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "scale",
  );

  const proTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "pro",
  );

  if (
    !freeTeam ||
    !starterTeam ||
    !growthTeam ||
    !growthLegacyTeam ||
    !accelerateTeam ||
    !scaleTeam ||
    !proTeam ||
    !starterLegacyTeam
  ) {
    return <div> invalid storybook stubs </div>;
  }

  return (
    <ThirdwebProvider>
      <div className="flex min-h-dvh flex-col gap-6 bg-background py-10">
        <BadgeContainer label="Free Plan">
          <Variant team={freeTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Starter Plan">
          <Variant team={starterTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Legacy Starter Plan">
          <Variant team={starterLegacyTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Growth Plan">
          <Variant team={growthTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Legacy Growth Plan">
          <Variant team={growthLegacyTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Accelerate Plan">
          <Variant team={accelerateTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Scale Plan">
          <Variant team={scaleTeam.team} type={props.type} />
        </BadgeContainer>

        <BadgeContainer label="Pro Plan">
          <div className="border-y bg-card">
            <Variant team={proTeam.team} type={props.type} />
          </div>
        </BadgeContainer>

        <BadgeContainer label="Pro Plan - project selected">
          <Variant
            team={proTeam.team}
            type={props.type}
            currentProject={proTeam.projects[0]}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function ConnectButtonStub() {
  return <Button>Connect</Button>;
}

function Variant(props: {
  team: Team;
  type: "mobile" | "desktop";
  currentProject?: Project;
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  const getChangelogsStub = () => Promise.resolve([]);
  const getInboxNotificationsStub = () => Promise.resolve([]);
  const markNotificationAsReadStub = () => Promise.resolve();

  return (
    <div className="border-y bg-card">
      <Comp
        teamsAndProjects={teamsAndProjectsStub}
        currentTeam={props.team}
        currentProject={undefined}
        accountAddress={"0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37"}
        account={{
          email: "foo@example.com",
          id: "foo",
        }}
        logout={() => {}}
        connectButton={<ConnectButtonStub />}
        createProject={() => {}}
        client={storybookThirdwebClient}
        getChangelogNotifications={getChangelogsStub}
        getInboxNotifications={getInboxNotificationsStub}
        markNotificationAsRead={markNotificationAsReadStub}
      />
    </div>
  );
}

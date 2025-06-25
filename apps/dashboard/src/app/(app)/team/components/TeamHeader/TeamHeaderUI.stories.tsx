import type { Meta, StoryObj } from "@storybook/nextjs";
import { BoxIcon } from "lucide-react";
import { ThirdwebProvider } from "thirdweb/react";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { teamsAndProjectsStub } from "@/storybook/stubs";
import {
  BadgeContainer,
  mobileViewport,
  storybookThirdwebClient,
} from "@/storybook/utils";
import { TeamHeaderDesktopUI, TeamHeaderMobileUI } from "./TeamHeaderUI";

const meta = {
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Headers/TeamHeader",
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

function Variants(props: { type: "mobile" | "desktop" }) {
  const freeTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "free",
  );
  const starterTeam = teamsAndProjectsStub.find(
    (t) => t.team.billingPlan === "starter",
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
    !proTeam
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
            currentProject={proTeam.projects[0]}
            team={proTeam.team}
            type={props.type}
          />
        </BadgeContainer>

        <BadgeContainer label="Pro Plan - active subpage">
          <Variant
            currentProject={proTeam.projects[0]}
            currentProjectSubpath={{
              href: "/team/project/foo",
              icon: <BoxIcon />,
              label: "Foo",
            }}
            team={proTeam.team}
            type={props.type}
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
  currentProjectSubpath?: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
}) {
  const Comp =
    props.type === "mobile" ? TeamHeaderMobileUI : TeamHeaderDesktopUI;

  return (
    <div className="border-y bg-card">
      <Comp
        account={{
          email: "foo@example.com",
          id: "foo",
        }}
        accountAddress={"0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37"}
        client={storybookThirdwebClient}
        connectButton={<ConnectButtonStub />}
        createProject={() => {}}
        createTeam={() => {}}
        currentProject={undefined}
        currentProjectSubpath={props.currentProjectSubpath}
        currentTeam={props.team}
        logout={() => {}}
        teamsAndProjects={teamsAndProjectsStub}
      />
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/nextjs";
import { teamStub } from "@/storybook/stubs";
import {
  BadgeContainer,
  mobileViewport,
  storybookThirdwebClient,
} from "@/storybook/utils";
import { TeamSettingsSidebar } from "../_components/sidebar/TeamSettingsSidebar";
import { TeamSettingsMobileNav } from "../_components/sidebar/TeamsMobileNav";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Team/Settings/components/Sidebar",
} satisfies Meta<typeof Story>;

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

function Story(props: { type: "mobile" | "desktop" }) {
  return (
    <div className="container min-h-dvh py-6 text-foreground">
      {props.type === "desktop" && (
        <div className="flex flex-col gap-10">
          <BadgeContainer label="account loaded">
            <TeamSettingsSidebar
              account={{
                id: "x",
              }}
              client={storybookThirdwebClient}
              team={teamStub("foo", "free")}
            />
          </BadgeContainer>

          <BadgeContainer label="account loading">
            <TeamSettingsSidebar
              account={undefined}
              client={storybookThirdwebClient}
              team={teamStub("foo", "free")}
            />
          </BadgeContainer>
        </div>
      )}

      {props.type === "mobile" && (
        <div className="flex flex-col gap-4">
          <BadgeContainer label="Mobile - Expanded">
            <TeamSettingsMobileNav
              activeLink={{
                href: "/team/foo/settings",
                name: "Foo",
              }}
              setShowFull={() => {}}
              showFull={true}
              teamSlug="foo"
            />
          </BadgeContainer>

          <BadgeContainer label="Mobile - Mini">
            <TeamSettingsMobileNav
              activeLink={{
                href: "/team/foo/billing",
                name: "Billing",
              }}
              setShowFull={() => {}}
              showFull={false}
              teamSlug="foo"
            />
          </BadgeContainer>
        </div>
      )}
    </div>
  );
}

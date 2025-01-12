import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { teamStub } from "../../../../../../../stories/stubs";
import {
  BadgeContainer,
  mobileViewport,
} from "../../../../../../../stories/utils";
import { TeamSettingsSidebar } from "../_components/sidebar/TeamSettingsSidebar";
import { TeamSettingsMobileNav } from "../_components/sidebar/TeamsMobileNav";

const meta = {
  title: "Team/Settings/components/Sidebar",
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

function Story(props: {
  type: "mobile" | "desktop";
}) {
  return (
    <div className="container min-h-dvh py-6 text-foreground">
      {props.type === "desktop" && (
        <div className="flex flex-col gap-10">
          <BadgeContainer label="account loaded">
            <TeamSettingsSidebar
              team={teamStub("foo", "free")}
              account={{
                id: "x",
              }}
              client={client}
            />
          </BadgeContainer>

          <BadgeContainer label="account loading">
            <TeamSettingsSidebar
              team={teamStub("foo", "free")}
              account={undefined}
              client={client}
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
              teamSlug="foo"
              setShowFull={() => {}}
              showFull={true}
            />
          </BadgeContainer>

          <BadgeContainer label="Mobile - Mini">
            <TeamSettingsMobileNav
              activeLink={{
                href: "/team/foo/billing",
                name: "Billing",
              }}
              teamSlug="foo"
              setShowFull={() => {}}
              showFull={false}
            />
          </BadgeContainer>
        </div>
      )}
    </div>
  );
}

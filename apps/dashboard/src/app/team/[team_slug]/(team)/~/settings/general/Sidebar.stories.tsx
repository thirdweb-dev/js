import type { Meta, StoryObj } from "@storybook/react";
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

function Story(props: {
  type: "mobile" | "desktop";
}) {
  return (
    <div
      className={"min-h-screen text-foreground lg:max-w-[1100px] py-6 mx-auto"}
    >
      {props.type === "desktop" && <TeamSettingsSidebar teamSlug="foo" />}

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

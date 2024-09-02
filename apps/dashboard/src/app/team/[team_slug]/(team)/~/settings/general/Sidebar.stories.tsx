import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../../../../../../@/components/ui/badge";
import { cn } from "../../../../../../../@/lib/utils";
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

export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

export const Light: Story = {
  args: {
    theme: "light",
  },
};

function Story(props: { theme: "light" | "dark" }) {
  return (
    <div
      className={`min-h-screen bg-zinc-800 text-foreground ${
        props.theme === "light" ? "light" : "dark"
      }`}
      data-theme={props.theme}
    >
      <div className="lg:p-10 container max-w-[1100px]">
        <div className="grid gap-8 grid-cols-2">
          <HighlightContainer title="Desktop">
            <TeamSettingsSidebar teamSlug="foo" />
          </HighlightContainer>

          <div>
            <HighlightContainer
              className="max-w-[400px]"
              title="Mobile - full nav"
            >
              <TeamSettingsMobileNav
                activeLink={{
                  href: "/team/foo/settings",
                  name: "Foo",
                }}
                teamSlug="foo"
                setShowFull={() => {}}
                showFull={true}
              />
            </HighlightContainer>

            <HighlightContainer
              className="max-w-[400px]"
              title="Mobile - mini - General Page"
            >
              <TeamSettingsMobileNav
                activeLink={{
                  href: "/team/foo/settings",
                  name: "General",
                }}
                teamSlug="foo"
                setShowFull={() => {}}
                showFull={false}
              />
            </HighlightContainer>

            <HighlightContainer title="Mobile - mini - Billing page">
              <TeamSettingsMobileNav
                activeLink={{
                  href: "/team/foo/billing",
                  name: "Billing",
                }}
                teamSlug="foo"
                setShowFull={() => {}}
                showFull={false}
              />
            </HighlightContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function HighlightContainer(props: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <div>
      <Badge className="mb-2 bg-background"> {props.title} </Badge>
      <div
        className={cn("p-2 mb-10 rounded-lg bg-background", props.className)}
      >
        {props.children}
      </div>
    </div>
  );
}

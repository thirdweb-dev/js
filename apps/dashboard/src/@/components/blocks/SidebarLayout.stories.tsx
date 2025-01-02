import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../stories/utils";
import { SidebarLayout } from "./SidebarLayout";

const meta = {
  title: "blocks/SidebarLayout",
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
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  return (
    <SidebarLayout
      sidebarLinks={[
        {
          href: "/foo",
          label: "consectetur",
        },
        {
          href: "/bar",
          label: "adipiscing",
        },
        {
          href: "/bar",
          label: "eiusmod",
        },
        {
          label: "incididunt",
          href: "https://playground.thirdweb.com/",
        },
      ]}
    >
      <ContentPlaceholder />
    </SidebarLayout>
  );
}

function ContentPlaceholder() {
  return (
    <div className="flex grow items-center justify-center bg-muted">
      <p className="text-3xl text-muted-foreground"> CHILDREN </p>
    </div>
  );
}

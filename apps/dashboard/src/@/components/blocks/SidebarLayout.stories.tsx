import type { Meta, StoryObj } from "@storybook/react";
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

export const Variants: Story = {
  args: {},
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

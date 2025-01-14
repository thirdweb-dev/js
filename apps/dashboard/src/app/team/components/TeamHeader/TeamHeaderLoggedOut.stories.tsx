import type { Meta, StoryObj } from "@storybook/react";
import { mobileViewport } from "../../../../stories/utils";
import {
  TeamHeaderLoggedOutDesktopUI,
  TeamHeaderLoggedOutMobileUI,
} from "./TeamHeaderLoggedOut";

const meta = {
  title: "Headers/TeamHeader/LoggedOut",
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
    props.type === "mobile"
      ? TeamHeaderLoggedOutMobileUI
      : TeamHeaderLoggedOutDesktopUI;

  return (
    <div className="container min-h-dvh bg-zinc-900 py-10">
      <div className="bg-background">
        <Comp />
      </div>
    </div>
  );
}

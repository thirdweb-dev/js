import type { Meta, StoryObj } from "@storybook/react";
import {
  mobileViewport,
  storybookThirdwebClient,
} from "../../../../../stories/utils";
import { HeaderLoggedOut } from "./HeaderLoggedOut";

const meta = {
  title: "Headers/LoggedOut",
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

function Variants() {
  return (
    <div className="background flex min-h-dvh flex-col gap-6">
      <div className="border-b bg-card">
        <HeaderLoggedOut client={storybookThirdwebClient} />
      </div>
    </div>
  );
}

import type { Meta, StoryObj } from "@storybook/nextjs";
import { mobileViewport, storybookThirdwebClient } from "@/storybook/utils";
import { HeaderLoggedOut } from "./HeaderLoggedOut";

const meta = {
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Headers/LoggedOut",
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

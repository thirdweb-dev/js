import type { Meta, StoryObj } from "@storybook/react";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import { mobileViewport } from "../../../stories/utils";
import { AccountSettingsPageUI } from "./AccountSettingsPageUI";

const meta = {
  title: "Account/Pages/Settings",
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
    <ThirdwebProvider>
      <div className="container py-10 max-w-[1132px] mx-auto w-full flex flex-col gap-10">
        <AccountSettingsPageUI
          account={{
            name: "John Doe",
            email: "johndoe@gmail.com",
          }}
        />
      </div>
      <Toaster richColors />
    </ThirdwebProvider>
  );
}

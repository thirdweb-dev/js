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
      <div className="container mx-auto flex w-full max-w-[1132px] flex-col gap-10 py-10">
        <AccountSettingsPageUI
          account={{
            name: "John Doe",
            email: "johndoe@gmail.com",
          }}
          updateAccountImage={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }}
        />
      </div>
      <Toaster richColors />
    </ThirdwebProvider>
  );
}

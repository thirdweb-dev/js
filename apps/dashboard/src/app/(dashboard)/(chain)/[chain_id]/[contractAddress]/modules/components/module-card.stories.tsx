import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { ModuleCardUI } from "./module-card";

const meta = {
  title: "Modules/ModuleCard",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

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

function Component() {
  const removeMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  });

  const contractInfo = {
    name: "Module Name",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore ",
    publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
    version: "1.0.0",
  };

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
        <BadgeContainer label="No Update, No Children, Owner Account">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={true}
          />
        </BadgeContainer>

        <BadgeContainer label="No Update, No Children, Not Owner Account">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={false}
          />
        </BadgeContainer>

        <BadgeContainer label="Update Button (disabled), No Children, Owner">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            updateButton={{
              isDisabled: true,
              isPending: updateMutation.isPending,
              onClick: () => updateMutation.mutateAsync(),
            }}
            isOwnerAccount={true}
          />
        </BadgeContainer>

        <BadgeContainer label="Update Button (enabled), Children, Owner">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            updateButton={{
              isDisabled: false,
              isPending: updateMutation.isPending,
              onClick: () => updateMutation.mutateAsync(),
            }}
            isOwnerAccount={true}
          >
            <div className="flex h-36 items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm">
              CHILDREN
            </div>
          </ModuleCardUI>
        </BadgeContainer>

        <Toaster richColors />
      </div>
    </ThirdwebProvider>
  );
}

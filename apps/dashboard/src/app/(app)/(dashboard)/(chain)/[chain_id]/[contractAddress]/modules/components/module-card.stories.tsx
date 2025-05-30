import { Checkbox } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { ModuleCardUI } from "./module-card";

const meta = {
  title: "Modules/ModuleCard",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  const [isOwner, setIsOwner] = useState(true);

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
        <div className="flex gap-2">
          <Checkbox
            id="terms1"
            checked={isOwner}
            onCheckedChange={(v) => setIsOwner(!!v)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is Owner
            </label>
          </div>
        </div>

        <BadgeContainer label="No Update, No Children">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            client={storybookThirdwebClient}
            isOwnerAccount={isOwner}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Update Button (disabled), No Children">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            client={storybookThirdwebClient}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            updateButton={{
              isDisabled: true,
              isPending: updateMutation.isPending,
              onClick: () => updateMutation.mutateAsync(),
            }}
            isOwnerAccount={isOwner}
          />
        </BadgeContainer>

        <BadgeContainer label="Update Button (enabled), Children, Owner">
          <ModuleCardUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            client={storybookThirdwebClient}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            updateButton={{
              isDisabled: false,
              isPending: updateMutation.isPending,
              onClick: () => updateMutation.mutateAsync(),
            }}
            isOwnerAccount={isOwner}
          >
            <div className="flex h-36 items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm">
              CHILDREN
            </div>
          </ModuleCardUI>
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

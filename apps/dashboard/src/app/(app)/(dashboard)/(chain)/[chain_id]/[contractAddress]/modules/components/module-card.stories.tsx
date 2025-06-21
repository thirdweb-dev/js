import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { Checkbox } from "@/components/ui/checkbox";
import { ModuleCardUI } from "./module-card";

const meta = {
  component: Component,
  title: "Modules/ModuleCard",
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
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore ",
    name: "Module Name",
    publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
    version: "1.0.0",
  };

  const terms1Id = useId();

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
        <div className="flex gap-2">
          <Checkbox
            checked={isOwner}
            id={terms1Id}
            onCheckedChange={(v) => setIsOwner(!!v)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={terms1Id}
            >
              Is Owner
            </label>
          </div>
        </div>

        <BadgeContainer label="No Update, No Children">
          <ModuleCardUI
            client={storybookThirdwebClient}
            contractInfo={contractInfo}
            isOwnerAccount={isOwner}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Update Button (disabled), No Children">
          <ModuleCardUI
            client={storybookThirdwebClient}
            contractInfo={contractInfo}
            isOwnerAccount={isOwner}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
            updateButton={{
              isDisabled: true,
              isPending: updateMutation.isPending,
              onClick: () => updateMutation.mutateAsync(),
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Update Button (enabled), Children, Owner">
          <ModuleCardUI
            client={storybookThirdwebClient}
            contractInfo={contractInfo}
            isOwnerAccount={isOwner}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
            updateButton={{
              isDisabled: false,
              isPending: updateMutation.isPending,
              onClick: () => updateMutation.mutateAsync(),
            }}
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

import { Checkbox } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import {
  type TransferableModuleFormValues,
  TransferableModuleUI,
} from "./Transferable";

const meta = {
  title: "Modules/Transferable",
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const testAddress1 = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  async function updateStub(values: TransferableModuleFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const removeMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess() {
      toast.success("Module removed successfully");
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
      <div className="container flex max-w-6xl flex-col gap-10 py-10">
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

        <div>
          <ConnectButton client={storybookThirdwebClient} />
        </div>

        <BadgeContainer label="Empty AllowList, Not Restricted">
          <TransferableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            isRestricted={false}
            adminAddress={testAddress1}
            update={updateStub}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            isLoggedIn={true}
          />
        </BadgeContainer>

        <BadgeContainer label="Empty AllowList, Restricted">
          <TransferableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            isRestricted={true}
            adminAddress={testAddress1}
            update={updateStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            isLoggedIn={true}
          />
        </BadgeContainer>

        <BadgeContainer label="Pending">
          <TransferableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={true}
            adminAddress={testAddress1}
            isRestricted={false}
            update={updateStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            isLoggedIn={true}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

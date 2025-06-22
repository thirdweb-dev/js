import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import {
  type TransferableModuleFormValues,
  TransferableModuleUI,
} from "./Transferable";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Modules/Transferable",
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
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore ",
    name: "Module Name",
    publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
    version: "1.0.0",
  };

  const terms1Id = useId();

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-6xl flex-col gap-10 py-10">
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

        <div>
          <ConnectButton client={storybookThirdwebClient} />
        </div>

        <BadgeContainer label="Empty AllowList, Not Restricted">
          <TransferableModuleUI
            adminAddress={testAddress1}
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            isRestricted={false}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
            update={updateStub}
          />
        </BadgeContainer>

        <BadgeContainer label="Empty AllowList, Restricted">
          <TransferableModuleUI
            adminAddress={testAddress1}
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            isRestricted={true}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
            update={updateStub}
          />
        </BadgeContainer>

        <BadgeContainer label="Pending">
          <TransferableModuleUI
            adminAddress={testAddress1}
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={true}
            isRestricted={false}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
            update={updateStub}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

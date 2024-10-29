import { Checkbox } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import { type MintableModuleFormValues, MintableModuleUI } from "./Mintable";

const meta = {
  title: "Modules/Mintable",
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

const testAddress1 = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  async function updateStub(values: MintableModuleFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function mintStub(values: MintableModuleFormValues) {
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
      <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
        <div className="items-top flex space-x-2">
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

        <BadgeContainer label="Empty Primary Sale Recipient">
          <MintableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            primarySaleRecipient={""}
            update={updateStub}
            mint={mintStub}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
          />
        </BadgeContainer>

        <BadgeContainer label="Filled Primary Sale Recipient">
          <MintableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            primarySaleRecipient={testAddress1}
            update={updateStub}
            mint={mintStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
          />
        </BadgeContainer>

        <BadgeContainer label="Pending">
          <MintableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={true}
            primarySaleRecipient={testAddress1}
            update={updateStub}
            mint={mintStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
          />
        </BadgeContainer>

        <Toaster richColors />
      </div>
    </ThirdwebProvider>
  );
}

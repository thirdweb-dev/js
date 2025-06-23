import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import {
  OpenEditionMetadataModuleUI,
  type SetSharedMetadataFormValues,
} from "./OpenEditionMetadata";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Modules/OpenEditionMetadata",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  async function setSharedMetadataStub(values: SetSharedMetadataFormValues) {
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
      <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
        <div>
          <ConnectButton client={storybookThirdwebClient} />
        </div>

        <div className="flex gap-2">
          <Checkbox
            checked={isOwner}
            id={terms1Id}
            onCheckedChange={(v) => setIsOwner(!!v)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="terms1"
            >
              Is Owner
            </label>
          </div>
        </div>

        <BadgeContainer label="Default">
          <OpenEditionMetadataModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            moduleAddress="0x0000000000000000000000000000000000000000"
            setSharedMetadata={setSharedMetadataStub}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

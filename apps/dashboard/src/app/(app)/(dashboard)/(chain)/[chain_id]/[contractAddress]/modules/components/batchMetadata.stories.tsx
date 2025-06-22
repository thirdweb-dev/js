import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { ZERO_ADDRESS } from "thirdweb";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Checkbox } from "@/components/ui/checkbox";
import type { TransactionError } from "@/contexts/error-handler";
import { BadgeContainer, storybookThirdwebClient } from "@/storybook/utils";
import {
  BatchMetadataModuleUI,
  type UploadMetadataFormValues,
} from "./BatchMetadata";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Modules/BatchMetadata",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  const [isOwner, setIsOwner] = useState(true);

  async function uploadMetadataStub(values: UploadMetadataFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const error = new Error("Upload failed");
    (error as TransactionError).reason = "This is a test reason error";
    (error as TransactionError).info = {
      from: ZERO_ADDRESS,
      network: {
        chainId: 1,
        name: "test",
      },
      to: ZERO_ADDRESS,
    };
    throw error;
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

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-6xl flex-col gap-10 py-10">
        <div>
          <ConnectButton client={storybookThirdwebClient} />
        </div>

        <div className="flex items-center gap-5">
          <CheckboxWithLabel
            label="Is Owner"
            onChange={setIsOwner}
            value={isOwner}
          />
        </div>

        <BadgeContainer label="Default">
          <BatchMetadataModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            moduleAddress="0x0000000000000000000000000000000000000000"
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
            uploadMetadata={uploadMetadataStub}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function CheckboxWithLabel(props: {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  const id = useId();
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        checked={props.value}
        id={id}
        onCheckedChange={(v) => props.onChange(!!v)}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={id}
        >
          {props.label}
        </label>
      </div>
    </div>
  );
}

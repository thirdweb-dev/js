import { Checkbox } from "@/components/ui/checkbox";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ZERO_ADDRESS } from "thirdweb";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import {
  ErrorProvider,
  type TransactionError,
} from "../../../../../../../contexts/error-handler";
import {
  BatchMetadataModuleUI,
  type UploadMetadataFormValues,
} from "./BatchMetadata";

const meta = {
  title: "Modules/BatchMetadata",
  component: Component,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
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
  const [isOwner, setIsOwner] = useState(true);

  async function uploadMetadataStub(values: UploadMetadataFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const error = new Error("Upload failed");
    (error as TransactionError).reason = "This is a test reason error";
    (error as TransactionError).info = {
      from: ZERO_ADDRESS,
      to: ZERO_ADDRESS,
      network: {
        name: "test",
        chainId: 1,
      },
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
    name: "Module Name",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore ",
    publisher: "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024",
    version: "1.0.0",
  };

  return (
    <ThirdwebProvider>
      <ErrorProvider>
        <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
          <div>
            <ConnectButton client={getThirdwebClient()} />
          </div>

          <div className="flex items-center gap-5">
            <CheckboxWithLabel
              value={isOwner}
              onChange={setIsOwner}
              id="isOwner"
              label="Is Owner"
            />
          </div>

          <BadgeContainer label="Default">
            <BatchMetadataModuleUI
              contractInfo={contractInfo}
              moduleAddress="0x0000000000000000000000000000000000000000"
              uploadMetadata={uploadMetadataStub}
              uninstallButton={{
                onClick: async () => removeMutation.mutateAsync(),
                isPending: removeMutation.isPending,
              }}
              isOwnerAccount={isOwner}
              contractChainId={1}
            />
          </BadgeContainer>
          <Toaster richColors />
        </div>
      </ErrorProvider>
    </ThirdwebProvider>
  );
}

function CheckboxWithLabel(props: {
  value: boolean;
  onChange: (value: boolean) => void;
  id: string;
  label: string;
}) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        id={props.id}
        checked={props.value}
        onCheckedChange={(v) => props.onChange(!!v)}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={props.id}
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {props.label}
        </label>
      </div>
    </div>
  );
}

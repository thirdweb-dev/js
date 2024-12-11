import { Checkbox } from "@/components/ui/checkbox";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { accountStub } from "../../../../../../../stories/stubs";
import {
  type DefaultRoyaltyFormValues,
  type RoyaltyInfoFormValues,
  RoyaltyModuleUI,
  type TransferValidatorFormValues,
} from "./Royalty";

const meta = {
  title: "Modules/Royalty",
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

const _testAddress1 = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  async function setRoyaltyInfoForToken(values: RoyaltyInfoFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function setDefaultRoyaltyInfoStub(values: DefaultRoyaltyFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function setTransferValidatorStub(values: TransferValidatorFormValues) {
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

  const twAccount = accountStub();

  return (
    <ThirdwebProvider>
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

        <BadgeContainer label="Empty Transfer Validator & Default Royalty Info">
          <RoyaltyModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setTransferValidator={setTransferValidatorStub}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            twAccount={twAccount}
          />
        </BadgeContainer>

        <BadgeContainer label="Empty Transfer Validator & Non-Empty Default Royalty Info">
          <RoyaltyModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setTransferValidator={setTransferValidatorStub}
            defaultRoyaltyInfo={[_testAddress1, 100]}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            twAccount={twAccount}
          />
        </BadgeContainer>

        <BadgeContainer label="Non-Empty Transfer Validator & Empty Default Royalty Info">
          <RoyaltyModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setTransferValidator={setTransferValidatorStub}
            transferValidator={"0x0000000000000000000000000000000000000000"}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            twAccount={twAccount}
          />
        </BadgeContainer>

        <BadgeContainer label="Non-Empty Transfer Validator & Default Royalty Info">
          <RoyaltyModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setTransferValidator={setTransferValidatorStub}
            defaultRoyaltyInfo={[_testAddress1, 100]}
            transferValidator={"0x0000000000000000000000000000000000000000"}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            contractChainId={1}
            twAccount={twAccount}
          />
        </BadgeContainer>

        <Toaster richColors />
      </div>
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

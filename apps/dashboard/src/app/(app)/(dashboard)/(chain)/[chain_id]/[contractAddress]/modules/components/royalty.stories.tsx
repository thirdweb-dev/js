import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type DefaultRoyaltyFormValues,
  type RoyaltyInfoFormValues,
  RoyaltyModuleUI,
  type TransferValidatorFormValues,
} from "./Royalty";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Modules/Royalty",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
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

        <BadgeContainer label="Empty Transfer Validator & Default Royalty Info">
          <RoyaltyModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            moduleAddress="0x0000000000000000000000000000000000000000"
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setTransferValidator={setTransferValidatorStub}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Empty Transfer Validator & Non-Empty Default Royalty Info">
          <RoyaltyModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            defaultRoyaltyInfo={[_testAddress1, 100]}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            moduleAddress="0x0000000000000000000000000000000000000000"
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setTransferValidator={setTransferValidatorStub}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Non-Empty Transfer Validator & Empty Default Royalty Info">
          <RoyaltyModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            moduleAddress="0x0000000000000000000000000000000000000000"
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setTransferValidator={setTransferValidatorStub}
            transferValidator={"0x0000000000000000000000000000000000000000"}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
          />
        </BadgeContainer>

        <BadgeContainer label="Non-Empty Transfer Validator & Default Royalty Info">
          <RoyaltyModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            defaultRoyaltyInfo={[_testAddress1, 100]}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            moduleAddress="0x0000000000000000000000000000000000000000"
            setDefaultRoyaltyInfo={setDefaultRoyaltyInfoStub}
            setRoyaltyInfoForToken={setRoyaltyInfoForToken}
            setTransferValidator={setTransferValidatorStub}
            transferValidator={"0x0000000000000000000000000000000000000000"}
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

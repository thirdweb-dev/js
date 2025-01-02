"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { accountStub } from "../../../../../../../stories/stubs";
import {
  type MintFormValues,
  MintableModuleUI,
  type UpdateFormValues,
} from "./Mintable";

const meta = {
  title: "Modules/Mintable",
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

const testAddress1 = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  const [name, setName] = useState("MintableERC721");
  const [isBatchMetadataInstalled, setIsBatchMetadataInstalled] =
    useState(false);
  async function updatePrimaryRecipientStub(values: UpdateFormValues) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function mintStub(values: MintFormValues) {
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

        <div className="flex flex-wrap items-center gap-5">
          <CheckboxWithLabel
            value={isOwner}
            onChange={setIsOwner}
            id="isOwner"
            label="Is Owner"
          />

          <CheckboxWithLabel
            value={isBatchMetadataInstalled}
            onChange={setIsBatchMetadataInstalled}
            id="isBatchMetadataInstalled"
            label="isBatchMetadataInstalled"
          />

          <Select value={name} onValueChange={(v) => setName(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MintableERC721">MintableERC721</SelectItem>
              <SelectItem value="MintableERC1155">MintableERC1155</SelectItem>
              <SelectItem value="MintableERC20">MintableERC20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <BadgeContainer label="Empty Primary Sale Recipient">
          <MintableModuleUI
            twAccount={twAccount}
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            primarySaleRecipient={""}
            updatePrimaryRecipient={updatePrimaryRecipientStub}
            mint={mintStub}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            name={name}
            isBatchMetadataInstalled={isBatchMetadataInstalled}
            contractChainId={1}
          />
        </BadgeContainer>

        <BadgeContainer label="Filled Primary Sale Recipient">
          <MintableModuleUI
            twAccount={twAccount}
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={false}
            primarySaleRecipient={testAddress1}
            updatePrimaryRecipient={updatePrimaryRecipientStub}
            mint={mintStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            name={name}
            isBatchMetadataInstalled={isBatchMetadataInstalled}
            contractChainId={1}
          />
        </BadgeContainer>

        <BadgeContainer label="Pending">
          <MintableModuleUI
            twAccount={twAccount}
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPending={true}
            primarySaleRecipient={testAddress1}
            updatePrimaryRecipient={updatePrimaryRecipientStub}
            mint={mintStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            name={name}
            isBatchMetadataInstalled={isBatchMetadataInstalled}
            contractChainId={1}
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

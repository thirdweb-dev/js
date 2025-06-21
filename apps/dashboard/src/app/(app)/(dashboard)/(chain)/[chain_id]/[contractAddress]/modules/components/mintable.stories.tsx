"use client";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { BadgeContainer, storybookThirdwebClient } from "stories/utils";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MintableModuleUI,
  type MintFormValues,
  type UpdateFormValues,
} from "./Mintable";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Modules/Mintable",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
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

        <div className="flex flex-wrap items-center gap-5">
          <CheckboxWithLabel
            label="Is Owner"
            onChange={setIsOwner}
            value={isOwner}
          />

          <CheckboxWithLabel
            label="isBatchMetadataInstalled"
            onChange={setIsBatchMetadataInstalled}
            value={isBatchMetadataInstalled}
          />

          <Select onValueChange={(v) => setName(v)} value={name}>
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
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isBatchMetadataInstalled={isBatchMetadataInstalled}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            mint={mintStub}
            moduleAddress="0x0000000000000000000000000000000000000000"
            name={name}
            primarySaleRecipient={""}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: async () => removeMutation.mutateAsync(),
            }}
            updatePrimaryRecipient={updatePrimaryRecipientStub}
          />
        </BadgeContainer>

        <BadgeContainer label="Filled Primary Sale Recipient">
          <MintableModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isBatchMetadataInstalled={isBatchMetadataInstalled}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={false}
            mint={mintStub}
            moduleAddress="0x0000000000000000000000000000000000000000"
            name={name}
            primarySaleRecipient={testAddress1}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
            updatePrimaryRecipient={updatePrimaryRecipientStub}
          />
        </BadgeContainer>

        <BadgeContainer label="Pending">
          <MintableModuleUI
            client={storybookThirdwebClient}
            contractChainId={1}
            contractInfo={contractInfo}
            isBatchMetadataInstalled={isBatchMetadataInstalled}
            isLoggedIn={true}
            isOwnerAccount={isOwner}
            isPending={true}
            mint={mintStub}
            moduleAddress="0x0000000000000000000000000000000000000000"
            name={name}
            primarySaleRecipient={testAddress1}
            uninstallButton={{
              isPending: removeMutation.isPending,
              onClick: () => removeMutation.mutateAsync(),
            }}
            updatePrimaryRecipient={updatePrimaryRecipientStub}
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

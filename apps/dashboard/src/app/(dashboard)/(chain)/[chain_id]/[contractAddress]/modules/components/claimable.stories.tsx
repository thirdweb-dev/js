import { Checkbox } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { BadgeContainer, mobileViewport } from "stories/utils";
import { ThirdwebProvider } from "thirdweb/react";
import {
  type ClaimConditionFormValues,
  ClaimableModuleUI,
  type MintFormValues,
  type PrimarySaleRecipientFormValues,
} from "./Claimable";

const meta = {
  title: "Modules/Claimable",
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
  const [isErc721, setIsErc721] = useState(false);
  async function updatePrimarySaleRecipientStub(
    values: PrimarySaleRecipientFormValues,
  ) {
    console.log("submitting", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async function updateClaimConditionStub(values: ClaimConditionFormValues) {
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

  const claimCondition = {
    availableSupply: BigInt(100),
    maxMintPerWallet: BigInt(10),
    pricePerUnit: 10n,
    currency: "0x000000000000000000000000000000000000000",
    startTimestamp: 1689092800,
    endTimestamp: 1689092800,
    allowlistMerkleRoot:
      "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
    auxData: "0x",
  };

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
        <div className="flex items-center gap-5">
          <CheckboxWithLabel
            value={isOwner}
            onChange={setIsOwner}
            id="isOwner"
            label="Is Owner"
          />

          <CheckboxWithLabel
            value={isErc721}
            onChange={setIsErc721}
            id="isErc721"
            label="isErc721"
          />
        </div>

        <BadgeContainer label="Empty Primary Sale Recipient">
          <ClaimableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPendingPrimarySaleRecipient={false}
            isPendingClaimCondition={false}
            primarySaleRecipient={""}
            setPrimarySaleRecipient={updatePrimarySaleRecipientStub}
            setClaimCondition={updateClaimConditionStub}
            mint={mintStub}
            uninstallButton={{
              onClick: async () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            isErc721={isErc721}
            claimCondition={claimCondition}
            chainId={1}
            tokenDecimals={18}
          />
        </BadgeContainer>

        <BadgeContainer label="Filled Primary Sale Recipient">
          <ClaimableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPendingPrimarySaleRecipient={false}
            isPendingClaimCondition={false}
            primarySaleRecipient={testAddress1}
            setPrimarySaleRecipient={updatePrimarySaleRecipientStub}
            setClaimCondition={updateClaimConditionStub}
            mint={mintStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            isErc721={isErc721}
            claimCondition={claimCondition}
            chainId={1}
            tokenDecimals={18}
          />
        </BadgeContainer>

        <BadgeContainer label="Pending">
          <ClaimableModuleUI
            contractInfo={contractInfo}
            moduleAddress="0x0000000000000000000000000000000000000000"
            isPendingPrimarySaleRecipient={false}
            isPendingClaimCondition={false}
            primarySaleRecipient={testAddress1}
            setClaimCondition={updateClaimConditionStub}
            setPrimarySaleRecipient={updatePrimarySaleRecipientStub}
            mint={mintStub}
            uninstallButton={{
              onClick: () => removeMutation.mutateAsync(),
              isPending: removeMutation.isPending,
            }}
            isOwnerAccount={isOwner}
            isErc721={isErc721}
            claimCondition={claimCondition}
            chainId={1}
            tokenDecimals={18}
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

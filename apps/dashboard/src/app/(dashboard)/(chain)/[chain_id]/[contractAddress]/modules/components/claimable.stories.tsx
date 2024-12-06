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
import { subDays } from "date-fns";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { mobileViewport } from "stories/utils";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "thirdweb";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import {
  type ClaimConditionFormValues,
  type ClaimConditionValue,
  ClaimableModuleUI,
  type MintFormValues,
  type PrimarySaleRecipientFormValues,
} from "./Claimable";

const meta = {
  title: "Modules/Claimable",
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

const claimCondition = {
  availableSupply: BigInt(100),
  maxMintPerWallet: BigInt(10),
  pricePerUnit: 10000000000000000000n,
  // we get checksummed NATIVE_TOKEN_ADDRESS from claim condition query for native token
  currency: checksumAddress(NATIVE_TOKEN_ADDRESS),
  // last week
  startTimestamp: subDays(new Date(), 7).getTime() / 1000,
  endTimestamp: new Date().getTime() / 1000,
  allowlistMerkleRoot: ZERO_ADDRESS,
  auxData: "0x",
} as ClaimConditionValue;

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  const [name, setName] = useState("ClaimableERC721");
  const [isClaimConditionLoading, setIsClaimConditionLoading] = useState(false);
  const [isPrimarySaleRecipientLoading, setIsPrimarySaleRecipientLoading] =
    useState(false);
  const [tokenId, setTokenId] = useState("");
  const [noClaimConditionSet, setNoClaimConditionSet] = useState(false);

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

          <CheckboxWithLabel
            value={isClaimConditionLoading}
            onChange={setIsClaimConditionLoading}
            id="isClaimConditionLoading"
            label="Claim Condition Section Loading"
          />

          <CheckboxWithLabel
            value={isPrimarySaleRecipientLoading}
            onChange={setIsPrimarySaleRecipientLoading}
            id="isPrimarySaleRecipientLoading"
            label="Primary Sale Recipient Section Loading"
          />

          <CheckboxWithLabel
            value={noClaimConditionSet}
            onChange={setNoClaimConditionSet}
            id="noClaimConditionSet"
            label="No Claim Condition Set"
          />
        </div>

        <ClaimableModuleUI
          contractInfo={contractInfo}
          moduleAddress="0x0000000000000000000000000000000000000000"
          primarySaleRecipientSection={{
            data: isPrimarySaleRecipientLoading
              ? undefined
              : {
                  primarySaleRecipient: testAddress1,
                },
            setPrimarySaleRecipient: updatePrimarySaleRecipientStub,
          }}
          claimConditionSection={{
            data:
              isClaimConditionLoading ||
              (name === "MintableERC1155" && !tokenId)
                ? undefined
                : {
                    claimCondition,
                    currencyDecimals: 18,
                    tokenDecimals: 18,
                  },
            isLoading: false,
            setClaimCondition: updateClaimConditionStub,
            tokenId,
          }}
          mintSection={{
            mint: mintStub,
          }}
          uninstallButton={{
            onClick: async () => removeMutation.mutateAsync(),
            isPending: removeMutation.isPending,
          }}
          isOwnerAccount={isOwner}
          name={name}
          contractChainId={1}
          setTokenId={setTokenId}
          isValidTokenId={true}
          noClaimConditionSet={noClaimConditionSet}
        />

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

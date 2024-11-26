import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { Checkbox } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { mobileViewport } from "stories/utils";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import { CustomConnectWallet } from "../../../../../../../@3rdweb-sdk/react/components/connect-wallet";
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
  const [isErc721, setIsErc721] = useState(false);
  const [isErc20, setIsErc20] = useState(false);
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

  // Todo - remove chakra provider after converting Transaction Button
  return (
    <ChakraProviderSetup>
      <ThirdwebProvider>
        <div className="container flex max-w-[1150px] flex-col gap-10 py-10">
          <div>
            <CustomConnectWallet loginRequired={false} />
          </div>

          <div className="flex flex-wrap items-center gap-5">
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

            <CheckboxWithLabel
              value={isErc20}
              onChange={setIsErc20}
              id="isErc20"
              label="isErc20"
            />

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
                isClaimConditionLoading || (!isErc721 && !tokenId)
                  ? undefined
                  : {
                      claimCondition,
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
            isErc721={isErc721}
            isErc20={isErc20}
            contractChainId={1}
            setTokenId={setTokenId}
            isValidTokenId={true}
            noClaimConditionSet={noClaimConditionSet}
          />

          <Toaster richColors />
        </div>
      </ThirdwebProvider>
    </ChakraProviderSetup>
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

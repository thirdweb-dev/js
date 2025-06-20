import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useId, useState } from "react";
import { toast } from "sonner";
import { storybookThirdwebClient } from "stories/utils";
import { NATIVE_TOKEN_ADDRESS, ZERO_ADDRESS } from "thirdweb";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { checksumAddress } from "thirdweb/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClaimableModuleUI,
  type ClaimConditionFormValues,
  type ClaimConditionValue,
  type MintFormValues,
  type PrimarySaleRecipientFormValues,
} from "./Claimable";

const meta = {
  component: Component,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Modules/Claimable",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const testAddress1 = "0x1F846F6DAE38E1C88D71EAA191760B15f38B7A37";

const claimCondition = {
  allowlistMerkleRoot: ZERO_ADDRESS,
  auxData: "0x",
  availableSupply: BigInt(100),
  // we get checksummed NATIVE_TOKEN_ADDRESS from claim condition query for native token
  currency: checksumAddress(NATIVE_TOKEN_ADDRESS),
  endTimestamp: Date.now() / 1000,
  maxMintPerWallet: BigInt(10),
  pricePerUnit: 10000000000000000000n,
  // last week
  startTimestamp: subDays(new Date(), 7).getTime() / 1000,
} as ClaimConditionValue;

function Component() {
  const [isOwner, setIsOwner] = useState(true);
  const [name, setName] = useState("MintableERC721");
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

          <CheckboxWithLabel
            label="Claim Condition Section Loading"
            onChange={setIsClaimConditionLoading}
            value={isClaimConditionLoading}
          />

          <CheckboxWithLabel
            label="Primary Sale Recipient Section Loading"
            onChange={setIsPrimarySaleRecipientLoading}
            value={isPrimarySaleRecipientLoading}
          />

          <CheckboxWithLabel
            label="No Claim Condition Set"
            onChange={setNoClaimConditionSet}
            value={noClaimConditionSet}
          />
        </div>

        <ClaimableModuleUI
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
          client={storybookThirdwebClient}
          contractChainId={1}
          contractInfo={contractInfo}
          isLoggedIn={true}
          isOwnerAccount={isOwner}
          isValidTokenId={true}
          mintSection={{
            mint: mintStub,
          }}
          moduleAddress="0x0000000000000000000000000000000000000000"
          name={name}
          noClaimConditionSet={noClaimConditionSet}
          primarySaleRecipientSection={{
            data: isPrimarySaleRecipientLoading
              ? undefined
              : {
                  primarySaleRecipient: testAddress1,
                },
            setPrimarySaleRecipient: updatePrimarySaleRecipientStub,
          }}
          setTokenId={setTokenId}
          uninstallButton={{
            isPending: removeMutation.isPending,
            onClick: async () => removeMutation.mutateAsync(),
          }}
        />
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

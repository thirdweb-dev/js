import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { BadgeContainer, storybookThirdwebClient } from "../../stories/utils";
import { TransactionButton } from "./TransactionButton";

const meta = {
  title: "blocks/TransactionButton",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  const [chainId, setChainId] = useState(137);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-6xl flex-col gap-10 py-10">
        <FormFieldSetup
          htmlFor="chain-id"
          label="Transaction Chain Id"
          isRequired={false}
          errorMessage={undefined}
        >
          <Select
            value={`${chainId}`}
            onValueChange={(v) => {
              setChainId(Number.parseInt(v));
            }}
          >
            <SelectTrigger className="w-[180px]" id="chain-id">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[137, 1, 8453, 10].map((item) => {
                  return (
                    <SelectItem key={item} value={`${item}`}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormFieldSetup>

        <div className="flex items-center gap-2">
          Is Logged In
          <Switch
            checked={isLoggedIn}
            onCheckedChange={(v) => setIsLoggedIn(v)}
          />
        </div>

        <div>
          <ConnectButton client={storybookThirdwebClient} />
        </div>

        <Variant
          label="No Transactions"
          transactionCount={undefined}
          chainId={chainId}
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="1 Transaction"
          transactionCount={1}
          chainId={chainId}
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="1 Transaction + children"
          transactionCount={1}
          chainId={chainId}
          isLoggedIn={isLoggedIn}
        >
          <div className="flex items-center gap-2">
            <StarIcon className="size-4" />
            Execute Tx
          </div>
        </Variant>

        <Variant
          label="No Transaction count + children"
          transactionCount={undefined}
          chainId={chainId}
          isLoggedIn={isLoggedIn}
        >
          <div className="flex items-center gap-2">
            <StarIcon className="size-4" />
            Execute Tx
          </div>
        </Variant>

        <Variant
          label="10 Transaction"
          transactionCount={10}
          chainId={chainId}
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="Destructive Variant"
          transactionCount={1}
          chainId={chainId}
          variant="destructive"
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="Destructive Variant, No Tx count"
          transactionCount={undefined}
          chainId={chainId}
          variant="destructive"
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="class applied"
          transactionCount={undefined}
          chainId={chainId}
          className="min-w-[300px]"
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="size - sm"
          transactionCount={undefined}
          chainId={chainId}
          size="sm"
          isLoggedIn={isLoggedIn}
        />

        <Variant
          label="disabled"
          transactionCount={undefined}
          chainId={chainId}
          disabled
          isLoggedIn={isLoggedIn}
        />
      </div>
    </ThirdwebProvider>
  );
}

function Variant(props: {
  label: string;
  transactionCount: number | undefined;
  chainId: number;
  variant?: "primary" | "destructive";
  className?: string;
  size?: "sm";
  disabled?: boolean;
  children?: React.ReactNode;
  isLoggedIn: boolean;
}) {
  const sendTx = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    },
  });

  return (
    <BadgeContainer label={props.label}>
      <TransactionButton
        client={storybookThirdwebClient}
        disabled={props.disabled}
        className={props.className}
        variant={props.variant}
        isPending={sendTx.isPending}
        onClick={() => {
          sendTx.mutate();
        }}
        transactionCount={props.transactionCount}
        txChainID={props.chainId}
        size={props.size}
        isLoggedIn={props.isLoggedIn}
      >
        {props.children || "Execute Tx"}
      </TransactionButton>
    </BadgeContainer>
  );
}

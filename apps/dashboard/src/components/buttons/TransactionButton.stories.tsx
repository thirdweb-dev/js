import type { Meta, StoryObj } from "@storybook/nextjs";
import { useMutation } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { useId, useState } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
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
import { BadgeContainer, storybookThirdwebClient } from "../../stories/utils";
import { TransactionButton } from "./TransactionButton";

const meta = {
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "blocks/TransactionButton",
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Story() {
  const [chainId, setChainId] = useState(137);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const elementId = useId();

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-6xl flex-col gap-10 py-10">
        <FormFieldSetup
          errorMessage={undefined}
          htmlFor={elementId}
          isRequired={false}
          label="Transaction Chain Id"
        >
          <Select
            onValueChange={(v) => {
              setChainId(Number.parseInt(v));
            }}
            value={`${chainId}`}
          >
            <SelectTrigger className="w-[180px]" id={elementId}>
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
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="No Transactions"
          transactionCount={undefined}
        />

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="1 Transaction"
          transactionCount={1}
        />

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="1 Transaction + children"
          transactionCount={1}
        >
          <div className="flex items-center gap-2">
            <StarIcon className="size-4" />
            Execute Tx
          </div>
        </Variant>

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="No Transaction count + children"
          transactionCount={undefined}
        >
          <div className="flex items-center gap-2">
            <StarIcon className="size-4" />
            Execute Tx
          </div>
        </Variant>

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="10 Transaction"
          transactionCount={10}
        />

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="Destructive Variant"
          transactionCount={1}
          variant="destructive"
        />

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="Destructive Variant, No Tx count"
          transactionCount={undefined}
          variant="destructive"
        />

        <Variant
          chainId={chainId}
          className="min-w-[300px]"
          isLoggedIn={isLoggedIn}
          label="class applied"
          transactionCount={undefined}
        />

        <Variant
          chainId={chainId}
          isLoggedIn={isLoggedIn}
          label="size - sm"
          size="sm"
          transactionCount={undefined}
        />

        <Variant
          chainId={chainId}
          disabled
          isLoggedIn={isLoggedIn}
          label="disabled"
          transactionCount={undefined}
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
        className={props.className}
        client={storybookThirdwebClient}
        disabled={props.disabled}
        isLoggedIn={props.isLoggedIn}
        isPending={sendTx.isPending}
        onClick={() => {
          sendTx.mutate();
        }}
        size={props.size}
        transactionCount={props.transactionCount}
        txChainID={props.chainId}
        variant={props.variant}
      >
        {props.children || "Execute Tx"}
      </TransactionButton>
    </BadgeContainer>
  );
}

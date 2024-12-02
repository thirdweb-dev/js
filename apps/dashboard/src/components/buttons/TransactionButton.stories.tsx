import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useMutation } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { mobileViewport } from "../../stories/utils";
import { BadgeContainer } from "../../stories/utils";
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

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Story() {
  const [chainId, setChainId] = useState(137);

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-[900px] flex-col gap-10 py-14">
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

        <div>
          <ConnectButton client={getThirdwebClient()} />
        </div>

        <Variant
          label="No Transactions"
          transactionCount={undefined}
          chainId={chainId}
        />

        <Variant label="1 Transaction" transactionCount={1} chainId={chainId} />

        <Variant
          label="1 Transaction + children"
          transactionCount={1}
          chainId={chainId}
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
        />

        <Variant
          label="Destructive Variant"
          transactionCount={1}
          chainId={chainId}
          variant="destructive"
        />

        <Variant
          label="Destructive Variant, No Tx count"
          transactionCount={undefined}
          chainId={chainId}
          variant="destructive"
        />

        <Variant
          label="class applied"
          transactionCount={undefined}
          chainId={chainId}
          className="min-w-[300px]"
        />

        <Variant
          label="size - sm"
          transactionCount={undefined}
          chainId={chainId}
          size="sm"
        />

        <Variant
          label="disabled"
          transactionCount={undefined}
          chainId={chainId}
          disabled
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
}) {
  const sendTx = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    },
  });

  return (
    <BadgeContainer label={props.label}>
      <TransactionButton
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
      >
        {props.children || "Execute Tx"}
      </TransactionButton>
    </BadgeContainer>
  );
}

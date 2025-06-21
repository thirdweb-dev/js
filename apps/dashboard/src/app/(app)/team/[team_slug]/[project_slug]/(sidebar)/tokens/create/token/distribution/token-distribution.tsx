"use client";

import { useId } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  DistributionBarChart,
  type Segment,
} from "@/components/blocks/distribution-chart";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepCard } from "../../_common/step-card";
import type {
  TokenDistributionForm,
  TokenDistributionFormValues,
} from "../_common/form";
import { TokenAirdropSection } from "./token-airdrop";
import { TokenSaleSection } from "./token-sale";

export function TokenDistributionFieldset(props: {
  accountAddress: string;
  onNext: () => void;
  onPrevious: () => void;
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
  tokenSymbol: string | undefined;
}) {
  const { form } = props;
  const distributionError = getDistributionError(form);

  const supplyId = useId();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onNext)}>
        <StepCard
          nextButton={{
            disabled: !!distributionError,
            type: "submit",
          }}
          prevButton={{
            onClick: props.onPrevious,
          }}
          title="Coin Distribution"
        >
          <div>
            <div className="space-y-6 p-4 md:px-6 md:py-6">
              <FormFieldSetup
                errorMessage={form.formState.errors.supply?.message}
                htmlFor={supplyId}
                isRequired
                label="Total Supply"
              >
                <div className="relative">
                  <Input id={supplyId} {...form.register("supply")} />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    {props.tokenSymbol || "Tokens"}
                  </span>
                </div>
              </FormFieldSetup>

              <div className="flex flex-col gap-3">
                <TokenDistributionBarChart
                  distributionFormValues={form.watch()}
                />

                {distributionError && (
                  <div className="text-destructive-text text-sm">
                    {distributionError}
                  </div>
                )}
              </div>
            </div>

            <TokenAirdropSection client={props.client} form={form} />
            <TokenSaleSection
              chainId={props.chainId}
              client={props.client}
              form={form}
            />
          </div>
        </StepCard>
      </form>
    </Form>
  );
}

function getDistributionError(form: TokenDistributionForm) {
  const supply = Number(form.watch("supply"));
  const totalAirdrop = form.watch("airdropAddresses").reduce((sum, addr) => {
    return sum + SafeNumber(addr.quantity);
  }, 0);

  if (totalAirdrop > supply) {
    return "Total airdrop quantity exceeds total supply";
  }

  const saleSupplyPercentage = SafeNumber(
    form.watch("saleAllocationPercentage"),
  );

  const saleSupply = (saleSupplyPercentage / 100) * supply;
  const ownerSupply = Math.max(supply - totalAirdrop - saleSupply, 0);
  const totalSumOfSupply = totalAirdrop + saleSupply + ownerSupply;

  if (totalSumOfSupply > supply) {
    return "Token distribution exceeds total supply";
  }

  return undefined;
}

function SafeNumber(value: string) {
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

export function TokenDistributionBarChart(props: {
  distributionFormValues: TokenDistributionFormValues;
}) {
  const totalSupply = Number(props.distributionFormValues.supply);
  const totalAirdropSupply =
    props.distributionFormValues.airdropAddresses.reduce(
      (acc, curr) => acc + Number(curr.quantity),
      0,
    );
  const airdropPercentage = (totalAirdropSupply / totalSupply) * 100;
  const salePercentage = Number(
    props.distributionFormValues.saleAllocationPercentage,
  );

  const ownerPercentage = Math.max(100 - airdropPercentage - salePercentage, 0);

  const tokenAllocations: Segment[] = [
    {
      color: "hsl(var(--chart-1))",
      label: "Owner",
      percent: ownerPercentage,
    },
    {
      color: "hsl(var(--chart-3))",
      label: "Airdrop",
      percent: airdropPercentage,
    },
    {
      color: "hsl(var(--chart-4))",
      label: "Sale",
      percent: salePercentage,
    },
  ];

  return (
    <DistributionBarChart segments={tokenAllocations} title="Coin Allocation" />
  );
}

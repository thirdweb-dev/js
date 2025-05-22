"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import {
  DistributionBarChart,
  type Segment,
} from "@/components/blocks/distribution-chart";
import { Input } from "@/components/ui/input";
import type { ThirdwebClient } from "thirdweb";
import { Form } from "../../../../../../../../@/components/ui/form";
import { StepCard } from "../create-token-card";
import type {
  TokenDistributionForm,
  TokenDistributionFormValues,
} from "../form";
import { TokenAirdropSection } from "./token-airdrop";
import { TokenSaleSection } from "./token-sale";

export function TokenDistributionFieldset(props: {
  accountAddress: string;
  onNext: () => void;
  onPrevious: () => void;
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
}) {
  const { form } = props;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onNext)}>
        <StepCard
          title="Token Distribution"
          page="distribution"
          prevButton={{
            onClick: props.onPrevious,
          }}
          nextButton={{
            type: "submit",
          }}
        >
          <div>
            <div className="space-y-6 p-4 md:px-6 md:py-6">
              <FormFieldSetup
                label="Total Supply"
                isRequired
                htmlFor="supply"
                errorMessage={form.formState.errors.supply?.message}
              >
                <div className="relative">
                  <Input id="supply" {...form.register("supply")} />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    Tokens
                  </span>
                </div>
              </FormFieldSetup>

              <TokenDistributionBarChart
                distributionFormValues={form.watch()}
              />
            </div>

            <TokenAirdropSection form={form} />
            <TokenSaleSection
              form={form}
              chainId={props.chainId}
              client={props.client}
            />
          </div>
        </StepCard>
      </form>
    </Form>
  );
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
  const ownerPercentage = 100 - airdropPercentage - salePercentage;

  const tokenAllocations: Segment[] = [
    {
      label: "Owner",
      percent: ownerPercentage,
      color: "hsl(var(--chart-1))",
    },
    {
      label: "Airdrop",
      percent: airdropPercentage,
      color: "hsl(var(--chart-3))",
    },
    {
      label: "Sale",
      percent: salePercentage,
      color: "hsl(var(--chart-4))",
    },
  ];

  return (
    <DistributionBarChart
      segments={tokenAllocations}
      title="Token Allocation"
    />
  );
}

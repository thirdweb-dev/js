"use client";

import { DollarSignIcon, XIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { DistributionBarChart } from "@/components/blocks/distribution-chart";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Badge } from "@/components/ui/badge";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAllChainsData } from "@/hooks/chains/allChains";
import type { TokenDistributionForm } from "../_common/form";

export function TokenSaleSection(props: {
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
  isRouterEnabled: boolean;
}) {
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(Number(props.chainId));
  const isSaleEnabled = props.form.watch("saleEnabled");
  const protocolFee = 20;
  const leftOverFee = 100 - protocolFee;
  const convenienceFee = (12.5 * leftOverFee) / 100;
  const deployerFee = leftOverFee - convenienceFee;

  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed px-4 md:px-6 py-8">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-xl tracking-tight">Sale</h2>
              <p className="text-muted-foreground text-sm">
                List your coin on a decentralized exchange and earn rewards on
                every trade
              </p>
            </div>

            <Switch
              checked={isSaleEnabled}
              disabled={!props.isRouterEnabled}
              onCheckedChange={(checked) => {
                if (!props.isRouterEnabled) {
                  return;
                }

                props.form.setValue("saleEnabled", checked);

                if (checked && !props.form.getValues("airdropEnabled")) {
                  props.form.setValue(
                    "erc20Asset_poolMode.saleAllocationPercentage",
                    "100",
                    {
                      shouldValidate: true,
                    },
                  );
                } else {
                  props.form.setValue(
                    "erc20Asset_poolMode.saleAllocationPercentage",
                    "0",
                    {
                      shouldValidate: true,
                    },
                  );
                }
              }}
            />
          </div>

          {props.isRouterEnabled === false && (
            <div className="mt-4 flex items-center gap-1.5 fade-in-0 duration-300 animate-in">
              <div className="rounded-full border bg-background p-1">
                <XIcon className="size-3 text-muted-foreground" />
              </div>
              <h2 className="text-muted-foreground text-sm">
                Not Available on {chainMeta?.name || props.chainId}
              </h2>
            </div>
          )}
        </div>

        {isSaleEnabled && props.isRouterEnabled === true && (
          <div className="pt-4 fade-in-0 duration-300 animate-in">
            <PoolConfig
              chainId={props.chainId}
              client={props.client}
              form={props.form}
            />

            <div className="mt-5 border p-4 bg-background rounded-lg relative">
              <div className="flex mb-4">
                <div className="p-2 rounded-full border bg-card">
                  <DollarSignIcon className="size-5 text-muted-foreground" />
                </div>
              </div>
              <h3 className="font-medium text-base mt-2"> Sale Rewards </h3>
              <p className="text-muted-foreground text-sm mb-4">
                All trades on the market are subjected to{" "}
                <em className="text-foreground font-medium not-italic"> 1% </em>{" "}
                fee distributed as:
              </p>

              <div className="relative">
                <div className="absolute -top-6 right-0 text-sm">Total: 1%</div>
                <DistributionBarChart
                  segments={[
                    {
                      label: "Your Wallet",
                      percent: deployerFee,
                      color: "hsl(var(--chart-1))",
                      value: `${deployerFee / 100}%`,
                    },
                    {
                      label: "Protocol",
                      percent: protocolFee,
                      color: "hsl(var(--chart-2))",
                      value: `${protocolFee / 100}%`,
                    },
                    {
                      label: "Convenience fee",
                      percent: convenienceFee,
                      color: "hsl(var(--chart-3))",
                      value: `${convenienceFee / 100}%`,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DynamicHeight>
  );
}

function PoolConfig(props: {
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(Number(props.chainId));

  const totalSupply = Number(props.form.watch("supply"));
  const sellSupply = Math.floor(
    (totalSupply *
      Number(
        props.form.watch("erc20Asset_poolMode.saleAllocationPercentage"),
      )) /
      100,
  );

  return (
    <div className="space-y-6">
      {/* Pricing Strategy */}
      <FormFieldSetup
        isRequired
        label="Pricing Strategy"
        errorMessage={undefined}
        helperText="Bonding Curve pricing is a static formula for pricing tokens based on supply and demand"
      >
        <Select value="bonding-curve">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bonding-curve">Bonding Curve</SelectItem>
            <SelectItem value="fixed-price" disabled>
              <span className="flex items-center gap-2">
                Dynamic Bonding Curve{" "}
                <Badge variant="secondary">Coming Soon</Badge>
              </span>
            </SelectItem>
            <SelectItem value="dutch-auction" disabled>
              <span className="flex items-center gap-2">
                Fixed Price <Badge variant="secondary">Coming Soon</Badge>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldSetup>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:max-w-[536px]">
        {/* supply % */}
        <FormFieldSetup
          errorMessage={
            props.form.formState.errors.erc20Asset_poolMode
              ?.saleAllocationPercentage?.message
          }
          helperText={`${compactNumberFormatter.format(sellSupply)} tokens`}
          isRequired
          label="Sell % of Total Supply"
        >
          <div className="relative">
            <DecimalInput
              maxValue={100}
              onChange={(value) => {
                props.form.setValue(
                  "erc20Asset_poolMode.saleAllocationPercentage",
                  value,
                  {
                    shouldValidate: true,
                  },
                );
              }}
              value={props.form.watch(
                "erc20Asset_poolMode.saleAllocationPercentage",
              )}
            />
            <span className="-translate-y-1/2 absolute top-1/2 right-3 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </FormFieldSetup>

        {/* starting price */}
        <FormFieldSetup
          errorMessage={
            props.form.formState.errors.erc20Asset_poolMode
              ?.startingPricePerToken?.message
          }
          isRequired
          label="Starting price per token"
        >
          <div className="relative">
            <DecimalInput
              className="pr-10"
              onChange={(value) => {
                props.form.setValue(
                  "erc20Asset_poolMode.startingPricePerToken",
                  value,
                  {
                    shouldValidate: true,
                  },
                );
              }}
              value={props.form.watch(
                "erc20Asset_poolMode.startingPricePerToken",
              )}
            />
            <span className="-translate-y-1/2 absolute top-1/2 right-3 text-sm text-muted-foreground">
              {chainMeta?.nativeCurrency.symbol || "ETH"}
            </span>
          </div>
        </FormFieldSetup>
      </div>
    </div>
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 10,
  notation: "compact",
});

"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSignIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb";
import { isRouterEnabled } from "thirdweb/assets";
import { DistributionBarChart } from "@/components/blocks/distribution-chart";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Badge } from "@/components/ui/badge";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
}) {
  const saleMode = props.form.watch("saleMode");
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(Number(props.chainId));
  const [hasUserUpdatedSaleMode, setHasUserUpdatedSaleMode] = useState(false);

  const isRouterEnabledQuery = useQuery({
    queryFn: async () => {
      try {
        return await isRouterEnabled({
          // eslint-disable-next-line no-restricted-syntax
          chain: defineChain(Number(props.chainId)),
          client: props.client,
        });
      } catch {
        return false;
      }
    },
    queryKey: ["isRouterEnabled", props.chainId],
  });

  const isRouterEnabledValue = isRouterEnabledQuery.data === true;

  const isSaleEnabled = saleMode !== "disabled";

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (isRouterEnabledValue === false && isSaleEnabled) {
      props.form.setValue("saleMode", "disabled", {
        shouldValidate: true,
      });
    }
  }, [isRouterEnabledValue, isSaleEnabled, props.form]);

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (
      isRouterEnabledValue === true &&
      !hasUserUpdatedSaleMode &&
      !isSaleEnabled
    ) {
      props.form.setValue("saleMode", "pool", {
        shouldValidate: true,
      });
    }
  }, [isRouterEnabledValue, props.form, hasUserUpdatedSaleMode, isSaleEnabled]);

  const protocolFee = 20;
  const leftOverFee = 100 - protocolFee;
  const convenienceFee = (12.5 * leftOverFee) / 100;
  const deployerFee = leftOverFee - convenienceFee;

  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed p-4 md:p-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">Sale</h2>
              <p className="text-muted-foreground text-sm">
                List your coin on a decentralized exchange and earn rewards on
                every trade
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isRouterEnabledQuery.isPending ? (
                <Spinner className="size-5" />
              ) : (
                <Switch
                  checked={isSaleEnabled}
                  disabled={!isRouterEnabledValue}
                  onCheckedChange={(checked) => {
                    if (!isRouterEnabledValue) {
                      return;
                    }

                    setHasUserUpdatedSaleMode(true);

                    props.form.setValue(
                      "saleMode",
                      checked ? "pool" : "disabled",
                    );

                    if (checked && !props.form.getValues("airdropEnabled")) {
                      props.form.setValue("saleAllocationPercentage", "100", {
                        shouldValidate: true,
                      });
                    } else {
                      props.form.setValue("saleAllocationPercentage", "0", {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}
            </div>
          </div>

          {isRouterEnabledQuery.data === false && (
            <div className="mt-4 flex items-center gap-1.5">
              <div className="rounded-full border bg-background p-1">
                <XIcon className="size-3 text-muted-foreground" />
              </div>
              <h2 className="text-muted-foreground text-sm">
                Not Available on {chainMeta?.name || props.chainId}
              </h2>
            </div>
          )}
        </div>

        {saleMode === "pool" && isRouterEnabledQuery.data === true && (
          <div className="pt-4">
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
    (totalSupply * Number(props.form.watch("saleAllocationPercentage"))) / 100,
  );

  return (
    <div className="grid grid-cols-1 gap-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* supply % */}
        <FormFieldSetup
          errorMessage={
            props.form.formState.errors.saleAllocationPercentage?.message
          }
          helperText={`${compactNumberFormatter.format(sellSupply)} tokens`}
          isRequired
          label="Sell % of Total Supply"
        >
          <div className="relative">
            <DecimalInput
              maxValue={100}
              onChange={(value) => {
                props.form.setValue("saleAllocationPercentage", value, {
                  shouldValidate: true,
                });
              }}
              value={props.form.watch("saleAllocationPercentage")}
            />
            <span className="-translate-y-1/2 absolute top-1/2 right-3 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </FormFieldSetup>

        {/* starting price */}
        <FormFieldSetup
          errorMessage={
            props.form.formState.errors.pool?.startingPricePerToken?.message
          }
          isRequired
          label="Starting price per token"
        >
          <div className="relative">
            <DecimalInput
              className="pr-10"
              onChange={(value) => {
                props.form.setValue("pool.startingPricePerToken", value, {
                  shouldValidate: true,
                });
              }}
              value={props.form.watch("pool.startingPricePerToken")}
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import type { ThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb";
import { isRouterEnabled } from "thirdweb/assets";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Skeleton } from "@/components/ui/skeleton";
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

  const isRouterEnabledQuery = useQuery({
    queryFn: () =>
      isRouterEnabled({
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(Number(props.chainId)),
        client: props.client,
      }),
    queryKey: ["isRouterEnabled", props.chainId],
  });

  const isSaleEnabled = saleMode !== "disabled";

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (isRouterEnabledQuery.data === false && isSaleEnabled) {
      props.form.setValue("saleMode", "disabled", {
        shouldValidate: true,
      });
    }
  }, [isRouterEnabledQuery.data, isSaleEnabled, props.form]);

  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed p-4 md:p-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">Sale</h2>
              <p className="text-muted-foreground text-sm">
                List and add liquidity for your coin on a decentralized exchange
                for purchase at fluctuating market price
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isRouterEnabledQuery.isPending ? (
                <Skeleton className="h-[24px] w-[44px] rounded-full border" />
              ) : (
                <Switch
                  checked={isSaleEnabled}
                  disabled={isRouterEnabledQuery.data !== true}
                  onCheckedChange={(checked) => {
                    if (isRouterEnabledQuery.data !== true) {
                      return;
                    }

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

        {isSaleEnabled && isRouterEnabledQuery.data === true && (
          <div className="space-y-5 pt-4">
            {saleMode === "market" && (
              <PrimarySaleConfig
                chainId={props.chainId}
                client={props.client}
                form={props.form}
              />
            )}

            {saleMode === "pool" && (
              <PoolConfig
                chainId={props.chainId}
                client={props.client}
                form={props.form}
              />
            )}
          </div>
        )}
      </div>
    </DynamicHeight>
  );
}

function PrimarySaleConfig(props: {
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
}) {
  const totalSupply = Number(props.form.watch("supply"));
  const sellSupply = Math.floor(
    (totalSupply * Number(props.form.watch("saleAllocationPercentage"))) / 100,
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
          <span className="-translate-y-1/2 absolute top-1/2 right-3 text-lg text-muted-foreground">
            %
          </span>
        </div>
      </FormFieldSetup>

      {/* price  amount + currency*/}
      <FormFieldSetup
        errorMessage={
          props.form.formState.errors.market?.priceAmount?.message ||
          props.form.formState.errors.market?.currencyAddress?.message
        }
        isRequired
        label="Price"
      >
        <div className="relative flex items-center">
          <DecimalInput
            className="rounded-r-none"
            onChange={(value) => {
              props.form.setValue("market.priceAmount", value, {
                shouldValidate: true,
              });
            }}
            value={props.form.watch("market.priceAmount")}
          />

          <TokenSelector
            addNativeTokenIfMissing={true}
            chainId={Number(props.chainId)}
            className="rounded-l-none border-l-0 bg-background"
            client={props.client}
            disableAddress={true}
            onChange={(value) => {
              props.form.setValue("market.currencyAddress", value.address, {
                shouldValidate: true,
              });
            }}
            selectedToken={{
              address: props.form.watch("market.currencyAddress"),
              chainId: Number(props.chainId),
            }}
            showCheck={true}
          />
        </div>
      </FormFieldSetup>
    </div>
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 10,
  notation: "compact",
});

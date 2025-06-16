"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { useAllChainsData } from "hooks/chains/allChains";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import type { ThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb";
import { isRouterEnabled } from "thirdweb/assets";
import type {
  TokenDistributionForm,
  TokenDistributionFormValues,
} from "../_common/form";

export function TokenSaleSection(props: {
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
}) {
  const isEnabled = props.form.watch("saleMode") !== "disabled";
  const isDirectSale = props.form.watch("saleMode") === "direct-sale";
  const isPublicMarket = props.form.watch("saleMode") === "public-market";
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(Number(props.chainId));

  const isRouterEnabledQuery = useQuery({
    queryKey: ["isRouterEnabled", props.chainId],
    queryFn: () =>
      isRouterEnabled({
        // eslint-disable-next-line no-restricted-syntax
        chain: defineChain(Number(props.chainId)),
        client: props.client,
      }),
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (isRouterEnabledQuery.data === false && isEnabled) {
      props.form.setValue("saleMode", "disabled");
    }
  }, [isRouterEnabledQuery.data, isEnabled, props.form]);

  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed p-4 md:p-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg">Sale</h2>
              <p className="text-muted-foreground text-sm">
                {/* Make your coin available for purchase via Direct Sale or Public
              Market */}
                List and add liquidity for your coin on a decentralized exchange
                for purchase at fluctuating market price
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isRouterEnabledQuery.isPending ? (
                <Skeleton className="h-[24px] w-[44px] rounded-full border" />
              ) : (
                <Switch
                  checked={isEnabled}
                  disabled={isRouterEnabledQuery.data !== true}
                  onCheckedChange={(checked) => {
                    if (isRouterEnabledQuery.data !== true) {
                      return;
                    }

                    props.form.setValue(
                      "saleMode",
                      checked ? "public-market" : "disabled",
                    );
                    if (!checked) {
                      props.form.setValue("saleAllocationPercentage", "0");
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

        {isEnabled && isRouterEnabledQuery.data === true && (
          <div className="space-y-5 pt-4">
            {/* TODO - add this later */}
            {/* <TabButtons
              tabClassName="!text-sm"
              tabIconClassName="size-3.5"
              bottomLineClassName="bg-background border-b border-dashed"
              tabs={[
                {
                  name: "Direct Sale",
                  icon: isDirectSale ? CircleDotIcon : CircleIcon,
                  onClick: () => {
                    props.form.setValue("saleMode", "direct-sale");
                  },
                  isActive: isDirectSale,
                },
                {
                  name: "Public Market",
                  icon: isPublicMarket ? CircleDotIcon : CircleIcon,
                  onClick: () => {
                    props.form.setValue("saleMode", "public-market");
                  },
                  isActive: isPublicMarket,
                },
              ]}
            /> */}

            {isDirectSale && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-base">Direct Sale</h2>
                  <p className="text-muted-foreground text-sm">
                    Make your coin available for purchase by setting a fixed
                    price
                  </p>
                </div>

                <PrimarySaleConfig
                  form={props.form}
                  chainId={props.chainId}
                  client={props.client}
                />
              </div>
            )}

            {isPublicMarket && (
              <div className="space-y-4">
                {/* <div>
                  <h2 className="font-semibold text-base">Public Market</h2>
                  <p className="text-muted-foreground text-sm">
                    List and add liquidity for your coin on a decentralized
                    exchange for purchase at fluctuating market price
                  </p>
                </div> */}

                <PublicMarketConfig
                  form={props.form}
                  chainId={props.chainId}
                  client={props.client}
                />
              </div>
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
        label="Sell % of Total Supply"
        isRequired
        helperText={`${compactNumberFormatter.format(sellSupply)} tokens`}
        errorMessage={
          props.form.formState.errors.saleAllocationPercentage?.message
        }
      >
        <div className="relative">
          <DecimalInput
            maxValue={100}
            value={props.form.watch("saleAllocationPercentage")}
            onChange={(value) => {
              props.form.setValue("saleAllocationPercentage", value);
            }}
          />
          <span className="-translate-y-1/2 absolute top-1/2 right-3 text-lg text-muted-foreground">
            %
          </span>
        </div>
      </FormFieldSetup>

      {/* price  amount + currency*/}
      <FormFieldSetup
        label="Price"
        isRequired
        errorMessage={
          props.form.formState.errors.directSale?.priceAmount?.message ||
          props.form.formState.errors.directSale?.currencyAddress?.message
        }
      >
        <div className="relative flex items-center">
          <DecimalInput
            value={props.form.watch("directSale.priceAmount")}
            className="rounded-r-none"
            onChange={(value) => {
              props.form.setValue("directSale.priceAmount", value);
            }}
          />

          <TokenSelector
            className="rounded-l-none border-l-0 bg-background"
            addNativeTokenIfMissing={true}
            showCheck={true}
            disableAddress={true}
            selectedToken={{
              address: props.form.watch("directSale.currencyAddress"),
              chainId: Number(props.chainId),
            }}
            onChange={(value) => {
              props.form.setValue("directSale.currencyAddress", value.address);
            }}
            client={props.client}
            chainId={Number(props.chainId)}
          />
        </div>
      </FormFieldSetup>
    </div>
  );
}

type TradingFees = TokenDistributionFormValues["publicMarket"]["tradingFees"];
const tradingFeesOptions: TradingFees[] = ["0.01", "0.05", "0.3", "1"];

function PublicMarketConfig(props: {
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
        label="Sell % of Total Supply"
        isRequired
        helperText={`${compactNumberFormatter.format(sellSupply)} tokens`}
        errorMessage={
          props.form.formState.errors.saleAllocationPercentage?.message
        }
      >
        <div className="relative">
          <DecimalInput
            maxValue={100}
            value={props.form.watch("saleAllocationPercentage")}
            onChange={(value) => {
              props.form.setValue("saleAllocationPercentage", value);
            }}
          />
          <span className="-translate-y-1/2 absolute top-1/2 right-3 text-lg text-muted-foreground">
            %
          </span>
        </div>
      </FormFieldSetup>

      {/* trading fees */}
      <FormFieldSetup
        label="Trading Fees"
        isRequired
        errorMessage={
          props.form.formState.errors.saleAllocationPercentage?.message
        }
      >
        <Select
          value={props.form.watch("publicMarket.tradingFees")}
          onValueChange={(value) => {
            props.form.setValue(
              "publicMarket.tradingFees",
              value as TradingFees,
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Fees" />
          </SelectTrigger>
          <SelectContent>
            {tradingFeesOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldSetup>
    </div>
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 10,
});

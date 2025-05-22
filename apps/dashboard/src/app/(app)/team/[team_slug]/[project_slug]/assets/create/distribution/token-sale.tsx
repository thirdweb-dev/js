"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ThirdwebClient } from "thirdweb";
import type { TokenDistributionForm } from "../form";

export function TokenSaleSection(props: {
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
}) {
  const totalSupply = Number(props.form.watch("supply"));
  const sellSupply = Math.floor(
    (totalSupply * Number(props.form.watch("saleAllocationPercentage"))) / 100,
  );

  const isEnabled = props.form.watch("saleEnabled");
  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-lg">Sale</h2>
            <p className="text-muted-foreground text-sm">
              Make your token available for purchase by setting a price
            </p>
          </div>

          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              props.form.setValue("saleEnabled", checked);
              if (!checked) {
                props.form.setValue("saleAllocationPercentage", "0");
                props.form.setValue("salePrice", "0");
              }
            }}
          />
        </div>

        {isEnabled && (
          <div className="mt-4 flex flex-col gap-6">
            <FormFieldSetup
              label="Sell % of Total Supply"
              isRequired
              helperText={`${sellSupply} tokens`}
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
                <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                  %
                </span>
              </div>
            </FormFieldSetup>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormFieldSetup
                label="Price per Token"
                isRequired
                errorMessage={props.form.formState.errors.salePrice?.message}
              >
                <div className="relative">
                  <DecimalInput
                    value={props.form.watch("salePrice")}
                    onChange={(value) => {
                      props.form.setValue("salePrice", value);
                    }}
                  />
                </div>
              </FormFieldSetup>

              <FormFieldSetup
                label="Currency"
                isRequired
                errorMessage={
                  props.form.formState.errors.saleTokenAddress?.message
                }
              >
                <TokenSelector
                  className="bg-background"
                  addNativeTokenIfMissing={true}
                  showCheck={true}
                  disableAddress={true}
                  selectedToken={{
                    address: props.form.watch("saleTokenAddress"),
                    chainId: Number(props.chainId),
                  }}
                  onChange={(value) => {
                    props.form.setValue("saleTokenAddress", value.address);
                  }}
                  client={props.client}
                  chainId={Number(props.chainId)}
                />
              </FormFieldSetup>
            </div>
          </div>
        )}
      </div>
    </DynamicHeight>
  );
}

function DecimalInput(props: {
  value: string;
  onChange: (value: string) => void;
  maxValue?: number;
}) {
  return (
    <Input
      type="text"
      value={props.value}
      inputMode="decimal"
      onChange={(e) => {
        const number = Number(e.target.value);
        // ignore if string becomes invalid number
        if (Number.isNaN(number)) {
          return;
        }

        if (props.maxValue && number > props.maxValue) {
          return;
        }

        // replace leading multiple zeros with single zero
        let cleanedValue = e.target.value.replace(/^0+/, "0");

        // replace leading zero before decimal point
        if (!cleanedValue.includes(".")) {
          cleanedValue = cleanedValue.replace(/^0+/, "");
        }

        props.onChange(cleanedValue || "0");
      }}
    />
  );
}

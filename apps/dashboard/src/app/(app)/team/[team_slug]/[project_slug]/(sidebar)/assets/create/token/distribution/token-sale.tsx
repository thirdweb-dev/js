"use client";

import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Switch } from "@/components/ui/switch";
import type { TokenDistributionForm } from "../_common/form";

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
              Make your coin available for purchase by setting a price
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
              errorMessage={
                props.form.formState.errors.saleAllocationPercentage?.message
              }
              helperText={`${sellSupply} tokens`}
              isRequired
              label="Sell % of Total Supply"
            >
              <div className="relative">
                <DecimalInput
                  maxValue={100}
                  onChange={(value) => {
                    props.form.setValue("saleAllocationPercentage", value);
                  }}
                  value={props.form.watch("saleAllocationPercentage")}
                />
                <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                  %
                </span>
              </div>
            </FormFieldSetup>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <FormFieldSetup
                errorMessage={props.form.formState.errors.salePrice?.message}
                isRequired
                label="Price per Token"
              >
                <div className="relative">
                  <DecimalInput
                    onChange={(value) => {
                      props.form.setValue("salePrice", value);
                    }}
                    value={props.form.watch("salePrice")}
                  />
                </div>
              </FormFieldSetup>

              <FormFieldSetup
                errorMessage={
                  props.form.formState.errors.saleTokenAddress?.message
                }
                isRequired
                label="Currency"
              >
                <TokenSelector
                  addNativeTokenIfMissing={true}
                  chainId={Number(props.chainId)}
                  className="bg-background"
                  client={props.client}
                  disableAddress={true}
                  onChange={(value) => {
                    props.form.setValue("saleTokenAddress", value.address);
                  }}
                  selectedToken={{
                    address: props.form.watch("saleTokenAddress"),
                    chainId: Number(props.chainId),
                  }}
                  showCheck={true}
                />
              </FormFieldSetup>
            </div>
          </div>
        )}
      </div>
    </DynamicHeight>
  );
}

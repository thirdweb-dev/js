"use client";

import type { ThirdwebClient } from "thirdweb";
import { DistributionBarChart } from "@/components/blocks/distribution-chart";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Switch } from "@/components/ui/switch";
import type { TokenDistributionForm } from "../_common/form";

export function DropERC20_TokenSaleSection(props: {
  form: TokenDistributionForm;
  chainId: string;
  client: ThirdwebClient;
}) {
  const totalSupply = Number(props.form.watch("supply"));
  const sellSupply = Math.floor(
    (totalSupply *
      Number(props.form.watch("dropERC20Mode.saleAllocationPercentage"))) /
      100,
  );

  const isEnabled = props.form.watch("saleEnabled");

  const protocolFee = 2;
  const convenienceFee = 0.5;
  const recipientFee = 100 - protocolFee - convenienceFee;

  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">Sale</h2>
            <p className="text-muted-foreground text-sm">
              Make your coin available for purchase by setting a price
            </p>
          </div>

          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              props.form.setValue("saleEnabled", checked);
              if (!checked) {
                props.form.setValue(
                  "dropERC20Mode.saleAllocationPercentage",
                  "0",
                );
                props.form.setValue("dropERC20Mode.pricePerToken", "0");
              } else if (!props.form.getValues("airdropEnabled")) {
                props.form.setValue(
                  "dropERC20Mode.saleAllocationPercentage",
                  "100",
                  {
                    shouldValidate: true,
                  },
                );
              }
            }}
          />
        </div>

        {isEnabled && (
          <div>
            <div className="mt-4 flex flex-col lg:flex-row gap-5 lg:max-w-2xl fade-in-0 duration-300 animate-in">
              <FormFieldSetup
                errorMessage={
                  props.form.formState.errors.dropERC20Mode
                    ?.saleAllocationPercentage?.message
                }
                helperText={`${sellSupply} tokens`}
                isRequired
                label="Sell % of Total Supply"
              >
                <div className="relative lg:w-64">
                  <DecimalInput
                    maxValue={100}
                    onChange={(value) => {
                      props.form.setValue(
                        "dropERC20Mode.saleAllocationPercentage",
                        value,
                      );
                    }}
                    value={props.form.watch(
                      "dropERC20Mode.saleAllocationPercentage",
                    )}
                  />
                  <span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
              </FormFieldSetup>

              <FormFieldSetup
                className="grow"
                errorMessage={
                  props.form.formState.errors.dropERC20Mode?.pricePerToken
                    ?.message ||
                  props.form.formState.errors.dropERC20Mode?.saleTokenAddress
                    ?.message
                }
                isRequired
                label="Price per Token"
              >
                <div className="relative flex items-center">
                  <DecimalInput
                    onChange={(value) => {
                      props.form.setValue("dropERC20Mode.pricePerToken", value);
                    }}
                    value={props.form.watch("dropERC20Mode.pricePerToken")}
                    className="rounded-r-none w-42"
                  />

                  <TokenSelector
                    addNativeTokenIfMissing={true}
                    chainId={Number(props.chainId)}
                    className="bg-background border-l-0 rounded-l-none"
                    client={props.client}
                    disableAddress={true}
                    popoverContentClassName="!w-[320px]"
                    onChange={(value) => {
                      props.form.setValue(
                        "dropERC20Mode.saleTokenAddress",
                        value.address,
                      );
                    }}
                    selectedToken={{
                      address: props.form.watch(
                        "dropERC20Mode.saleTokenAddress",
                      ),
                      chainId: Number(props.chainId),
                    }}
                    showCheck={true}
                  />
                </div>
              </FormFieldSetup>
            </div>

            <div className="mt-5 relative border-t border-dashed pt-5">
              <p className="text-muted-foreground text-sm mb-3">
                All primary sales are subjected to{" "}
                <em className="text-foreground font-medium not-italic">2.5%</em>{" "}
                fee
              </p>

              <div className="relative">
                <DistributionBarChart
                  segments={[
                    {
                      label: "Your Wallet",
                      percent: recipientFee,
                      color: "hsl(var(--chart-1))",
                      value: `${recipientFee}%`,
                    },
                    {
                      label: "Protocol",
                      percent: protocolFee,
                      color: "hsl(var(--chart-2))",
                      value: `${protocolFee}%`,
                    },
                    {
                      label: "Convenience Fee",
                      percent: convenienceFee,
                      color: "hsl(var(--chart-3))",
                      value: `${convenienceFee}%`,
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

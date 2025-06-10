import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Form } from "@/components/ui/form";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import type { UseFormReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { SolidityInput } from "../../../../../../../../../../contract-ui/components/solidity-inputs";
import { StepCard } from "../../_common/step-card";
import type { NFTSalesSettingsFormValues } from "../_common/form";
import { nftCreationPages } from "../_common/pages";

export function SalesSettings(props: {
  onNext: () => void;
  onPrev: () => void;
  form: UseFormReturn<NFTSalesSettingsFormValues>;
  client: ThirdwebClient;
}) {
  const errors = props.form.formState.errors;
  const bpsNumValue = props.form.watch("royaltyBps");

  return (
    <Form {...props.form}>
      <form
        onSubmit={props.form.handleSubmit(() => {
          props.onNext();
        })}
      >
        <StepCard
          tracking={{
            page: nftCreationPages["sales-settings"],
            contractType: "NFTCollection",
          }}
          title="Sales and Fees"
          prevButton={{
            onClick: props.onPrev,
          }}
          nextButton={{
            type: "submit",
          }}
        >
          <div className="px-4 py-6 md:px-6">
            <div className="mb-4 space-y-1">
              <h3 className="font-semibold text-base"> Primary Sales</h3>
              <p className="text-muted-foreground text-sm">
                Set the wallet address that should receive the revenue from
                initial sales of the assets
              </p>
            </div>
            <FormFieldSetup
              className="grow"
              isRequired
              label="Primary Sales Recipient"
              errorMessage={errors.primarySaleRecipient?.message}
            >
              <SolidityInput
                solidityType="address"
                className="bg-background"
                {...props.form.register("primarySaleRecipient")}
                client={props.client}
              />
            </FormFieldSetup>
          </div>

          <div className="border-t border-dashed px-4 py-6 md:px-6">
            <div className="mb-4 space-y-1">
              <h3 className="font-semibold text-base">Royalties</h3>
              <p className="text-muted-foreground text-sm">
                Set the wallet address should receive the revenue from royalties
                earned from secondary sales of the assets
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <FormFieldSetup
                className="grow"
                isRequired
                label="Recipient Address"
                errorMessage={errors.royaltyRecipient?.message}
                helperText={
                  <>
                    The wallet address that should receive the revenue from
                    royalties earned from secondary sales of the assets.
                  </>
                }
              >
                <SolidityInput
                  solidityType="address"
                  className="bg-background"
                  {...props.form.register("royaltyRecipient")}
                  client={props.client}
                />
              </FormFieldSetup>

              <FormFieldSetup
                isRequired
                label="Percentage"
                className="shrink-0 md:max-w-[150px]"
                errorMessage={errors.royaltyBps?.message}
              >
                <BasisPointsInput
                  className="bg-background"
                  value={bpsNumValue}
                  onChange={(value) => props.form.setValue("royaltyBps", value)}
                  defaultValue={0}
                />
              </FormFieldSetup>
            </div>
          </div>
        </StepCard>
      </form>
    </Form>
  );
}

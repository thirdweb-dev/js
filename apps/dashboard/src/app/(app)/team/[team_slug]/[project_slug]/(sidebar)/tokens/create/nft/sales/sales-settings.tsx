import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import type { UseFormReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Form } from "@/components/ui/form";
import { SolidityInput } from "../../../../../../../../../../contract-ui/components/solidity-inputs";
import { StepCard } from "../../_common/step-card";
import type { NFTSalesSettingsFormValues } from "../_common/form";

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
          nextButton={{
            type: "submit",
          }}
          prevButton={{
            onClick: props.onPrev,
          }}
          title="Sales and Fees"
        >
          <div className="px-4 py-6 md:px-6">
            <div className="mb-4 space-y-1">
              <h3 className="font-semibold text-base"> Primary Sales</h3>
              <p className="text-muted-foreground text-sm">
                Set the wallet address that should receive the revenue from
                initial sales of the tokens
              </p>
            </div>
            <FormFieldSetup
              className="grow"
              errorMessage={errors.primarySaleRecipient?.message}
              isRequired
              label="Primary Sales Recipient"
            >
              <SolidityInput
                className="bg-background"
                solidityType="address"
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
                earned from secondary sales of the tokens
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <FormFieldSetup
                className="grow"
                errorMessage={errors.royaltyRecipient?.message}
                helperText={
                  <>
                    The wallet address that should receive the revenue from
                    royalties earned from secondary sales of the tokens.
                  </>
                }
                isRequired
                label="Recipient Address"
              >
                <SolidityInput
                  className="bg-background"
                  solidityType="address"
                  {...props.form.register("royaltyRecipient")}
                  client={props.client}
                />
              </FormFieldSetup>

              <FormFieldSetup
                className="shrink-0 md:max-w-[150px]"
                errorMessage={errors.royaltyBps?.message}
                isRequired
                label="Percentage"
              >
                <BasisPointsInput
                  className="bg-background"
                  defaultValue={0}
                  onChange={(value) => props.form.setValue("royaltyBps", value)}
                  value={bpsNumValue}
                />
              </FormFieldSetup>
            </div>
          </div>
        </StepCard>
      </form>
    </Form>
  );
}

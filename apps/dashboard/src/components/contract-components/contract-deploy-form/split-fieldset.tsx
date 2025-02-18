import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { InfoIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { ZERO_ADDRESS } from "thirdweb";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface SplitFieldsetProps {
  form: CustomContractDeploymentForm;
}

export interface Recipient {
  address: string;
  sharesBps: number;
}

export const SplitFieldset: React.FC<SplitFieldsetProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    name: "recipients",
    control: form.control,
  });

  const totalShares =
    form
      .watch("recipients")
      ?.reduce((a: number, b: Recipient) => a + b.sharesBps, 0) || 0;

  return (
    <Fieldset legend="Split Settings">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex items-end gap-3">
                <FormFieldSetup
                  className="grow"
                  isRequired={false}
                  label="Recipient Address"
                  errorMessage={
                    form.getFieldState(
                      `recipients.${index}.address`,
                      form.formState,
                    ).error?.message
                  }
                >
                  <SolidityInput
                    solidityType="address"
                    formContext={form}
                    placeholder={ZERO_ADDRESS}
                    {...form.register(`recipients.${index}.address`)}
                  />
                </FormFieldSetup>

                {/*  */}
                <FormFieldSetup
                  label="Percentage"
                  className="max-w-[160px]"
                  isRequired={false}
                  errorMessage={
                    form.getFieldState(
                      `recipients.${index}.sharesBps`,
                      form.formState,
                    ).error?.message
                  }
                >
                  <BasisPointsInput
                    value={form.watch(`recipients.${index}.sharesBps`)}
                    onChange={(value) =>
                      form.setValue(`recipients.${index}.sharesBps`, value, {
                        shouldTouch: true,
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                </FormFieldSetup>

                <Button
                  variant="outline"
                  className="px-3 text-destructive-text"
                  disabled={fields.length === 1 || form.formState.isSubmitting}
                  aria-label="remove row"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* div added to avoid full-width button */}
        <div>
          <Button
            className="gap-2"
            variant="outline"
            size="sm"
            onClick={() => append({ address: "", sharesBps: 0 })}
          >
            <PlusIcon className="size-4" />
            Add Recipient
          </Button>
        </div>

        {totalShares !== 10000 && (
          <Alert
            variant="destructive"
            className="flex h-auto items-center gap-2"
          >
            <InfoIcon className="!text-destructive-text !static size-5 shrink-0" />
            <AlertTitle className="!m-0 !p-0 !text-destructive-text">
              Total shares need to add up to 100%, Total shares currently add up
              to {totalShares / 100}%
            </AlertTitle>
          </Alert>
        )}
      </div>
    </Fieldset>
  );
};

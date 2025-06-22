import { InfoIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { BasisPointsInput } from "@/components/blocks/BasisPointsInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SolidityInput } from "@/components/solidity-inputs";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface SplitFieldsetProps {
  form: CustomContractDeploymentForm;
  client: ThirdwebClient;
}

export interface Recipient {
  address: string;
  sharesBps: number;
}

export const SplitFieldset: React.FC<SplitFieldsetProps> = ({
  form,
  client,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "recipients",
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
              <div className="flex items-end gap-3" key={field.id}>
                <FormFieldSetup
                  className="grow"
                  errorMessage={
                    form.getFieldState(
                      `recipients.${index}.address`,
                      form.formState,
                    ).error?.message
                  }
                  isRequired={false}
                  label="Recipient Address"
                >
                  <SolidityInput
                    client={client}
                    formContext={form}
                    placeholder={ZERO_ADDRESS}
                    solidityType="address"
                    {...form.register(`recipients.${index}.address`)}
                  />
                </FormFieldSetup>

                {/*  */}
                <FormFieldSetup
                  className="max-w-[160px]"
                  errorMessage={
                    form.getFieldState(
                      `recipients.${index}.sharesBps`,
                      form.formState,
                    ).error?.message
                  }
                  isRequired={false}
                  label="Percentage"
                >
                  <BasisPointsInput
                    onChange={(value) =>
                      form.setValue(`recipients.${index}.sharesBps`, value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    value={form.watch(`recipients.${index}.sharesBps`)}
                  />
                </FormFieldSetup>

                <Button
                  aria-label="remove row"
                  className="px-3 text-destructive-text"
                  disabled={fields.length === 1 || form.formState.isSubmitting}
                  onClick={() => remove(index)}
                  variant="outline"
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
            onClick={() => append({ address: "", sharesBps: 0 })}
            size="sm"
            variant="outline"
          >
            <PlusIcon className="size-4" />
            Add Recipient
          </Button>
        </div>

        {totalShares !== 10000 && (
          <Alert
            className="flex h-auto items-center gap-2"
            variant="destructive"
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

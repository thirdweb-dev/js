import { useId } from "react";
import type { ThirdwebClient } from "thirdweb";
import { FileInput } from "@/components/blocks/FileInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CustomContractDeploymentForm } from "../../../../components/custom-contract";
import { ContractDeploymentFieldset } from "./common";

interface ContractMetadataFieldsetProps {
  form: CustomContractDeploymentForm;
  client: ThirdwebClient;
}

export const ContractMetadataFieldset: React.FC<
  ContractMetadataFieldsetProps
> = ({ form, client }) => {
  const nameId = useId();
  const symbolId = useId();
  const descriptionId = useId();

  return (
    <ContractDeploymentFieldset legend="Contract Metadata">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[200px_1fr]">
        <FormFieldSetup
          errorMessage={
            form.getFieldState("contractMetadata.image", form.formState).error
              ?.message
          }
          isRequired={false}
          label="Image"
        >
          <FileInput
            accept={{ "image/*": [] }}
            className="rounded border-border bg-background transition-all duration-200 hover:border-active-border hover:bg-background"
            client={client}
            setValue={(file) =>
              form.setValue("contractMetadata.image", file, {
                shouldTouch: true,
              })
            }
            value={form.watch("contractMetadata.image")}
          />
        </FormFieldSetup>

        <div className="flex flex-col gap-6">
          {/* name + symbol */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
            <FormFieldSetup
              className="grow"
              errorMessage={
                form.getFieldState("contractMetadata.name", form.formState)
                  .error?.message
              }
              htmlFor={nameId}
              isRequired
              label="Name"
            >
              <Input
                id={nameId}
                {...form.register("contractMetadata.name", {
                  required: "Name is Required",
                })}
              />
            </FormFieldSetup>

            <FormFieldSetup
              className="lg:max-w-[300px]"
              errorMessage={
                form.getFieldState("contractMetadata.symbol", form.formState)
                  .error?.message
              }
              htmlFor={symbolId}
              isRequired={false}
              label="Symbol"
            >
              <Input
                {...form.register("contractMetadata.symbol")}
                id={symbolId}
              />
            </FormFieldSetup>
          </div>

          <FormFieldSetup
            className="flex grow flex-col"
            errorMessage={
              form.getFieldState("contractMetadata.description", form.formState)
                .error?.message
            }
            htmlFor={descriptionId}
            isRequired={false}
            label="Description"
          >
            <Textarea
              {...form.register("contractMetadata.description")}
              className="grow"
              id={descriptionId}
            />
          </FormFieldSetup>
        </div>
      </div>
    </ContractDeploymentFieldset>
  );
};
